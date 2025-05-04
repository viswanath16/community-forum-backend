// src/types.d.ts
declare module 'express' {
    interface Request {
        user?: {
            id: string;
            role: string;
        };
    }
}

declare module 'swagger-jsdoc';
declare module 'swagger-ui-express';
declare module 'bcryptjs';
declare module 'jsonwebtoken';
declare module 'morgan';
declare module 'cors';