/**
 * Reusable parameter definitions
 */

export const parameters = {
  // Path parameters
  id: {
    name: 'id',
    in: 'path',
    required: true,
    schema: {
      type: 'string',
      format: 'uuid'
    },
    description: 'Resource unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000'
  },

  eventId: {
    name: 'id',
    in: 'path',
    required: true,
    schema: {
      type: 'string',
      format: 'uuid'
    },
    description: 'Event unique identifier',
    example: '660e8400-e29b-41d4-a716-446655440001'
  },

  listingId: {
    name: 'id',
    in: 'path',
    required: true,
    schema: {
      type: 'string',
      format: 'uuid'
    },
    description: 'Marketplace listing unique identifier',
    example: '990e8400-e29b-41d4-a716-446655440001'
  },

  requestId: {
    name: 'requestId',
    in: 'path',
    required: true,
    schema: {
      type: 'string',
      format: 'uuid'
    },
    description: 'Request unique identifier',
    example: 'aa0e8400-e29b-41d4-a716-446655440001'
  },

  // Query parameters - Pagination
  page: {
    name: 'page',
    in: 'query',
    required: false,
    schema: {
      type: 'integer',
      minimum: 1,
      default: 1
    },
    description: 'Page number for pagination',
    example: 1
  },

  limit: {
    name: 'limit',
    in: 'query',
    required: false,
    schema: {
      type: 'integer',
      minimum: 1,
      maximum: 100,
      default: 10
    },
    description: 'Number of items per page (max 100)',
    example: 10
  },

  // Query parameters - Filtering
  search: {
    name: 'search',
    in: 'query',
    required: false,
    schema: {
      type: 'string',
      minLength: 2
    },
    description: 'Search query for title and description',
    example: 'yoga'
  },

  category: {
    name: 'category',
    in: 'query',
    required: false,
    schema: {
      type: 'string',
      enum: ['SPORTS', 'CULTURAL', 'EDUCATIONAL', 'VOLUNTEER', 'SOCIAL', 'BUSINESS', 'HEALTH', 'ENVIRONMENT', 'TECHNOLOGY', 'OTHER']
    },
    description: 'Filter by event category',
    example: 'HEALTH'
  },

  categoryId: {
    name: 'categoryId',
    in: 'query',
    required: false,
    schema: {
      type: 'string',
      format: 'uuid'
    },
    description: 'Filter by category ID',
    example: '770e8400-e29b-41d4-a716-446655440001'
  },

  neighborhoodId: {
    name: 'neighborhoodId',
    in: 'query',
    required: false,
    schema: {
      type: 'string',
      format: 'uuid'
    },
    description: 'Filter by neighborhood ID',
    example: '550e8400-e29b-41d4-a716-446655440001'
  },

  // Date parameters
  startDate: {
    name: 'startDate',
    in: 'query',
    required: false,
    schema: {
      type: 'string',
      format: 'date-time'
    },
    description: 'Filter events starting from this date',
    example: '2025-06-01T00:00:00Z'
  },

  endDate: {
    name: 'endDate',
    in: 'query',
    required: false,
    schema: {
      type: 'string',
      format: 'date-time'
    },
    description: 'Filter events ending before this date',
    example: '2025-06-30T23:59:59Z'
  },

  // Marketplace specific parameters
  isFree: {
    name: 'isFree',
    in: 'query',
    required: false,
    schema: {
      type: 'boolean'
    },
    description: 'Filter by free items only',
    example: true
  },

  condition: {
    name: 'condition',
    in: 'query',
    required: false,
    schema: {
      type: 'string',
      enum: ['NEW', 'LIKE_NEW', 'GOOD', 'USED', 'WORN']
    },
    description: 'Filter by item condition',
    example: 'GOOD'
  },

  status: {
    name: 'status',
    in: 'query',
    required: false,
    schema: {
      type: 'string',
      enum: ['ACTIVE', 'RESERVED', 'SOLD', 'CLOSED'],
      default: 'ACTIVE'
    },
    description: 'Filter by listing status',
    example: 'ACTIVE'
  },

  sellerId: {
    name: 'sellerId',
    in: 'query',
    required: false,
    schema: {
      type: 'string',
      format: 'uuid'
    },
    description: 'Filter by seller ID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  },

  minPrice: {
    name: 'minPrice',
    in: 'query',
    required: false,
    schema: {
      type: 'number',
      minimum: 0
    },
    description: 'Minimum price filter',
    example: 50
  },

  maxPrice: {
    name: 'maxPrice',
    in: 'query',
    required: false,
    schema: {
      type: 'number',
      minimum: 0
    },
    description: 'Maximum price filter',
    example: 500
  },

  // Sorting parameters
  sortBy: {
    name: 'sortBy',
    in: 'query',
    required: false,
    schema: {
      type: 'string',
      enum: ['createdAt', 'price', 'title', 'views'],
      default: 'createdAt'
    },
    description: 'Sort field',
    example: 'price'
  },

  sortOrder: {
    name: 'sortOrder',
    in: 'query',
    required: false,
    schema: {
      type: 'string',
      enum: ['asc', 'desc'],
      default: 'desc'
    },
    description: 'Sort order',
    example: 'asc'
  },

  // Search query parameter
  q: {
    name: 'q',
    in: 'query',
    required: false,
    schema: {
      type: 'string',
      minLength: 2
    },
    description: 'Search query for title and description',
    example: 'bicycle'
  }
}