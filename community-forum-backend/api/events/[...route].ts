// api/events/[...route].ts - Vercel API endpoint for events routes
import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../../src/app';
import { routeHandler } from '../_utils';

// Handler for all events routes
export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Modify request path to match Express router expectations
    const originalUrl = req.url || '';
    req.url = originalUrl.replace(/^\/api\/events/, '/api/v1/events');

    return routeHandler(req, res, app);
}