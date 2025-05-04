import { Express } from 'express-serve-static-core';

// Extend Express Request interface with our custom properties
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: string;
            };
        }
    }
}