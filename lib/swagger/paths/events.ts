/**
 * Events endpoint documentation
 */

export const eventPaths = {
  '/api/events': {
    get: {
      tags: ['Events'],
      summary: 'Get community events',
      description: `
Retrieve a paginated list of community events with optional filtering.

**Public Endpoint**: No authentication required.

**Filtering Options**:
- Category-based filtering
- Neighborhood-based filtering  
- Date range filtering
- Text search in title and description

**Sorting**: Events are sorted by start date (ascending) by default.
      `,
      operationId: 'getEvents',
      parameters: [
        { $ref: '#/components/parameters/page' },
        { $ref: '#/components/parameters/limit' },
        { $ref: '#/components/parameters/category' },
        { $ref: '#/components/parameters/neighborhoodId' },
        { $ref: '#/components/parameters/startDate' },
        { $ref: '#/components/parameters/endDate' },
        { $ref: '#/components/parameters/search' }
      ],
      responses: {
        '200': {
          description: 'Events retrieved successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/PaginatedResponse' },
                  {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Event' }
                      }
                    }
                  }
                ]
              },
              examples: {
                success: {
                  summary: 'Successful response',
                  value: {
                    success: true,
                    data: [
                      {
                        id: '660e8400-e29b-41d4-a716-446655440001',
                        title: 'Community Yoga Session',
                        description: 'Join us for a relaxing yoga session',
                        category: 'HEALTH',
                        startDate: '2025-06-01T09:00:00Z',
                        endDate: '2025-06-01T10:30:00Z',
                        location: 'Vondelpark, Amsterdam',
                        capacity: 20,
                        status: 'ACTIVE',
                        creator: {
                          id: '550e8400-e29b-41d4-a716-446655440000',
                          username: 'admin',
                          fullName: 'Admin User'
                        },
                        neighborhood: {
                          id: '550e8400-e29b-41d4-a716-446655440001',
                          name: 'Centrum',
                          city: 'Amsterdam'
                        },
                        _count: { registrations: 5 }
                      }
                    ],
                    pagination: {
                      page: 1,
                      limit: 10,
                      total: 25,
                      totalPages: 3
                    }
                  }
                }
              }
            }
          }
        },
        '400': { $ref: '#/components/responses/BadRequest' },
        '500': { $ref: '#/components/responses/InternalServerError' }
      }
    },

    post: {
      tags: ['Events'],
      summary: 'Create new event',
      description: `
Create a new community event. Only admin users can create events.

**Admin Only**: Requires admin privileges.

**Business Rules**:
- End date must be after start date (if provided)
- Capacity must be positive (if provided)
- Neighborhood must exist
- Coordinates are optional but recommended for location-based features

**Recurring Events**: Set \`isRecurring: true\` and provide \`recurrencePattern\` for repeating events.
      `,
      operationId: 'createEvent',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['title', 'description', 'category', 'startDate', 'location', 'neighborhoodId'],
              properties: {
                title: {
                  type: 'string',
                  minLength: 3,
                  maxLength: 100,
                  description: 'Event title',
                  example: 'Community Yoga Session'
                },
                description: {
                  type: 'string',
                  minLength: 10,
                  maxLength: 2000,
                  description: 'Event description',
                  example: 'Join us for a relaxing yoga session in the park. Suitable for all levels.'
                },
                category: {
                  type: 'string',
                  enum: ['SPORTS', 'CULTURAL', 'EDUCATIONAL', 'VOLUNTEER', 'SOCIAL', 'BUSINESS', 'HEALTH', 'ENVIRONMENT', 'TECHNOLOGY', 'OTHER'],
                  description: 'Event category',
                  example: 'HEALTH'
                },
                startDate: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Event start date and time (ISO 8601)',
                  example: '2025-06-01T09:00:00Z'
                },
                endDate: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Event end date and time (ISO 8601)',
                  example: '2025-06-01T10:30:00Z'
                },
                location: {
                  type: 'string',
                  minLength: 3,
                  maxLength: 200,
                  description: 'Event location',
                  example: 'Vondelpark, Amsterdam'
                },
                capacity: {
                  type: 'integer',
                  minimum: 1,
                  maximum: 10000,
                  description: 'Maximum number of participants',
                  example: 20
                },
                neighborhoodId: {
                  type: 'string',
                  format: 'uuid',
                  description: 'Neighborhood where event takes place',
                  example: '550e8400-e29b-41d4-a716-446655440001'
                },
                isRecurring: {
                  type: 'boolean',
                  default: false,
                  description: 'Whether event repeats',
                  example: false
                },
                recurrencePattern: {
                  type: 'object',
                  description: 'Recurrence pattern (required if isRecurring is true)',
                  properties: {
                    frequency: {
                      type: 'string',
                      enum: ['daily', 'weekly', 'monthly'],
                      example: 'weekly'
                    },
                    interval: {
                      type: 'integer',
                      minimum: 1,
                      description: 'Interval between occurrences',
                      example: 1
                    },
                    endDate: {
                      type: 'string',
                      format: 'date-time',
                      description: 'When recurrence ends',
                      example: '2025-12-31T23:59:59Z'
                    }
                  }
                },
                imageUrl: {
                  type: 'string',
                  format: 'uri',
                  description: 'Event image URL',
                  example: 'https://example.com/yoga-event.jpg'
                },
                coordinates: {
                  type: 'object',
                  description: 'Event location coordinates',
                  properties: {
                    lat: {
                      type: 'number',
                      minimum: -90,
                      maximum: 90,
                      example: 52.3579946
                    },
                    lng: {
                      type: 'number',
                      minimum: -180,
                      maximum: 180,
                      example: 4.8686671
                    }
                  },
                  required: ['lat', 'lng']
                }
              }
            },
            example: {
              title: 'Community Yoga Session',
              description: 'Join us for a relaxing yoga session in the park. Suitable for all levels. Bring your own mat!',
              category: 'HEALTH',
              startDate: '2025-06-01T09:00:00Z',
              endDate: '2025-06-01T10:30:00Z',
              location: 'Vondelpark, Amsterdam',
              capacity: 20,
              neighborhoodId: '550e8400-e29b-41d4-a716-446655440001',
              coordinates: {
                lat: 52.3579946,
                lng: 4.8686671
              }
            }
          }
        }
      },
      responses: {
        '201': {
          description: 'Event created successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    type: 'object',
                    properties: {
                      data: { $ref: '#/components/schemas/Event' }
                    }
                  }
                ]
              }
            }
          }
        },
        '400': { $ref: '#/components/responses/BadRequest' },
        '401': { $ref: '#/components/responses/Unauthorized' },
        '403': {
          description: 'Admin access required',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                error: 'Admin access required'
              }
            }
          }
        },
        '404': {
          description: 'Neighborhood not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                error: 'Neighborhood not found'
              }
            }
          }
        },
        '500': { $ref: '#/components/responses/InternalServerError' }
      }
    }
  },

  '/api/events/{id}': {
    get: {
      tags: ['Events'],
      summary: 'Get event by ID',
      description: `
Retrieve detailed information about a specific event including registrations.

**Public Endpoint**: No authentication required.

**Includes**:
- Event creator information
- Neighborhood details
- All registrations with user details
- Registration count
      `,
      operationId: 'getEventById',
      parameters: [
        { $ref: '#/components/parameters/eventId' }
      ],
      responses: {
        '200': {
          description: 'Event details retrieved successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    type: 'object',
                    properties: {
                      data: { $ref: '#/components/schemas/Event' }
                    }
                  }
                ]
              }
            }
          }
        },
        '404': { $ref: '#/components/responses/NotFound' },
        '500': { $ref: '#/components/responses/InternalServerError' }
      }
    },

    put: {
      tags: ['Events'],
      summary: 'Update event',
      description: `
Update an existing event. Only admin users can update events.

**Admin Only**: Requires admin privileges.

**Partial Updates**: Only provided fields will be updated.

**Business Rules**:
- Cannot update past events
- End date must be after start date (if both provided)
- Capacity changes affect waitlist management
      `,
      operationId: 'updateEvent',
      security: [{ bearerAuth: [] }],
      parameters: [
        { $ref: '#/components/parameters/eventId' }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  minLength: 3,
                  maxLength: 100
                },
                description: {
                  type: 'string',
                  minLength: 10,
                  maxLength: 2000
                },
                category: {
                  type: 'string',
                  enum: ['SPORTS', 'CULTURAL', 'EDUCATIONAL', 'VOLUNTEER', 'SOCIAL', 'BUSINESS', 'HEALTH', 'ENVIRONMENT', 'TECHNOLOGY', 'OTHER']
                },
                startDate: {
                  type: 'string',
                  format: 'date-time'
                },
                endDate: {
                  type: 'string',
                  format: 'date-time'
                },
                location: {
                  type: 'string',
                  minLength: 3,
                  maxLength: 200
                },
                capacity: {
                  type: 'integer',
                  minimum: 1,
                  maximum: 10000
                }
              }
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Event updated successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    type: 'object',
                    properties: {
                      data: { $ref: '#/components/schemas/Event' }
                    }
                  }
                ]
              }
            }
          }
        },
        '400': { $ref: '#/components/responses/BadRequest' },
        '401': { $ref: '#/components/responses/Unauthorized' },
        '403': { $ref: '#/components/responses/Forbidden' },
        '404': { $ref: '#/components/responses/NotFound' },
        '500': { $ref: '#/components/responses/InternalServerError' }
      }
    },

    delete: {
      tags: ['Events'],
      summary: 'Delete event',
      description: `
Delete (cancel) an event. Only admin users can delete events.

**Admin Only**: Requires admin privileges.

**Soft Delete**: Events are marked as 'CANCELLED' rather than being permanently deleted.

**Side Effects**:
- All registrations remain but event becomes unavailable
- Registered users should be notified (future feature)
      `,
      operationId: 'deleteEvent',
      security: [{ bearerAuth: [] }],
      parameters: [
        { $ref: '#/components/parameters/eventId' }
      ],
      responses: {
        '200': {
          description: 'Event deleted successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiResponse' },
              example: {
                success: true,
                message: 'Event deleted successfully'
              }
            }
          }
        },
        '401': { $ref: '#/components/responses/Unauthorized' },
        '403': { $ref: '#/components/responses/Forbidden' },
        '404': { $ref: '#/components/responses/NotFound' },
        '500': { $ref: '#/components/responses/InternalServerError' }
      }
    }
  },

  '/api/events/{id}/register': {
    post: {
      tags: ['Events'],
      summary: 'Register for event',
      description: `
Register the authenticated user for an event.

**Authentication Required**: Must be logged in.

**Smart Registration**:
- Automatically adds to waitlist if event is at capacity
- Prevents duplicate registrations
- Cannot register for own events (if user is creator)

**Business Rules**:
- Event must be ACTIVE
- User cannot register twice
- Capacity management with waitlist
      `,
      operationId: 'registerForEvent',
      security: [{ bearerAuth: [] }],
      parameters: [
        { $ref: '#/components/parameters/eventId' }
      ],
      requestBody: {
        required: false,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                notes: {
                  type: 'string',
                  maxLength: 500,
                  description: 'Optional registration notes',
                  example: 'Looking forward to this event! First time doing yoga.'
                }
              }
            }
          }
        }
      },
      responses: {
        '201': {
          description: 'Successfully registered for event',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    type: 'object',
                    properties: {
                      data: { $ref: '#/components/schemas/EventRegistration' }
                    }
                  }
                ]
              },
              examples: {
                registered: {
                  summary: 'Registered successfully',
                  value: {
                    success: true,
                    message: 'Successfully registered for event',
                    data: {
                      id: 'reg-123',
                      status: 'REGISTERED',
                      registeredAt: '2025-01-15T10:00:00Z',
                      notes: 'Looking forward to this event!'
                    }
                  }
                },
                waitlist: {
                  summary: 'Added to waitlist',
                  value: {
                    success: true,
                    message: 'Added to waitlist successfully',
                    data: {
                      id: 'reg-124',
                      status: 'WAITLIST',
                      registeredAt: '2025-01-15T10:00:00Z'
                    }
                  }
                }
              }
            }
          }
        },
        '400': {
          description: 'Registration not allowed',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              examples: {
                duplicate: {
                  summary: 'Already registered',
                  value: {
                    success: false,
                    error: 'Already registered for this event'
                  }
                },
                inactive: {
                  summary: 'Event not active',
                  value: {
                    success: false,
                    error: 'Event is not available for registration'
                  }
                }
              }
            }
          }
        },
        '401': { $ref: '#/components/responses/Unauthorized' },
        '404': { $ref: '#/components/responses/NotFound' },
        '500': { $ref: '#/components/responses/InternalServerError' }
      }
    },

    delete: {
      tags: ['Events'],
      summary: 'Unregister from event',
      description: `
Remove the authenticated user's registration from an event.

**Authentication Required**: Must be logged in.

**Smart Waitlist Management**:
- Automatically promotes next person from waitlist
- Maintains registration order
- Updates event capacity availability

**Business Rules**:
- Can only unregister from own registrations
- Cannot unregister from completed events
      `,
      operationId: 'unregisterFromEvent',
      security: [{ bearerAuth: [] }],
      parameters: [
        { $ref: '#/components/parameters/eventId' }
      ],
      responses: {
        '200': {
          description: 'Successfully unregistered from event',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiResponse' },
              example: {
                success: true,
                message: 'Successfully unregistered from event'
              }
            }
          }
        },
        '401': { $ref: '#/components/responses/Unauthorized' },
        '404': {
          description: 'Registration not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                error: 'Registration not found'
              }
            }
          }
        },
        '500': { $ref: '#/components/responses/InternalServerError' }
      }
    }
  },

  '/api/categories': {
    get: {
      tags: ['Categories'],
      summary: 'Get event categories',
      description: `
Retrieve all available event categories with formatted labels.

**Public Endpoint**: No authentication required.

**Returns**: Array of category objects with value and label properties for easy use in forms.
      `,
      operationId: 'getEventCategories',
      responses: {
        '200': {
          description: 'Categories retrieved successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              enum: ['SPORTS', 'CULTURAL', 'EDUCATIONAL', 'VOLUNTEER', 'SOCIAL', 'BUSINESS', 'HEALTH', 'ENVIRONMENT', 'TECHNOLOGY', 'OTHER']
                            },
                            label: {
                              type: 'string',
                              description: 'Human-readable category name'
                            }
                          }
                        }
                      }
                    }
                  }
                ]
              },
              example: {
                success: true,
                data: [
                  { value: 'SPORTS', label: 'Sports' },
                  { value: 'CULTURAL', label: 'Cultural' },
                  { value: 'HEALTH', label: 'Health' },
                  { value: 'VOLUNTEER', label: 'Volunteer' }
                ]
              }
            }
          }
        },
        '500': { $ref: '#/components/responses/InternalServerError' }
      }
    }
  }
}