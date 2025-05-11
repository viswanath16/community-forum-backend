// api/index.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import routes from '../routes';
import { environment } from '../config/environment';
import { errorHandler, notFoundHandler } from '../middlewares/error.middleware';
import swaggerSpec from '../config/swagger';
import swaggerUi from 'swagger-ui-express';

// Initialize Prisma client
const prisma = new PrismaClient();

// Create Express app
const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false, // For Swagger UI
}));

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV });
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: 'Community Forum API Documentation',
}));

// API Routes
app.use('/api/v1', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Export for Vercel
export default app;
