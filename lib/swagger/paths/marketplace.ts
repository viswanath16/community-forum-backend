/**
 * Marketplace endpoint documentation
 */

export const marketplacePaths = {
  '/api/marketplace': {
    get: {
      tags: ['Marketplace'],
      summary: 'Get marketplace listings',
      description: `
Retrieve marketplace listings with advanced filtering and sorting options.

**Public Endpoint**: No authentication required.

**Filtering Options**:
- Category, condition, price range
- Free items only
- Neighborhood-based filtering
- Seller-specific listings
- Text search in title and description

**Sorting Options**:
- Creation date, price, title, view count
- Ascending or descending order

**Default Behavior**:
- Shows only ACTIVE listings
- Sorted by creation date (newest first)
- 10 items per page
      `,
      operationId: 'getMarketplaceListings',
      parameters: [
        { $ref: '#/components/parameters/page' },
        { $ref: '#/components/parameters/limit' },
        { $ref: '#/components/parameters/categoryId' },
        { $ref: '#/components/parameters/isFree' },
        { $ref: '#/components/parameters/condition' },
        { $ref: '#/components/parameters/status' },
        { $ref: '#/components/parameters/sellerId' },
        { $ref: '#/components/parameters/neighborhoodId' },
        { $ref: '#/components/parameters/q' },
        { $ref: '#/components/parameters/minPrice' },
        { $ref: '#/components/parameters/maxPrice' },
        { $ref: '#/components/parameters/sortBy' },
        { $ref: '#/components/parameters/sortOrder' }
      ],
      responses: {
        '200': {
          description: 'Listings retrieved successfully',
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
                        items: { $ref: '#/components/schemas/MarketListing' }
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        '400': { $ref: '#/components/responses/BadRequest' },
        '500': { $ref: '#/components/responses/InternalServerError' }
      }
    },

    post: {
      tags: ['Marketplace'],
      summary: 'Create marketplace listing',
      description: `
Create a new marketplace listing for selling or giving away items.

**Authentication Required**: Must be logged in.

**Image Requirements**:
- 1-10 images required
- Must be valid URLs
- Recommended: Use image hosting service

**Price Rules**:
- Required if \`isFree\` is false
- Must be positive number
- Supports up to 2 decimal places

**Business Rules**:
- Category must exist and be active
- Neighborhood is optional but recommended
- Tags are optional for better discoverability
      `,
      operationId: 'createMarketplaceListing',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['title', 'description', 'isFree', 'condition', 'images', 'categoryId'],
              properties: {
                title: {
                  type: 'string',
                  minLength: 3,
                  maxLength: 100,
                  description: 'Listing title',
                  example: 'Vintage Racing Bicycle'
                },
                description: {
                  type: 'string',
                  minLength: 10,
                  maxLength: 2000,
                  description: 'Item description',
                  example: 'Beautiful vintage racing bicycle from the 1980s. Recently serviced with new tires and brakes.'
                },
                price: {
                  type: 'number',
                  minimum: 0,
                  multipleOf: 0.01,
                  description: 'Item price (required if not free)',
                  example: 250.00
                },
                isFree: {
                  type: 'boolean',
                  description: 'Whether item is free',
                  example: false
                },
                condition: {
                  type: 'string',
                  enum: ['NEW', 'LIKE_NEW', 'GOOD', 'USED', 'WORN'],
                  description: 'Item condition',
                  example: 'GOOD'
                },
                images: {
                  type: 'array',
                  items: {
                    type: 'string',
                    format: 'uri'
                  },
                  minItems: 1,
                  maxItems: 10,
                  description: 'Array of image URLs',
                  example: [
                    'https://images.unsplash.com/photo-1544191696-15693be7e85b?w=500',
                    'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=500'
                  ]
                },
                categoryId: {
                  type: 'string',
                  format: 'uuid',
                  description: 'Category ID',
                  example: '770e8400-e29b-41d4-a716-446655440005'
                },
                neighborhoodId: {
                  type: 'string',
                  format: 'uuid',
                  description: 'Neighborhood ID (optional)',
                  example: '550e8400-e29b-41d4-a716-446655440001'
                },
                tagIds: {
                  type: 'array',
                  items: {
                    type: 'string',
                    format: 'uuid'
                  },
                  description: 'Array of tag IDs (optional)',
                  example: ['880e8400-e29b-41d4-a716-446655440001']
                }
              }
            }
          }
        }
      },
      responses: {
        '201': {
          description: 'Listing created successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    type: 'object',
                    properties: {
                      data: { $ref: '#/components/schemas/MarketListing' }
                    }
                  }
                ]
              }
            }
          }
        },
        '400': { $ref: '#/components/responses/BadRequest' },
        '401': { $ref: '#/components/responses/Unauthorized' },
        '404': {
          description: 'Category or neighborhood not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        '500': { $ref: '#/components/responses/InternalServerError' }
      }
    }
  },

  '/api/marketplace/{id}': {
    get: {
      tags: ['Marketplace'],
      summary: 'Get listing by ID',
      description: `
Retrieve detailed information about a specific marketplace listing.

**Public Endpoint**: No authentication required.

**Side Effects**:
- Increments view count by 1
- View count is used for popularity sorting

**Includes**:
- Seller information and reputation
- Category and neighborhood details
- All tags associated with the listing
- Purchase requests (if user is seller)
- Reviews and ratings
      `,
      operationId: 'getMarketplaceListingById',
      parameters: [
        { $ref: '#/components/parameters/listingId' }
      ],
      responses: {
        '200': {
          description: 'Listing retrieved successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    type: 'object',
                    properties: {
                      data: { $ref: '#/components/schemas/MarketListing' }
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
      tags: ['Marketplace'],
      summary: 'Update listing',
      description: `
Update an existing marketplace listing. Only the seller or admin can update.

**Authorization**: Seller or admin only.

**Partial Updates**: Only provided fields will be updated.

**Business Rules**:
- Cannot update SOLD or CLOSED listings
- Price changes don't affect existing requests
- Category changes must reference valid categories
      `,
      operationId: 'updateMarketplaceListing',
      security: [{ bearerAuth: [] }],
      parameters: [
        { $ref: '#/components/parameters/listingId' }
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
                price: {
                  type: 'number',
                  minimum: 0,
                  multipleOf: 0.01
                },
                isFree: {
                  type: 'boolean'
                },
                condition: {
                  type: 'string',
                  enum: ['NEW', 'LIKE_NEW', 'GOOD', 'USED', 'WORN']
                },
                images: {
                  type: 'array',
                  items: {
                    type: 'string',
                    format: 'uri'
                  },
                  minItems: 1,
                  maxItems: 10
                },
                categoryId: {
                  type: 'string',
                  format: 'uuid'
                },
                neighborhoodId: {
                  type: 'string',
                  format: 'uuid'
                },
                tagIds: {
                  type: 'array',
                  items: {
                    type: 'string',
                    format: 'uuid'
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Listing updated successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    type: 'object',
                    properties: {
                      data: { $ref: '#/components/schemas/MarketListing' }
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
      tags: ['Marketplace'],
      summary: 'Delete listing',
      description: `
Delete a marketplace listing. Only the seller or admin can delete.

**Authorization**: Seller or admin only.

**Soft Delete**: Listing status is set to 'CLOSED' rather than permanent deletion.

**Side Effects**:
- All pending requests are effectively cancelled
- Listing becomes unavailable for new requests
- Historical data is preserved for analytics
      `,
      operationId: 'deleteMarketplaceListing',
      security: [{ bearerAuth: [] }],
      parameters: [
        { $ref: '#/components/parameters/listingId' }
      ],
      responses: {
        '200': {
          description: 'Listing deleted successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiResponse' }
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

  '/api/marketplace/{id}/request': {
    post: {
      tags: ['Marketplace'],
      summary: 'Create purchase request',
      description: `
Create a purchase request for a marketplace listing.

**Authentication Required**: Must be logged in.

**Business Rules**:
- Cannot request your own listing
- One request per user per listing
- Listing must be ACTIVE
- Optional message to seller

**Request Flow**:
1. Buyer creates request
2. Seller receives notification (future feature)
3. Seller can accept/reject via API
4. Transaction completion handled externally
      `,
      operationId: 'createPurchaseRequest',
      security: [{ bearerAuth: [] }],
      parameters: [
        { $ref: '#/components/parameters/listingId' }
      ],
      requestBody: {
        required: false,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  maxLength: 500,
                  description: 'Optional message to seller',
                  example: 'Hi! Is this bicycle still available? I can pick it up this weekend.'
                }
              }
            }
          }
        }
      },
      responses: {
        '201': {
          description: 'Request created successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    type: 'object',
                    properties: {
                      data: { $ref: '#/components/schemas/MarketRequest' }
                    }
                  }
                ]
              }
            }
          }
        },
        '400': {
          description: 'Request not allowed',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              examples: {
                ownListing: {
                  summary: 'Own listing',
                  value: {
                    success: false,
                    error: 'Cannot request your own listing'
                  }
                },
                duplicate: {
                  summary: 'Already requested',
                  value: {
                    success: false,
                    error: 'You already have a request for this listing'
                  }
                },
                inactive: {
                  summary: 'Listing not active',
                  value: {
                    success: false,
                    error: 'Listing is not available for requests'
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
    }
  },

  '/api/marketplace/{id}/requests': {
    get: {
      tags: ['Marketplace'],
      summary: 'Get listing requests',
      description: `
Get all purchase requests for a specific listing.

**Authorization**: Seller or admin only.

**Includes**:
- Buyer information and reputation
- Request message and timestamp
- Request status and history

**Sorting**: Requests are sorted by creation date (newest first).
      `,
      operationId: 'getListingRequests',
      security: [{ bearerAuth: [] }],
      parameters: [
        { $ref: '#/components/parameters/listingId' }
      ],
      responses: {
        '200': {
          description: 'Requests retrieved successfully',
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
                        items: { $ref: '#/components/schemas/MarketRequest' }
                      }
                    }
                  }
                ]
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

  '/api/marketplace/request/{requestId}/route': {
    put: {
      tags: ['Marketplace'],
      summary: 'Update request status',
      description: `
Update the status of a purchase request. Only the seller can update request status.

**Authorization**: Seller only.

**Status Flow**:
- PENDING → ACCEPTED (reserves listing)
- PENDING → REJECTED (no effect on listing)
- ACCEPTED → COMPLETED (marks listing as SOLD)

**Automated Actions**:
- ACCEPTED: Sets listing status to RESERVED
- COMPLETED: Sets listing status to SOLD
- REJECTED: No listing status change
      `,
      operationId: 'updateRequestStatus',
      security: [{ bearerAuth: [] }],
      parameters: [
        { $ref: '#/components/parameters/requestId' }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['status'],
              properties: {
                status: {
                  type: 'string',
                  enum: ['ACCEPTED', 'REJECTED', 'COMPLETED'],
                  description: 'New request status',
                  example: 'ACCEPTED'
                }
              }
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Request status updated successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    type: 'object',
                    properties: {
                      data: { $ref: '#/components/schemas/MarketRequest' }
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
    }
  },

  '/api/marketplace/request/{requestId}/cancel': {
    delete: {
      tags: ['Marketplace'],
      summary: 'Cancel purchase request',
      description: `
Cancel a purchase request. Only the buyer can cancel their own requests.

**Authorization**: Buyer only.

**Business Rules**:
- Can only cancel PENDING requests
- Cannot cancel ACCEPTED or COMPLETED requests
- Permanent deletion (not soft delete)

**Use Cases**:
- Buyer no longer interested
- Found alternative item
- Changed mind about purchase
      `,
      operationId: 'cancelPurchaseRequest',
      security: [{ bearerAuth: [] }],
      parameters: [
        { $ref: '#/components/parameters/requestId' }
      ],
      responses: {
        '200': {
          description: 'Request cancelled successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiResponse' }
            }
          }
        },
        '400': {
          description: 'Cannot cancel processed request',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                error: 'Cannot cancel a request that has already been processed'
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

  '/api/marketplace/categories': {
    get: {
      tags: ['Marketplace'],
      summary: 'Get marketplace categories',
      description: `
Retrieve all marketplace categories with hierarchical structure and listing counts.

**Public Endpoint**: No authentication required.

**Features**:
- Hierarchical category structure (parent/child)
- Active listing counts per category
- Sorted by display order
- Includes subcategories

**Use Cases**:
- Category selection in forms
- Navigation menus
- Filtering options
      `,
      operationId: 'getMarketplaceCategories',
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
                        items: { $ref: '#/components/schemas/Category' }
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        '500': { $ref: '#/components/responses/InternalServerError' }
      }
    }
  },

  '/api/marketplace/search': {
    get: {
      tags: ['Marketplace'],
      summary: 'Search marketplace listings',
      description: `
Advanced search functionality for marketplace listings with full-text search.

**Public Endpoint**: No authentication required.

**Search Features**:
- Full-text search in title and description
- Case-insensitive matching
- Combined with all standard filters
- Relevance-based results

**Performance**:
- Optimized database queries
- Indexed search fields
- Pagination for large result sets
      `,
      operationId: 'searchMarketplaceListings',
      parameters: [
        { $ref: '#/components/parameters/page' },
        { $ref: '#/components/parameters/limit' },
        { $ref: '#/components/parameters/q' },
        { $ref: '#/components/parameters/categoryId' },
        { $ref: '#/components/parameters/minPrice' },
        { $ref: '#/components/parameters/maxPrice' },
        { $ref: '#/components/parameters/condition' },
        { $ref: '#/components/parameters/neighborhoodId' },
        { $ref: '#/components/parameters/sortBy' },
        { $ref: '#/components/parameters/sortOrder' }
      ],
      responses: {
        '200': {
          description: 'Search results retrieved successfully',
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
                        items: { $ref: '#/components/schemas/MarketListing' }
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        '400': { $ref: '#/components/responses/BadRequest' },
        '500': { $ref: '#/components/responses/InternalServerError' }
      }
    }
  },

  '/api/marketplace/activity': {
    get: {
      tags: ['Marketplace'],
      summary: 'Get user marketplace activity',
      description: `
Get current user's marketplace activity including their listings and purchase requests.

**Authentication Required**: Must be logged in.

**Includes**:
- User's active listings with request counts
- Purchase requests made by user
- Recent activity (last 20 items each)
- Status information for all items

**Use Cases**:
- User dashboard
- Activity overview
- Quick access to user's marketplace items
      `,
      operationId: 'getUserMarketplaceActivity',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Activity retrieved successfully',
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
                          listings: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/MarketListing' },
                            description: 'User\'s marketplace listings'
                          },
                          buyRequests: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/MarketRequest' },
                            description: 'Purchase requests made by user'
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
        '401': { $ref: '#/components/responses/Unauthorized' },
        '500': { $ref: '#/components/responses/InternalServerError' }
      }
    }
  },

  '/api/marketplace/requests': {
    get: {
      tags: ['Marketplace'],
      summary: 'Get user purchase requests',
      description: `
Get all purchase requests made by the current user.

**Authentication Required**: Must be logged in.

**Includes**:
- All requests made by user
- Listing details for each request
- Seller information
- Request status and timestamps

**Sorting**: Requests are sorted by creation date (newest first).
      `,
      operationId: 'getUserPurchaseRequests',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Requests retrieved successfully',
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
                        items: { $ref: '#/components/schemas/MarketRequest' }
                      }
                    }
                  }
                ]
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