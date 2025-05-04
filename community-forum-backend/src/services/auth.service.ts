// src/services/auth.service.ts
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { environment } from '../config/environment';
import prisma from '../prisma/client';
import jwt, { Secret } from 'jsonwebtoken';


interface RegisterInput {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    displayName: string;
}

interface ProfileUpdateInput {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    bio?: string;
    neighborhood?: string;
    postalCode?: string;
    city?: string;
    avatar?: string;
}

/**
 * Register a new user
 */
export const register = async (data: RegisterInput) => {
    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // Create user
    const user = await prisma.user.create({
        data: {
            email: data.email,
            // Store password hash in auth.users table (integrated with Supabase Auth)
            // This implementation depends on your Supabase setup
            profile: {
                create: {
                    displayName: data.displayName,
                    firstName: data.firstName,
                    lastName: data.lastName,
                },
            },
        },
    });

    // Generate token
    const token = generateToken(user.id);

    return { user, token };
};

/**
 * Login user
 */
export const login = async (email: string, password: string) => {
    // Find user by email
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            profile: true,
        },
    });

    if (!user) {
        throw new Error('Invalid credentials');
    }

    // In a real implementation, password verification would be handled by Supabase Auth
    // This is a simplified version for demonstration
    const isMatch = await bcrypt.compare(password, 'hashedPassword');

    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    // Generate token
    const token = generateToken(user.id);

    return { user, token };
};

/**
 * Generate JWT token
 */
// Fix
export const generateToken = (userId: string) => {
    return jwt.sign(
        { id: userId },
        environment.JWT_SECRET as string,
        { expiresIn: environment.JWT_EXPIRES_IN }
    );
};

/**
 * Get user profile
 */
export const getProfile = async (userId: string) => {
    const profile = await prisma.profile.findUnique({
        where: { userId },
        include: {
            interests: true,
        },
    });

    if (!profile) {
        throw new Error('Profile not found');
    }

    return profile;
};

/**
 * Update user profile
 */
export const updateProfile = async (userId: string, data: ProfileUpdateInput) => {
    return prisma.profile.update({
        where: { userId },
        data,
    });
};

/**
 * Change user password
 */
export const changePassword = async (userId: string, currentPassword: string, newPassword: string) => {
    // Find user
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new Error('User not found');
    }

    // In a real implementation, password verification would be handled by Supabase Auth
    // This is a simplified version for demonstration
    const isMatch = await bcrypt.compare(currentPassword, 'hashedPassword');

    if (!isMatch) {
        throw new Error('Invalid current password');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in Supabase Auth
    // This would typically involve using Supabase's admin client
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (email: string) => {
    // Find user by email
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        // Don't reveal if user exists for security reasons
        return;
    }

    // Generate reset token and expiry
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    // Store reset token in database
    // This would typically be handled by Supabase Auth or a custom table

    // Send reset email (mock implementation)
    console.log(`Reset token for ${email}: ${resetToken}`);
};

/**
 * Reset password with token
 */
export const resetPassword = async (token: string, newPassword: string) => {
    // Verify token
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token
    // This would typically involve checking a custom table or using Supabase's admin client

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in Supabase Auth
    // This would typically involve using Supabase's admin client
};

/**
 * Get user with details for profile page
 */
export const getUserWithDetails = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            profile: {
                include: {
                    interests: true,
                },
            },
            _count: {
                select: {
                    posts: true,
                    marketListings: true,
                    events: true,
                },
            },
        },
    });

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};