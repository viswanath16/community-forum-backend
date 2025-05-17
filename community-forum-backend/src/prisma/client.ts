// src/prisma/client.ts - Modified for Vercel serverless environment
import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit in serverless environments
declare global {
    var prisma: PrismaClient | undefined;
}

// Determine log levels based on environment
const logLevels = process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'];

// Create PrismaClient instance or reuse existing one
const prisma = global.prisma || new PrismaClient({
    log: logLevels as any
});

// Save PrismaClient to global object in non-production environments
if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
} else {
    // For production/serverless environments, ensure connections are managed efficiently
    // Add event listener directly to the process object for Prisma 5.0.0+
    process.on('beforeExit', async () => {
        await prisma.$disconnect();
    });
}

export default prisma;