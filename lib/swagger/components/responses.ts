/**
 * Reusable response definitions
 */

export const responses = {
  // Success responses
  Success: {
    description: 'Operation successful',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ApiResponse'
        },
        example: {
          success: true,
          message: 'Operation completed successfully',
          data: {}
        }
      }
    }
  },

  Created: {
    description: 'Resource created successfully',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ApiResponse'
        },
        example: {
          success: true,
          message: 'Resource created successfully',
          data: {}
        }
      }
    }
  },

  PaginatedSuccess: {
    description: 'Paginated results retrieved successfully',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/PaginatedResponse'
        },
        example: {
          success: true,
          message: 'Results retrieved successfully',
          data: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 100,
            totalPages: 10
          }
        }
      }
    }
  },

  // Error responses
  BadRequest: {
    description: 'Bad request - Invalid input data',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ValidationError'
        },
        examples: {
          validation: {
            summary: 'Validation error',
            value: {
              success: false,
              error: 'Validation error: title: Title must be at least 3 characters'
            }
          },
          business: {
            summary: 'Business logic error',
            value: {
              success: false,
              error: 'Cannot register for your own event'
            }
          }
        }
      }
    }
  },

  Unauthorized: {
    description: 'Authentication required',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error'
        },
        examples: {
          missing: {
            summary: 'Missing token',
            value: {
              success: false,
              error: 'Authentication required'
            }
          },
          invalid: {
            summary: 'Invalid token',
            value: {
              success: false,
              error: 'Invalid or expired token'
            }
          }
        }
      }
    }
  },

  Forbidden: {
    description: 'Insufficient permissions',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error'
        },
        examples: {
          admin: {
            summary: 'Admin required',
            value: {
              success: false,
              error: 'Admin access required'
            }
          },
          owner: {
            summary: 'Owner required',
            value: {
              success: false,
              error: 'Not the owner of this resource'
            }
          }
        }
      }
    }
  },

  NotFound: {
    description: 'Resource not found',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error'
        },
        examples: {
          event: {
            summary: 'Event not found',
            value: {
              success: false,
              error: 'Event not found'
            }
          },
          listing: {
            summary: 'Listing not found',
            value: {
              success: false,
              error: 'Listing not found'
            }
          },
          user: {
            summary: 'User not found',
            value: {
              success: false,
              error: 'User not found'
            }
          }
        }
      }
    }
  },

  Conflict: {
    description: 'Resource conflict',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error'
        },
        examples: {
          duplicate: {
            summary: 'Duplicate resource',
            value: {
              success: false,
              error: 'User with this email already exists'
            }
          },
          registered: {
            summary: 'Already registered',
            value: {
              success: false,
              error: 'Already registered for this event'
            }
          }
        }
      }
    }
  },

  TooManyRequests: {
    description: 'Rate limit exceeded',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error'
        },
        example: {
          success: false,
          error: 'Rate limit exceeded. Please try again later.'
        }
      }
    }
  },

  InternalServerError: {
    description: 'Internal server error',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error'
        },
        example: {
          success: false,
          error: 'Internal server error'
        }
      }
    }
  }
}