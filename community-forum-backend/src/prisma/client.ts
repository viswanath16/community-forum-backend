// src/prisma/client.ts - Modified for Vercel serverless environment
import { PrismaClient } from '@prisma/client';
import { PrismaClientOptions } from '@prisma/client/runtime/library';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit in serverless environments
declare global {
    var prisma: PrismaClient | undefined;
}

// Determine log levels based on environment
const logLevels = process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'];

// Initialize Prisma with options specific to serverless deployment
const prismaOptions: PrismaClientOptions = {
    log: logLevels as any,
    // Add connection pooling for serverless environment
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
};

// Create PrismaClient instance or reuse existing one
const prisma = global.prisma || new PrismaClient(prismaOptions);

// Save PrismaClient to global object in non-production environments
if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
} else {
    // For production/serverless environments, ensure connections are managed efficiently
    // This helps with connection pooling in serverless functions
    prisma.$on('beforeExit', async () => {
        await prisma.$disconnect();
    });
}

export default prisma;