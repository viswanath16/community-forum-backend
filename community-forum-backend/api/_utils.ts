// api/_utils.ts - Utility functions for API routing
import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Express, Request, Response, NextFunction } from 'express';

// Helper function to handle Express route in serverless environment
export async function routeHandler(req: VercelRequest, res: VercelResponse, app: any) {
    return new Promise<void>((resolve) => {
        // Create an adapter to bridge Express and Vercel
        const handler = (req: any, res: any, next: any) => {
            app(req, res, (err: any) => {
                if (err) {
                    console.error('Express middleware error:', err);
                    res.status(500).json({
                        success: false,
                        message: 'Internal Server Error',
                        error: process.env.NODE_ENV === 'development' ? err.message : undefined
                    });
                    return resolve();
                }

                // If no response has been sent by now, send a 404
                if (!res.writableEnded) {
                    res.status(404).json({
                        success: false,
                        message: 'Not found'
                    });
                    resolve();
                }
            });
        };

        // Run the handler with the request and response
        handler(req, res, (err: any) => {
            if (err) {
                console.error('Express error:', err);
                if (!res.writableEnded) {
                    res.status(500).json({ error: 'Internal Server Error' });
                }
                resolve();
            }
        });
    });
}