// src/prisma/client.ts - Optimized for Vercel's serverless environment
import { PrismaClient } from '@prisma/client';
import { env } from 'process';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Determine log levels based on environment
const logLevels = env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'];

// Initialize PrismaClient
export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: logLevels as any,
    });

// Save PrismaClient to global object in non-production environments
if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;