// src/config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../package.json';
import { environment } from './environment'; // Import your environment config

const PORT = environment.PORT || 5000; // Get the same port your server is using

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Community Forum API',
            version,
            description: 'API documentation for Community Forum application',
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT',
            },
            contact: {
                name: 'API Support',
                email: 'support@communityforum.com',
            },
        },
        servers: [
            {
                url: `http://localhost:${PORT}/api/v1`,  // Dynamically use the correct port
                description: 'Development Server',
            },
            {
                url: 'https://api.communityforum.com/v1',
                description: 'Production Server',
            },
        ],
        // Components are defined in src/models/swagger.schemas.ts
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    // Include all files with Swagger documentation
    apis: [
        './src/controllers/*.ts',
        './src/controllers/*.swagger.ts',
        './src/models/swagger.schemas.ts',
        './src/routes/*.ts'
    ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;