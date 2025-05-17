// api/health.ts - Health check endpoint for Vercel
import { VercelRequest, VercelResponse } from '@vercel/node';
import { environment } from '../src/config/environment';

// Health check endpoint
export default function handler(req: VercelRequest, res: VercelResponse) {
    res.status(200).json({
        success: true,
        status: 'ok',
        environment: environment.NODE_ENV,
        timestamp: new Date().toISOString(),
        vercel: true
    });
}