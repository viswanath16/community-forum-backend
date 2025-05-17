// api/auth/[...route].ts - Vercel API endpoint for auth routes
import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../../src/app';
import { routeHandler } from '../_utils';

// Handler for all auth routes
export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Modify request path to match Express router expectations
    // The original path would be /api/auth/[route], but Express router expects /api/v1/auth/[route]
    const originalUrl = req.url || '';
    req.url = originalUrl.replace(/^\/api\/auth/, '/api/v1/auth');

    return routeHandler(req, res, app);
}