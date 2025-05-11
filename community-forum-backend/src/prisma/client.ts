// src/prisma/client.ts - Optimized for Vercel's serverless environment
import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

declare global {
    var prisma: PrismaClient | undefined;
}

// Determine log levels based on environment
const logLevels = process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'];

// Initialize PrismaClient
export const prisma =
    global.prisma ||
    new PrismaClient({
        log: logLevels as any,
    });

// Save PrismaClient to global object in non-production environments
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;