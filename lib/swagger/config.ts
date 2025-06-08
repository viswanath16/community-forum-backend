/**
 * Swagger configuration and base setup
 */

export const swaggerConfig = {
  openapi: '3.0.3',
  info: {
    title: 'Community Forum API',
    version: '1.0.0',
    description: `
# Community Forum API

A comprehensive backend API for connecting local communities across cities in the Netherlands. 
This platform enables residents to engage in community events, marketplace transactions, and neighborhood discussions.

## Features

- **Event Management**: Create, manage, and register for community events
- **Marketplace**: Buy, sell, and trade items within neighborhoods  
- **User Management**: Authentication, profiles, and neighborhood associations
- **Real-time Updates**: Event registrations and marketplace requests

## Authentication

This API uses JWT Bearer token authentication. Include the token in the Authorization header:

\`\`\`
Authorization: Bearer YOUR_JWT_TOKEN
\`\`\`

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@communityforum.com | admin123 |
| User | john.doe@example.com | password123 |

## Rate Limits

- Login attempts: 5 per 15 minutes
- Registration: 3 per hour  
- General API: 100 requests per 15 minutes
- Event creation: 10 per hour (Admin only)
    `,
    contact: {
      name: 'Community Forum Support',
      email: 'support@communityforum.com',
      url: 'https://communityforum.com/support'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    },
    termsOfService: 'https://communityforum.com/terms'
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
  tags: [
    {
      name: 'Authentication',
      description: 'User authentication and authorization endpoints',
      externalDocs: {
        description: 'Authentication Guide',
        url: 'https://docs.communityforum.com/auth'
      }
    },
    {
      name: 'Events',
      description: 'Community event management and registration',
      externalDocs: {
        description: 'Events Guide',
        url: 'https://docs.communityforum.com/events'
      }
    },
    {
      name: 'Marketplace',
      description: 'Marketplace listings, requests, and transactions',
      externalDocs: {
        description: 'Marketplace Guide',
        url: 'https://docs.communityforum.com/marketplace'
      }
    },
    {
      name: 'Users',
      description: 'User profile and account management',
      externalDocs: {
        description: 'User Guide',
        url: 'https://docs.communityforum.com/users'
      }
    },
    {
      name: 'Categories',
      description: 'Category and classification endpoints'
    }
  ],
  externalDocs: {
    description: 'Complete API Documentation',
    url: 'https://docs.communityforum.com'
  }
}