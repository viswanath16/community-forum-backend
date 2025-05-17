// api/api-docs.ts - API Documentation route for Vercel
import { VercelRequest, VercelResponse } from '@vercel/node';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../src/config/swagger';
import app from '../src/app';
import { routeHandler } from './_utils';

// Handler for Swagger documentation
export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Modify request path to match Express router expectations
    req.url = req.url?.replace(/^\/api-docs/, '/api-docs') || '/api-docs';

    // For the swagger.json request
    if (req.url.includes('/swagger.json')) {
        res.setHeader('Content-Type', 'application/json');
        return res.json(swaggerSpec);
    }

    return routeHandler(req, res, app);
}