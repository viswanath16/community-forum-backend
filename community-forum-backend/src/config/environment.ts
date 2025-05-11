// src/config/environment.ts - Final version with explicit types
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export interface Environment {
    NODE_ENV: string;
    PORT: number;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string; // Explicitly string for JWT expiresIn
    DATABASE_URL: string;
}

export const environment: Environment = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '5000', 10),
    JWT_SECRET: process.env.JWT_SECRET || 'your-default-secret-key',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d', // This should be a valid JWT expiration string like '1d', '24h', '60s', etc.
    DATABASE_URL: process.env.DATABASE_URL || '',
};

// Validate required environment variables
const requiredEnvVars: Array<keyof Environment> = ['JWT_SECRET', 'DATABASE_URL'];
for (const envVar of requiredEnvVars) {
    if (!environment[envVar]) {
        console.warn(`Warning: Environment variable ${envVar} is missing. Using default value.`);
    }
}

export default environment;