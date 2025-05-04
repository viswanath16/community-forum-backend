// src/prisma/client.ts - Optimized for Vercel's serverless environment
import { PrismaClient } from '@prisma/client';

// Define global type for Prisma
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
        log: logLevels,
    });

// Save PrismaClient to global object in non-production environments
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;