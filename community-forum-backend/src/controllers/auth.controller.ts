// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { success, error, StatusCode } from '../utils/responses';
import * as authService from '../services/auth.service';

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, firstName, lastName, displayName } = req.body;

        const result = await authService.register({
            email,
            password,
            firstName,
            lastName,
            displayName: displayName || email.split('@')[0], // Default display name to username part of email
        });

        return success(res, 'User registered successfully', { user: result.user }, StatusCode.CREATED);
    } catch (err: any) {
        if (err.message.includes('already exists')) {
            return error(res, 'Email is already registered', err.message, StatusCode.CONFLICT);
        }
        return error(res, 'Failed to register user', err);
    }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const result = await authService.login(email, password);

        return success(res, 'Login successful', {
            user: result.user,
            token: result.token,
        });
    } catch (err: any) {
        if (err.message.includes('Invalid credentials')) {
            return error(res, 'Invalid email or password', err.message, StatusCode.UNAUTHORIZED);
        }
        return error(res, 'Failed to login', err);
    }
};

/**
 * Get the current user's profile
 */
export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return error(res, 'Unauthorized', null, StatusCode.UNAUTHORIZED);
        }

        const profile = await authService.getProfile(req.user.id);

        return success(res, 'Profile retrieved successfully', profile);
    } catch (err) {
        return error(res, 'Failed to retrieve profile', err);
    }
};

/**
 * Update the current user's profile
 */
export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return error(res, 'Unauthorized', null, StatusCode.UNAUTHORIZED);
        }

        const { firstName, lastName, displayName, bio, neighborhood, postalCode, city } = req.body;

        const updatedProfile = await authService.updateProfile(req.user.id, {
            firstName,
            lastName,
            displayName,
            bio,
            neighborhood,
            postalCode,
            city,
        });

        return success(res, 'Profile updated successfully', updatedProfile);
    } catch (err) {
        return error(res, 'Failed to update profile', err);
    }
};

/**
 * Change the current user's password
 */
export const changePassword = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return error(res, 'Unauthorized', null, StatusCode.UNAUTHORIZED);
        }

        const { currentPassword, newPassword } = req.body;

        await authService.changePassword(req.user.id, currentPassword, newPassword);

        return success(res, 'Password changed successfully');
    } catch (err: any) {
        if (err.message.includes('Invalid current password')) {
            return error(res, 'Invalid current password', err.message, StatusCode.BAD_REQUEST);
        }
        return error(res, 'Failed to change password', err);
    }
};

/**
 * Request a password reset
 */
export const requestPasswordReset = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        await authService.requestPasswordReset(email);

        // Always return success even if email doesn't exist for security reasons
        return success(res, 'Password reset instructions sent to your email if it exists in our system');
    } catch (err) {
        // Log the error but don't expose it to the client
        console.error('Password reset request error:', err);
        return success(res, 'Password reset instructions sent to your email if it exists in our system');
    }
};

/**
 * Reset password with token
 */
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, newPassword } = req.body;

        await authService.resetPassword(token, newPassword);

        return success(res, 'Password reset successful');
    } catch (err: any) {
        if (err.message.includes('invalid') || err.message.includes('expired')) {
            return error(res, 'Invalid or expired reset token', err.message, StatusCode.BAD_REQUEST);
        }
        return error(res, 'Failed to reset password', err);
    }
};

/**
 * Refresh the current user's token
 */
export const refreshToken = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return error(res, 'Unauthorized', null, StatusCode.UNAUTHORIZED);
        }

        const token = await authService.generateToken(req.user.id);

        return success(res, 'Token refreshed successfully', { token });
    } catch (err) {
        return error(res, 'Failed to refresh token', err);
    }
};

/**
 * Get the current user with full details
 */
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return error(res, 'Unauthorized', null, StatusCode.UNAUTHORIZED);
        }

        const user = await authService.getUserWithDetails(req.user.id);

        return success(res, 'User data retrieved successfully', user);
    } catch (err) {
        return error(res, 'Failed to retrieve user data', err);
    }
};