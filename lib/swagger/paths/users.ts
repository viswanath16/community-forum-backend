/**
 * Users endpoint documentation
 */

export const userPaths = {
  '/api/users/profile': {
    get: {
      tags: ['Users'],
      summary: 'Get current user profile',
      description: `
Retrieve the authenticated user's profile information including recent activity.

**Authentication Required**: Must be logged in.

**Includes**:
- Complete user profile information
- Neighborhood association details
- Recent event registrations (last 10)
- Events created by user (last 10)
- User reputation and verification status

**Privacy**: Users can only access their own profile through this endpoint.
      `,
      operationId: 'getCurrentUserProfile',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'User profile retrieved successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    type: 'object',
                    properties: {
                      data: { $ref: '#/components/schemas/UserProfile' }
                    }
                  }
                ]
              },
              example: {
                success: true,
                data: {
                  id: '550e8400-e29b-41d4-a716-446655440000',
                  email: 'admin@communityforum.com',
                  username: 'admin',
                  fullName: 'Admin User',
                  avatarUrl: null,
                  phone: null,
                  isAdmin: true,
                  isVerified: true,
                  reputationScore: 100,
                  createdAt: '2025-01-01T00:00:00Z',
                  lastActive: '2025-01-15T10:00:00Z',
                  neighborhood: {
                    id: '550e8400-e29b-41d4-a716-446655440001',
                    name: 'Centrum',
                    city: 'Amsterdam',
                    postalCode: '1012'
                  },
                  eventRegistrations: [
                    {
                      id: 'reg-123',
                      status: 'REGISTERED',
                      registeredAt: '2025-01-10T10:00:00Z',
                      event: {
                        id: '660e8400-e29b-41d4-a716-446655440001',
                        title: 'Community Yoga Session',
                        startDate: '2025-06-01T09:00:00Z',
                        category: 'HEALTH'
                      }
                    }
                  ],
                  events: [
                    {
                      id: '660e8400-e29b-41d4-a716-446655440001',
                      title: 'Community Yoga Session',
                      startDate: '2025-06-01T09:00:00Z',
                      category: 'HEALTH',
                      status: 'ACTIVE'
                    }
                  ]
                }
              }
            }
          }
        },
        '401': { $ref: '#/components/responses/Unauthorized' },
        '500': { $ref: '#/components/responses/InternalServerError' }
      }
    }
  }
}