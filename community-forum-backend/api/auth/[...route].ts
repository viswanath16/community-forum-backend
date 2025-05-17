// api/auth/[...route].ts - Vercel API endpoint for auth routes
import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../../src/app';
import { routeHandler } from '../_utils';

// Handler for all auth routes
export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        // Modify request path to match Express router expectations
        // The original path would be /api/auth/[route], but Express router expects /api/v1/auth/[route]
        const enhancedReq: any = req;
        const originalUrl = req.url || '';
        enhancedReq.url = originalUrl.replace(/^\/api\/auth/, '/api/v1/auth');

        // Add Express-specific methods
        enhancedReq.get = function(name: string) {
            return this.headers[name.toLowerCase()];
        };
        enhancedReq.app = { locals: {} };

        return await routeHandler(enhancedReq, res, app);
    } catch (error) {
        console.error('Auth route error:', error);
        if (!res.writableEnded) {
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
            });
        }
    }
}