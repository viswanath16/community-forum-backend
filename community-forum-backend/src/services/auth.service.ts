// src/services/auth.service.ts
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { environment } from '../config/environment';
import prisma from '../prisma/client';
import jwt, { SignOptions } from 'jsonwebtoken';

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

    const options: SignOptions = {
        expiresIn: environment.JWT_EXPIRES_IN
    };

    return jwt.sign(payload, environment.JWT_SECRET, options);
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
 * Remaining functions would be updated similarly...
 * (changePassword, requestPasswordReset, resetPassword)
 * These would integrate with Supabase Auth in a real implementation
 */