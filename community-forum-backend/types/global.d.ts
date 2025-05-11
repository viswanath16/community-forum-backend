// types/global.d.ts
/// <reference types="node" />

declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV?: string;
        PORT?: string;
        JWT_SECRET?: string;
        JWT_EXPIRES_IN?: string;
        DATABASE_URL?: string;
        VERCEL?: string;
    }
}

// For Vercel
declare module '@vercel/node' {
    import { IncomingMessage, ServerResponse } from 'http';

    export interface VercelRequest extends IncomingMessage {
        body: any;
        query: { [key: string]: string | string[] };
    }

    export interface VercelResponse extends ServerResponse {}
}