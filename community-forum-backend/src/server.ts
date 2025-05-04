// src/server.ts (Fixed for Swagger UI access)
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { environment } from './config/environment';
import logger from './utils/logger';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import swaggerSpec from './config/swagger';

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Configure CORS to allow Swagger UI
app.use(cors());

// Configure Helmet with exceptions for Swagger
app.use(
    helmet({
        contentSecurityPolicy: false, // This is important for Swagger UI to work
    })
);

// Swagger documentation - place BEFORE API routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: 'Community Forum API Documentation',
}));

// Swagger JSON endpoint
app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// API Routes
app.use('/api/v1', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = environment.PORT;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`API Documentation available at http://localhost:${PORT}/api-docs`);
});

export default app;