// api/marketplace/[...route].ts - Vercel API endpoint for marketplace routes
import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../../src/app';
import { routeHandler } from '../_utils';

// Handler for all marketplace routes
export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Modify request path to match Express router expectations
    const originalUrl = req.url || '';
    req.url = originalUrl.replace(/^\/api\/marketplace/, '/api/v1/marketplace');

    return routeHandler(req, res, app);
}