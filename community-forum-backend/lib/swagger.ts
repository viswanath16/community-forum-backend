import { createSwaggerSpec } from 'next-swagger-doc'

export const getApiDocs = async () => {
    const spec = createSwaggerSpec({
        apiFolder: 'app/api',
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Community Forum API',
                version: '1.0.0',
                description: 'API documentation for Community Forum Event Module',
                contact: {
                    name: 'Community Forum Support',
                    email: 'support@communityforum.com'
                }
            },
            servers: [
                {
                    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
                    description: 'Development server'
                },
                {
                    url: 'https://community-forum-backend.vercel.app',
                    description: 'Production server'
                }
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                        description: 'Enter JWT token'
                    }
                },
                schemas: {
                    User: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', format: 'uuid' },
                            email: { type: 'string', format: 'email' },
                            username: { type: 'string' },
                            fullName: { type: 'string' },
                            isAdmin: { type: 'boolean' },
                            neighborhood: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string', format: 'uuid' },
                                    name: { type: 'string' },
                                    city: { type: 'string' }
                                }
                            }
                        }
                    },
                    Event: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', format: 'uuid' },
                            title: { type: 'string' },
                            description: { type: 'string' },
                            category: {
                                type: 'string',
                                enum: ['SPORTS', 'CULTURAL', 'EDUCATIONAL', 'VOLUNTEER', 'SOCIAL', 'BUSINESS', 'HEALTH', 'ENVIRONMENT', 'TECHNOLOGY', 'OTHER']
                            },
                            startDate: { type: 'string', format: 'date-time' },
                            endDate: { type: 'string', format: 'date-time' },
                            location: { type: 'string' },
                            capacity: { type: 'integer' },
                            status: {
                                type: 'string',
                                enum: ['ACTIVE', 'CANCELLED', 'COMPLETED', 'DRAFT']
                            },
                            creator: { $ref: '#/components/schemas/User' },
                            neighborhood: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string', format: 'uuid' },
                                    name: { type: 'string' },
                                    city: { type: 'string' }
                                }
                            }
                        }
                    },
                    ApiResponse: {
                        type: 'object',
                        properties: {
                            success: { type: 'boolean' },
                            data: {},
                            error: { type: 'string' },
                            message: { type: 'string' },
                            pagination: {
                                type: 'object',
                                properties: {
                                    page: { type: 'integer' },
                                    limit: { type: 'integer' },
                                    total: { type: 'integer' },
                                    totalPages: { type: 'integer' }
                                }
                            }
                        }
                    }
                }
            },
            tags: [
                { name: 'Authentication', description: 'User authentication endpoints' },
                { name: 'Events', description: 'Event management endpoints' },
                { name: 'Users', description: 'User management endpoints' }
            ]
        }
    })
    return spec
}