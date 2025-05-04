// api/index.ts
import app from '../src/server';
import { Request, Response } from 'express';

// Export the Express app as a serverless function
export default async function handler(req: Request, res: Response) {
    // Forward the request to the Express app
    return app(req, res);
}