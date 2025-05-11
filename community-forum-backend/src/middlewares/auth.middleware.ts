// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { environment } from '../config/environment';
import { error, StatusCode } from '../utils/responses';
import prisma from '../prisma/client';

interface DecodedToken {
    id: string;
    role: string;
    iat: number;
    exp: number;
}

// Extend Request instead of creating a new interface
export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return error(res, 'Authorization token required', null, StatusCode.UNAUTHORIZED);
        }

        const token = authHeader.split(' ')[1];

        // Verify the token
        const decoded = jwt.verify(token, environment.JWT_SECRET) as DecodedToken;

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            return error(res, 'User not found', null, StatusCode.UNAUTHORIZED);
        }

        // Add user info to request
        req.user = {
            id: user.id,
            role: user.role, // Use the role from the database
        };

        next();
    } catch (err) {
        console.error('Authentication error:', err);
        return error(res, 'Invalid or expired token', null, StatusCode.UNAUTHORIZED);
    }
};

export const authorize = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return error(res, 'Unauthorized', null, StatusCode.UNAUTHORIZED);
        }

        if (!roles.includes(req.user.role)) {
            return error(res, 'Insufficient permissions', null, StatusCode.FORBIDDEN);
        }

        next();
    };
};