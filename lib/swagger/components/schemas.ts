/**
 * Reusable schema definitions
 */

export const schemas = {
  // Base response schemas
  ApiResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        description: 'Indicates if the request was successful'
      },
      data: {
        description: 'Response data (varies by endpoint)'
      },
      message: {
        type: 'string',
        description: 'Human-readable message'
      },
      error: {
        type: 'string',
        description: 'Error message (only present when success is false)'
      }
    },
    required: ['success']
  },

  PaginatedResponse: {
    allOf: [
      { $ref: '#/components/schemas/ApiResponse' },
      {
        type: 'object',
        properties: {
          pagination: {
            type: 'object',
            properties: {
              page: {
                type: 'integer',
                minimum: 1,
                description: 'Current page number'
              },
              limit: {
                type: 'integer',
                minimum: 1,
                maximum: 100,
                description: 'Items per page'
              },
              total: {
                type: 'integer',
                minimum: 0,
                description: 'Total number of items'
              },
              totalPages: {
                type: 'integer',
                minimum: 0,
                description: 'Total number of pages'
              }
            },
            required: ['page', 'limit', 'total', 'totalPages']
          }
        }
      }
    ]
  },

  Error: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false
      },
      error: {
        type: 'string',
        description: 'Error message describing what went wrong'
      }
    },
    required: ['success', 'error']
  },

  ValidationError: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false
      },
      error: {
        type: 'string',
        description: 'Validation error details',
        example: 'Validation error: title: Title must be at least 3 characters, email: Invalid email format'
      }
    },
    required: ['success', 'error']
  },

  // User schemas
  User: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Unique user identifier'
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'User email address'
      },
      username: {
        type: 'string',
        minLength: 3,
        maxLength: 20,
        pattern: '^[a-zA-Z0-9_]+$',
        description: 'Unique username'
      },
      fullName: {
        type: 'string',
        description: 'User full name'
      },
      avatarUrl: {
        type: 'string',
        format: 'uri',
        description: 'Profile picture URL'
      },
      phone: {
        type: 'string',
        description: 'Phone number'
      },
      isAdmin: {
        type: 'boolean',
        description: 'Whether user has admin privileges'
      },
      isVerified: {
        type: 'boolean',
        description: 'Whether user email is verified'
      },
      reputationScore: {
        type: 'integer',
        minimum: 0,
        description: 'User reputation score based on community activity'
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Account creation timestamp'
      },
      lastActive: {
        type: 'string',
        format: 'date-time',
        description: 'Last activity timestamp'
      },
      neighborhood: {
        $ref: '#/components/schemas/Neighborhood'
      }
    },
    required: ['id', 'email', 'username', 'isAdmin', 'isVerified', 'reputationScore']
  },

  UserProfile: {
    allOf: [
      { $ref: '#/components/schemas/User' },
      {
        type: 'object',
        properties: {
          eventRegistrations: {
            type: 'array',
            items: { $ref: '#/components/schemas/EventRegistration' },
            description: 'Recent event registrations'
          },
          events: {
            type: 'array',
            items: { $ref: '#/components/schemas/Event' },
            description: 'Events created by user'
          }
        }
      }
    ]
  },

  // Neighborhood schemas
  Neighborhood: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Unique neighborhood identifier'
      },
      name: {
        type: 'string',
        description: 'Neighborhood name'
      },
      city: {
        type: 'string',
        description: 'City name'
      },
      postalCode: {
        type: 'string',
        description: 'Postal code'
      },
      description: {
        type: 'string',
        description: 'Neighborhood description'
      },
      boundaryCoordinates: {
        type: 'object',
        description: 'GeoJSON boundary coordinates'
      },
      createdAt: {
        type: 'string',
        format: 'date-time'
      }
    },
    required: ['id', 'name', 'city', 'postalCode']
  },

  // Event schemas
  Event: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Unique event identifier'
      },
      title: {
        type: 'string',
        minLength: 3,
        maxLength: 100,
        description: 'Event title'
      },
      description: {
        type: 'string',
        minLength: 10,
        maxLength: 2000,
        description: 'Event description'
      },
      category: {
        type: 'string',
        enum: ['SPORTS', 'CULTURAL', 'EDUCATIONAL', 'VOLUNTEER', 'SOCIAL', 'BUSINESS', 'HEALTH', 'ENVIRONMENT', 'TECHNOLOGY', 'OTHER'],
        description: 'Event category'
      },
      startDate: {
        type: 'string',
        format: 'date-time',
        description: 'Event start date and time'
      },
      endDate: {
        type: 'string',
        format: 'date-time',
        description: 'Event end date and time'
      },
      location: {
        type: 'string',
        minLength: 3,
        maxLength: 200,
        description: 'Event location'
      },
      coordinates: {
        type: 'object',
        properties: {
          lat: { type: 'number', minimum: -90, maximum: 90 },
          lng: { type: 'number', minimum: -180, maximum: 180 }
        },
        description: 'Event coordinates'
      },
      capacity: {
        type: 'integer',
        minimum: 1,
        maximum: 10000,
        description: 'Maximum number of participants'
      },
      status: {
        type: 'string',
        enum: ['ACTIVE', 'CANCELLED', 'COMPLETED', 'DRAFT'],
        description: 'Event status'
      },
      isRecurring: {
        type: 'boolean',
        description: 'Whether event repeats'
      },
      recurrencePattern: {
        type: 'object',
        properties: {
          frequency: {
            type: 'string',
            enum: ['daily', 'weekly', 'monthly']
          },
          interval: {
            type: 'integer',
            minimum: 1
          },
          endDate: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      imageUrl: {
        type: 'string',
        format: 'uri',
        description: 'Event image URL'
      },
      createdAt: {
        type: 'string',
        format: 'date-time'
      },
      updatedAt: {
        type: 'string',
        format: 'date-time'
      },
      creator: {
        $ref: '#/components/schemas/User'
      },
      neighborhood: {
        $ref: '#/components/schemas/Neighborhood'
      },
      registrations: {
        type: 'array',
        items: { $ref: '#/components/schemas/EventRegistration' }
      },
      _count: {
        type: 'object',
        properties: {
          registrations: {
            type: 'integer',
            description: 'Number of registrations'
          }
        }
      }
    },
    required: ['id', 'title', 'description', 'category', 'startDate', 'location', 'status']
  },

  EventRegistration: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid'
      },
      eventId: {
        type: 'string',
        format: 'uuid'
      },
      userId: {
        type: 'string',
        format: 'uuid'
      },
      status: {
        type: 'string',
        enum: ['REGISTERED', 'WAITLIST', 'CANCELLED', 'ATTENDED'],
        description: 'Registration status'
      },
      registeredAt: {
        type: 'string',
        format: 'date-time'
      },
      notes: {
        type: 'string',
        maxLength: 500,
        description: 'Optional registration notes'
      },
      user: {
        $ref: '#/components/schemas/User'
      },
      event: {
        $ref: '#/components/schemas/Event'
      }
    },
    required: ['id', 'eventId', 'userId', 'status', 'registeredAt']
  },

  // Marketplace schemas
  MarketListing: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid'
      },
      title: {
        type: 'string',
        minLength: 3,
        maxLength: 100,
        description: 'Listing title'
      },
      description: {
        type: 'string',
        minLength: 10,
        maxLength: 2000,
        description: 'Item description'
      },
      price: {
        type: 'number',
        minimum: 0,
        multipleOf: 0.01,
        description: 'Item price (null if free)'
      },
      isFree: {
        type: 'boolean',
        description: 'Whether item is free'
      },
      condition: {
        type: 'string',
        enum: ['NEW', 'LIKE_NEW', 'GOOD', 'USED', 'WORN'],
        description: 'Item condition'
      },
      status: {
        type: 'string',
        enum: ['ACTIVE', 'RESERVED', 'SOLD', 'CLOSED'],
        description: 'Listing status'
      },
      images: {
        type: 'array',
        items: {
          type: 'string',
          format: 'uri'
        },
        minItems: 1,
        maxItems: 10,
        description: 'Item images'
      },
      views: {
        type: 'integer',
        minimum: 0,
        description: 'Number of views'
      },
      isPromoted: {
        type: 'boolean',
        description: 'Whether listing is promoted'
      },
      promotedUntil: {
        type: 'string',
        format: 'date-time',
        description: 'Promotion end date'
      },
      createdAt: {
        type: 'string',
        format: 'date-time'
      },
      updatedAt: {
        type: 'string',
        format: 'date-time'
      },
      seller: {
        $ref: '#/components/schemas/User'
      },
      category: {
        $ref: '#/components/schemas/Category'
      },
      neighborhood: {
        $ref: '#/components/schemas/Neighborhood'
      },
      tags: {
        type: 'array',
        items: { $ref: '#/components/schemas/Tag' }
      },
      requests: {
        type: 'array',
        items: { $ref: '#/components/schemas/MarketRequest' }
      },
      reviews: {
        type: 'array',
        items: { $ref: '#/components/schemas/MarketReview' }
      },
      _count: {
        type: 'object',
        properties: {
          requests: { type: 'integer' },
          reviews: { type: 'integer' }
        }
      }
    },
    required: ['id', 'title', 'description', 'isFree', 'condition', 'status', 'images']
  },

  MarketRequest: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid'
      },
      listingId: {
        type: 'string',
        format: 'uuid'
      },
      buyerId: {
        type: 'string',
        format: 'uuid'
      },
      message: {
        type: 'string',
        maxLength: 500,
        description: 'Optional message to seller'
      },
      status: {
        type: 'string',
        enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED'],
        description: 'Request status'
      },
      createdAt: {
        type: 'string',
        format: 'date-time'
      },
      updatedAt: {
        type: 'string',
        format: 'date-time'
      },
      listing: {
        $ref: '#/components/schemas/MarketListing'
      },
      buyer: {
        $ref: '#/components/schemas/User'
      }
    },
    required: ['id', 'listingId', 'buyerId', 'status']
  },

  MarketReview: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid'
      },
      listingId: {
        type: 'string',
        format: 'uuid'
      },
      sellerId: {
        type: 'string',
        format: 'uuid'
      },
      buyerId: {
        type: 'string',
        format: 'uuid'
      },
      rating: {
        type: 'integer',
        minimum: 1,
        maximum: 5,
        description: 'Rating from 1 to 5 stars'
      },
      comment: {
        type: 'string',
        maxLength: 1000,
        description: 'Review comment'
      },
      type: {
        type: 'string',
        enum: ['SELLER', 'BUYER'],
        description: 'Review type'
      },
      createdAt: {
        type: 'string',
        format: 'date-time'
      },
      listing: {
        $ref: '#/components/schemas/MarketListing'
      },
      seller: {
        $ref: '#/components/schemas/User'
      },
      buyer: {
        $ref: '#/components/schemas/User'
      }
    },
    required: ['id', 'listingId', 'sellerId', 'buyerId', 'rating', 'type']
  },

  // Category schemas
  Category: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid'
      },
      name: {
        type: 'string',
        description: 'Category name'
      },
      description: {
        type: 'string',
        description: 'Category description'
      },
      parentId: {
        type: 'string',
        format: 'uuid',
        description: 'Parent category ID (for subcategories)'
      },
      isActive: {
        type: 'boolean',
        description: 'Whether category is active'
      },
      sortOrder: {
        type: 'integer',
        description: 'Display order'
      },
      createdAt: {
        type: 'string',
        format: 'date-time'
      },
      subcategories: {
        type: 'array',
        items: { $ref: '#/components/schemas/Category' }
      },
      _count: {
        type: 'object',
        properties: {
          marketListings: {
            type: 'integer',
            description: 'Number of active listings in category'
          }
        }
      }
    },
    required: ['id', 'name', 'isActive', 'sortOrder']
  },

  Tag: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid'
      },
      name: {
        type: 'string',
        description: 'Tag name'
      },
      description: {
        type: 'string',
        description: 'Tag description'
      },
      createdAt: {
        type: 'string',
        format: 'date-time'
      }
    },
    required: ['id', 'name']
  }
}