// api/index.ts - Vercel API Adapter for Express
import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/app';

// Create a serverless function handler that passes requests to the Express app
export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Simulate Express request/response handling in a serverless context
    return new Promise((resolve, reject) => {
        // Create a mock ServerResponse object with needed Vercel response methods
        const mockRes = {
            ...res,
            getHeader: res.getHeader.bind(res),
            setHeader: res.setHeader.bind(res),
            statusCode: 200,
            locals: {},
            end: (data: any) => {
                if (data) res.end(data);
                else res.end();
                resolve(undefined);
            }
        };

        // Process the request through the Express app
        app(req, mockRes, (err: any) => {
            if (err) {
                console.error('Express middleware error:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return resolve(undefined);
            }

            // If no response has been sent by now, end it
            if (!res.writableEnded) {
                res.status(404).json({ error: 'Not found' });
                resolve(undefined);
            }
        });
    });
}