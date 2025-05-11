// src/config/environment.ts
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export interface Environment {
    NODE_ENV: string;
    PORT: number;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    DATABASE_URL: string;
}

// Ensure process is available
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV?: string;
            PORT?: string;
            JWT_SECRET?: string;
            JWT_EXPIRES_IN?: string;
            DATABASE_URL?: string;
            VERCEL?: string;
        }
    }
}

export const environment: Environment = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '5000', 10),
    JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
    DATABASE_URL: process.env.DATABASE_URL || '',
};

// Validate required environment variables
const requiredEnvVars: Array<keyof Environment> = ['JWT_SECRET', 'DATABASE_URL'];
for (const envVar of requiredEnvVars) {
    if (!environment[envVar]) {
        throw new Error(`Environment variable ${envVar} is missing`);
    }
}

export default environment;