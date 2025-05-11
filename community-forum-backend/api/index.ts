// api/index.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { PrismaClient } = require('@prisma/client');
const routes = require('../dist/routes').default;
const { environment } = require('../dist/config/environment');
const { errorHandler, notFoundHandler } = require('../dist/middlewares/error.middleware');
const swaggerSpec = require('../dist/config/swagger').default;
const swaggerUi = require('swagger-ui-express');

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

// Handle Vercel serverless function
module.exports = app;