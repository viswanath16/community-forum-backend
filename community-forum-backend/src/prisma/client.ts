// src/prisma/client.ts
import { PrismaClient } from '@prisma/client';

// Define a type for the global with prisma property
declare global {
    var prisma: PrismaClient | undefined;
}

// Determine log levels based on environment
const logLevels = process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'];

// Initialize PrismaClient with the singleton pattern
const prisma = global.prisma || new PrismaClient({
    log: logLevels as any,
});

// Save PrismaClient to global object in non-production environments
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
