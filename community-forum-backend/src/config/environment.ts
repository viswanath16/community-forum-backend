// src/config/environment.ts
import dotenv from 'dotenv';

// Import node types explicitly
import { env } from 'process';

// Load environment variables from .env file
dotenv.config();

export interface Environment {
    NODE_ENV: string;
    PORT: number;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    DATABASE_URL: string;
}

export const environment: Environment = {
    NODE_ENV: env.NODE_ENV || 'development',
    PORT: parseInt(env.PORT || '5000', 10),
    JWT_SECRET: env.JWT_SECRET || 'default_jwt_secret',
    JWT_EXPIRES_IN: env.JWT_EXPIRES_IN || '1d',
    DATABASE_URL: env.DATABASE_URL || '',
};

// Validate required environment variables
const requiredEnvVars: Array<keyof Environment> = ['JWT_SECRET', 'DATABASE_URL'];
for (const envVar of requiredEnvVars) {
    if (!environment[envVar]) {
        throw new Error(`Environment variable ${envVar} is missing`);
    }
}

export default environment;