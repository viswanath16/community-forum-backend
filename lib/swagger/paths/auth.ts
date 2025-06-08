/**
 * Authentication endpoint documentation
 */

export const authPaths = {
  '/api/auth/login': {
    post: {
      tags: ['Authentication'],
      summary: 'Login user',
      description: `
Authenticate user credentials and receive a JWT token for subsequent API calls.

**Rate Limit**: 5 attempts per 15 minutes per IP address.

**Token Expiry**: 7 days
      `,
      operationId: 'loginUser',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  description: 'User email address',
                  example: 'admin@communityforum.com'
                },
                password: {
                  type: 'string',
                  minLength: 1,
                  description: 'User password',
                  example: 'admin123'
                }
              }
            },
            examples: {
              admin: {
                summary: 'Admin login',
                value: {
                  email: 'admin@communityforum.com',
                  password: 'admin123'
                }
              },
              user: {
                summary: 'Regular user login',
                value: {
                  email: 'john.doe@example.com',
                  password: 'password123'
                }
              }
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Login successful',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'object',
                        properties: {
                          user: { $ref: '#/components/schemas/User' },
                          token: {
                            type: 'string',
                            description: 'JWT authentication token',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                          }
                        }
                      }
                    }
                  }
                ]
              },
              example: {
                success: true,
                message: 'Login successful',
                data: {
                  user: {
                    id: '550e8400-e29b-41d4-a716-446655440000',
                    email: 'admin@communityforum.com',
                    username: 'admin',
                    fullName: 'Admin User',
                    isAdmin: true,
                    neighborhood: {
                      id: '550e8400-e29b-41d4-a716-446655440001',
                      name: 'Centrum',
                      city: 'Amsterdam'
                    }
                  },
                  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                }
              }
            }
          }
        },
        '400': { $ref: '#/components/responses/BadRequest' },
        '401': {
          description: 'Invalid credentials',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                error: 'Invalid email or password'
              }
            }
          }
        },
        '429': { $ref: '#/components/responses/TooManyRequests' },
        '500': { $ref: '#/components/responses/InternalServerError' }
      }
    }
  },

  '/api/auth/register': {
    post: {
      tags: ['Authentication'],
      summary: 'Register new user',
      description: `
Create a new user account. Email verification is disabled by default for demo purposes.

**Rate Limit**: 3 registrations per hour per IP address.

**Username Requirements**: 
- 3-20 characters
- Alphanumeric and underscore only
- Must be unique

**Password Requirements**:
- Minimum 8 characters
- No complexity requirements for demo
      `,
      operationId: 'registerUser',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password', 'username', 'fullName'],
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  description: 'Valid email address',
                  example: 'newuser@example.com'
                },
                password: {
                  type: 'string',
                  minLength: 8,
                  description: 'Password (minimum 8 characters)',
                  example: 'securepassword123'
                },
                username: {
                  type: 'string',
                  minLength: 3,
                  maxLength: 20,
                  pattern: '^[a-zA-Z0-9_]+$',
                  description: 'Unique username (3-20 chars, alphanumeric + underscore)',
                  example: 'newuser'
                },
                fullName: {
                  type: 'string',
                  minLength: 2,
                  description: 'User full name',
                  example: 'New User'
                },
                neighborhoodId: {
                  type: 'string',
                  format: 'uuid',
                  description: 'Optional neighborhood association',
                  example: '550e8400-e29b-41d4-a716-446655440001'
                }
              }
            },
            example: {
              email: 'newuser@example.com',
              password: 'securepassword123',
              username: 'newuser',
              fullName: 'New User',
              neighborhoodId: '550e8400-e29b-41d4-a716-446655440001'
            }
          }
        }
      },
      responses: {
        '201': {
          description: 'User registered successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'object',
                        properties: {
                          user: { $ref: '#/components/schemas/User' },
                          token: {
                            type: 'string',
                            description: 'JWT authentication token'
                          }
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        '400': { $ref: '#/components/responses/BadRequest' },
        '409': {
          description: 'User already exists',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                error: 'User with this email or username already exists'
              }
            }
          }
        },
        '429': { $ref: '#/components/responses/TooManyRequests' },
        '500': { $ref: '#/components/responses/InternalServerError' }
      }
    }
  }
}