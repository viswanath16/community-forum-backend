// api/_utils.ts - Utility functions for API routing
import { Express } from 'express';
import { VercelRequest, VercelResponse } from '@vercel/node';

// Helper function to handle Express route in serverless environment
export async function routeHandler(req: VercelRequest, res: VercelResponse, app: Express) {
    return new Promise((resolve) => {
        app(req, res, (err: any) => {
            if (err) {
                console.error('Express middleware error:', err);
                res.status(500).json({
                    success: false,
                    message: 'Internal Server Error',
                    error: process.env.NODE_ENV === 'development' ? err.message : undefined
                });
                return resolve(undefined);
            }

            // If no response has been sent by now, send a 404
            if (!res.writableEnded) {
                res.status(404).json({
                    success: false,
                    message: 'Not found'
                });
                resolve(undefined);
            }
        });
    });
}