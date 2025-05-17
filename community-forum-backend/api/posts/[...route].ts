// api/posts/[...route].ts - Vercel API endpoint for posts routes
import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../../src/app';
import { routeHandler } from '../_utils';

// Handler for all posts routes
export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Modify request path to match Express router expectations
    const originalUrl = req.url || '';
    req.url = originalUrl.replace(/^\/api\/posts/, '/api/v1/posts');

    return routeHandler(req, res, app);
}