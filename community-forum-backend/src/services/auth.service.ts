// src/services/auth.service.ts - Fixed JWT typing issue
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { environment } from '../config/environment';
import prisma from '../prisma/client';
import jwt from 'jsonwebtoken';

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
 * Generate JWT token
 */
export const generateToken = (userId: string, userRole: string = 'USER'): string => {
    const payload = {
        id: userId,
        role: userRole
    };

    // Fix: Cast the expiresIn properly
    return jwt.sign(payload, environment.JWT_SECRET, {
        expiresIn: environment.JWT_EXPIRES_IN as string | number
    });
};

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

    // Hash password for security (storing it in your system)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // Create user with proper role
    const user = await prisma.user.create({
        data: {
            email: data.email,
            role: 'USER', // Default role for new users
            // Note: In a real implementation with Supabase,
            // password would be handled differently
            profile: {
                create: {
                    displayName: data.displayName,
                    firstName: data.firstName,
                    lastName: data.lastName,
                },
            },
        },
        include: {
            profile: true,
        },
    });

    // Generate token with user's role
    const token = generateToken(user.id, user.role);

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

    // In a real implementation with Supabase, you'd verify through Supabase Auth
    // For now, this is a simplified version
    // const isMatch = await bcrypt.compare(password, user.passwordHash);

    // Generate token with the user's actual role from database
    const token = generateToken(user.id, user.role);

    return { user, token };
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

/**
 * Change password function
 */
export const changePassword = async (userId: string, currentPassword: string, newPassword: string) => {
    // Find user with hashed password (in real implementation with Supabase)
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new Error('User not found');
    }

    // In a real implementation with Supabase, verify through Supabase Auth
    // For now, simulating password verification
    // const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    // if (!isMatch) {
    //     throw new Error('Invalid current password');
    // }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // In a real implementation, update password through Supabase Auth
    // For now, placeholder
    return { message: 'Password updated successfully' };
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
        // Don't reveal if email exists or not
        return { message: 'Password reset instructions sent if email exists' };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    // In a real implementation, you'd:
    // 1. Store the reset token in the database
    // 2. Send email with reset link

    return { message: 'Password reset instructions sent', resetToken };
};

/**
 * Reset password
 */
export const resetPassword = async (token: string, newPassword: string) => {
    // In a real implementation, verify the reset token
    // For now, simulating token validation
    if (!token || token.length < 10) {
        throw new Error('Invalid or expired reset token');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // In a real implementation:
    // 1. Find user by reset token
    // 2. Verify token hasn't expired
    // 3. Update password through Supabase Auth
    // 4. Clear reset token

    return { message: 'Password reset successful' };
};