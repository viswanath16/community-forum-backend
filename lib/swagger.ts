import { createSwaggerSpec } from 'next-swagger-doc'

export const getApiDocs = async () => {
    const spec = createSwaggerSpec({
        apiFolder: 'app/api',
        definition: {
            openapi: '3.1.0',
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
                            avatarUrl: { type: 'string', format: 'uri' },
                            phone: { type: 'string' },
                            reputationScore: { type: 'integer' },
                            isVerified: { type: 'boolean' },
                            createdAt: { type: 'string', format: 'date-time' },
                            neighborhood: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string', format: 'uuid' },
                                    name: { type: 'string' },
                                    city: { type: 'string' },
                                    postalCode: { type: 'string' }
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
                            coordinates: {
                                type: 'object',
                                properties: {
                                    lat: { type: 'number' },
                                    lng: { type: 'number' }
                                }
                            },
                            capacity: { type: 'integer' },
                            status: {
                                type: 'string',
                                enum: ['ACTIVE', 'CANCELLED', 'COMPLETED', 'DRAFT']
                            },
                            isRecurring: { type: 'boolean' },
                            recurrencePattern: {
                                type: 'object',
                                properties: {
                                    frequency: { type: 'string', enum: ['daily', 'weekly', 'monthly'] },
                                    interval: { type: 'integer' },
                                    endDate: { type: 'string', format: 'date-time' }
                                }
                            },
                            imageUrl: { type: 'string', format: 'uri' },
                            creator: { $ref: '#/components/schemas/User' },
                            neighborhood: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string', format: 'uuid' },
                                    name: { type: 'string' },
                                    city: { type: 'string' }
                                }
                            },
                            registrations: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/EventRegistration' }
                            }
                        }
                    },
                    EventRegistration: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', format: 'uuid' },
                            eventId: { type: 'string', format: 'uuid' },
                            userId: { type: 'string', format: 'uuid' },
                            status: {
                                type: 'string',
                                enum: ['REGISTERED', 'WAITLIST', 'CANCELLED', 'ATTENDED']
                            },
                            registeredAt: { type: 'string', format: 'date-time' },
                            notes: { type: 'string' },
                            user: { $ref: '#/components/schemas/User' }
                        }
                    },
                    Neighborhood: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', format: 'uuid' },
                            name: { type: 'string' },
                            city: { type: 'string' },
                            postalCode: { type: 'string' },
                            description: { type: 'string' },
                            boundaryCoordinates: {
                                type: 'object',
                                properties: {
                                    type: { type: 'string' },
                                    coordinates: { type: 'array', items: { type: 'array', items: { type: 'number' } } }
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
                { name: 'Users', description: 'User management endpoints' },
                { name: 'Neighborhoods', description: 'Neighborhood management endpoints' }
            ]
        }
    })
    return spec
}