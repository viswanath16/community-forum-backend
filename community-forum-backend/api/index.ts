// api/index.ts - Vercel API Adapter for Express
import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/app';
import { routeHandler } from './_utils';

// Create a serverless function handler that passes requests to the Express app
export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        // Ensure we have the expected Express properties
        // These are used by Express but might not be present in VercelRequest
        const enhancedReq: any = req;

        if (!enhancedReq.get) {
            enhancedReq.get = function(name: string) {
                return this.headers[name.toLowerCase()];
            };
        }

        // Add any other Express methods we need
        enhancedReq.app = { locals: {} };

        if (!enhancedReq.path) {
            const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
            enhancedReq.path = url.pathname;
        }

        return await routeHandler(enhancedReq, res, app);
    } catch (error) {
        console.error('Server error:', error);

        // Ensure we send a response even if there's an error
        if (!res.writableEnded) {
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
            });
        }
    }
}