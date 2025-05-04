// src/config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../package.json';

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
                url: 'http://localhost:5000/api/v1',
                description: 'Development Server',
            },
            {
                url: 'https://api.communityforum.com/v1',
                description: 'Production Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    required: ['id', 'email'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'User ID',
                        },
                        email: {
                            type: 'string',
                            description: 'User email',
                        },
                        role: {
                            type: 'string',
                            enum: ['USER', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'],
                            description: 'User role',
                        },
                        profile: {
                            $ref: '#/components/schemas/Profile',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Last update timestamp',
                        },
                    },
                },
                Profile: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Profile ID',
                        },
                        userId: {
                            type: 'string',
                            description: 'User ID',
                        },
                        displayName: {
                            type: 'string',
                            description: 'Display name',
                        },
                        firstName: {
                            type: 'string',
                            description: 'First name',
                        },
                        lastName: {
                            type: 'string',
                            description: 'Last name',
                        },
                        bio: {
                            type: 'string',
                            description: 'User bio',
                        },
                        avatar: {
                            type: 'string',
                            description: 'Avatar URL',
                        },
                        neighborhood: {
                            type: 'string',
                            description: 'Neighborhood name',
                        },
                        city: {
                            type: 'string',
                            description: 'City name',
                        },
                        interests: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Interest',
                            },
                        },
                    },
                },
                Interest: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Interest ID',
                        },
                        name: {
                            type: 'string',
                            description: 'Interest name',
                        },
                    },
                },
                Event: {
                    type: 'object',
                    required: ['title', 'description', 'startDate', 'endDate', 'categoryId'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Event ID',
                        },
                        title: {
                            type: 'string',
                            description: 'Event title',
                        },
                        description: {
                            type: 'string',
                            description: 'Event description',
                        },
                        startDate: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Event start date and time',
                        },
                        endDate: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Event end date and time',
                        },
                        location: {
                            type: 'string',
                            description: 'Event location',
                        },
                        address: {
                            type: 'string',
                            description: 'Event address',
                        },
                        isOnline: {
                            type: 'boolean',
                            description: 'Whether the event is online',
                        },
                        meetingUrl: {
                            type: 'string',
                            description: 'URL for online meeting',
                        },
                        capacity: {
                            type: 'integer',
                            description: 'Maximum attendees capacity',
                        },
                        isFree: {
                            type: 'boolean',
                            description: 'Whether the event is free',
                        },
                        price: {
                            type: 'number',
                            description: 'Event price',
                        },
                        image: {
                            type: 'string',
                            description: 'Event image URL',
                        },
                        isPublished: {
                            type: 'boolean',
                            description: 'Whether the event is published',
                        },
                        creatorId: {
                            type: 'string',
                            description: 'Event creator ID',
                        },
                        categoryId: {
                            type: 'string',
                            description: 'Event category ID',
                        },
                        neighborhoodId: {
                            type: 'string',
                            description: 'Neighborhood ID',
                        },
                        creator: {
                            $ref: '#/components/schemas/User',
                        },
                        category: {
                            $ref: '#/components/schemas/Category',
                        },
                        neighborhood: {
                            $ref: '#/components/schemas/Neighborhood',
                        },
                    },
                },
                MarketListing: {
                    type: 'object',
                    required: ['title', 'description', 'categoryId'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Listing ID',
                        },
                        title: {
                            type: 'string',
                            description: 'Listing title',
                        },
                        description: {
                            type: 'string',
                            description: 'Listing description',
                        },
                        price: {
                            type: 'number',
                            description: 'Listing price',
                        },
                        isFree: {
                            type: 'boolean',
                            description: 'Whether the item is free',
                        },
                        condition: {
                            type: 'string',
                            enum: ['NEW', 'LIKE_NEW', 'GOOD', 'USED', 'WORN'],
                            description: 'Item condition',
                        },
                        images: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                            description: 'Array of image URLs',
                        },
                        status: {
                            type: 'string',
                            enum: ['ACTIVE', 'RESERVED', 'SOLD', 'CLOSED'],
                            description: 'Listing status',
                        },
                        sellerId: {
                            type: 'string',
                            description: 'Seller ID',
                        },
                        categoryId: {
                            type: 'string',
                            description: 'Category ID',
                        },
                        seller: {
                            $ref: '#/components/schemas/User',
                        },
                        category: {
                            $ref: '#/components/schemas/Category',
                        },
                    },
                },
                Post: {
                    type: 'object',
                    required: ['title', 'content', 'categoryId'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Post ID',
                        },
                        title: {
                            type: 'string',
                            description: 'Post title',
                        },
                        content: {
                            type: 'string',
                            description: 'Post content',
                        },
                        isAnonymous: {
                            type: 'boolean',
                            description: 'Whether the post is anonymous',
                        },
                        isPinned: {
                            type: 'boolean',
                            description: 'Whether the post is pinned',
                        },
                        status: {
                            type: 'string',
                            enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED', 'REMOVED'],
                            description: 'Post status',
                        },
                        authorId: {
                            type: 'string',
                            description: 'Author ID',
                        },
                        categoryId: {
                            type: 'string',
                            description: 'Category ID',
                        },
                        author: {
                            $ref: '#/components/schemas/User',
                        },
                        category: {
                            $ref: '#/components/schemas/Category',
                        },
                        media: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Media',
                            },
                        },
                    },
                },
                Comment: {
                    type: 'object',
                    required: ['content', 'postId'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Comment ID',
                        },
                        content: {
                            type: 'string',
                            description: 'Comment content',
                        },
                        isAnonymous: {
                            type: 'boolean',
                            description: 'Whether the comment is anonymous',
                        },
                        authorId: {
                            type: 'string',
                            description: 'Author ID',
                        },
                        postId: {
                            type: 'string',
                            description: 'Post ID',
                        },
                        parentId: {
                            type: 'string',
                            description: 'Parent comment ID for replies',
                        },
                        author: {
                            $ref: '#/components/schemas/User',
                        },
                        replies: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Comment',
                            },
                        },
                    },
                },
                Category: {
                    type: 'object',
                    required: ['name', 'type'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Category ID',
                        },
                        name: {
                            type: 'string',
                            description: 'Category name',
                        },
                        description: {
                            type: 'string',
                            description: 'Category description',
                        },
                        icon: {
                            type: 'string',
                            description: 'Category icon',
                        },
                        type: {
                            type: 'string',
                            enum: ['EVENT', 'MARKET', 'POST'],
                            description: 'Category type',
                        },
                        parentId: {
                            type: 'string',
                            description: 'Parent category ID',
                        },
                    },
                },
                Media: {
                    type: 'object',
                    required: ['url', 'type'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Media ID',
                        },
                        url: {
                            type: 'string',
                            description: 'Media URL',
                        },
                        type: {
                            type: 'string',
                            enum: ['IMAGE', 'VIDEO', 'DOCUMENT', 'AUDIO'],
                            description: 'Media type',
                        },
                        title: {
                            type: 'string',
                            description: 'Media title',
                        },
                        description: {
                            type: 'string',
                            description: 'Media description',
                        },
                    },
                },
                Neighborhood: {
                    type: 'object',
                    required: ['name', 'city'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Neighborhood ID',
                        },
                        name: {
                            type: 'string',
                            description: 'Neighborhood name',
                        },
                        city: {
                            type: 'string',
                            description: 'City name',
                        },
                        description: {
                            type: 'string',
                            description: 'Neighborhood description',
                        },
                        postalCodes: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                            description: 'Postal codes in this neighborhood',
                        },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false,
                        },
                        message: {
                            type: 'string',
                            example: 'Error message',
                        },
                        error: {
                            type: 'object',
                            example: { details: 'Error details' },
                        },
                    },
                },
                RegisterRequest: {
                    type: 'object',
                    required: ['email', 'password', 'displayName'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email',
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            description: 'User password',
                        },
                        displayName: {
                            type: 'string',
                            description: 'Display name',
                        },
                        firstName: {
                            type: 'string',
                            description: 'First name',
                        },
                        lastName: {
                            type: 'string',
                            description: 'Last name',
                        },
                    },
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email',
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            description: 'User password',
                        },
                    },
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true,
                        },
                        message: {
                            type: 'string',
                            example: 'Login successful',
                        },
                        data: {
                            type: 'object',
                            properties: {
                                user: {
                                    $ref: '#/components/schemas/User',
                                },
                                token: {
                                    type: 'string',
                                    description: 'JWT token',
                                },
                            },
                        },
                    },
                },
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true,
                        },
                        message: {
                            type: 'string',
                            example: 'Operation successful',
                        },
                        data: {
                            type: 'object',
                            description: 'Response data',
                        },
                    },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;