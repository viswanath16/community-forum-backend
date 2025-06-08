/**
 * Reusable example data for documentation
 */

export const examples = {
  // Authentication examples
  loginRequest: {
    summary: 'Admin login',
    value: {
      email: 'admin@communityforum.com',
      password: 'admin123'
    }
  },

  loginResponse: {
    summary: 'Successful login',
    value: {
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
  },

  registerRequest: {
    summary: 'User registration',
    value: {
      email: 'newuser@example.com',
      password: 'securepassword123',
      username: 'newuser',
      fullName: 'New User',
      neighborhoodId: '550e8400-e29b-41d4-a716-446655440001'
    }
  },

  // Event examples
  createEventRequest: {
    summary: 'Create yoga event',
    value: {
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
  },

  eventResponse: {
    summary: 'Event details',
    value: {
      success: true,
      data: {
        id: '660e8400-e29b-41d4-a716-446655440001',
        title: 'Community Yoga Session',
        description: 'Join us for a relaxing yoga session in the park.',
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
        _count: {
          registrations: 5
        }
      }
    }
  },

  eventRegistrationRequest: {
    summary: 'Event registration with notes',
    value: {
      notes: 'Looking forward to this event! First time doing yoga.'
    }
  },

  // Marketplace examples
  createListingRequest: {
    summary: 'Create bicycle listing',
    value: {
      title: 'Vintage Racing Bicycle',
      description: 'Beautiful vintage racing bicycle from the 1980s. Recently serviced with new tires and brakes. Perfect for city commuting.',
      price: 250.00,
      isFree: false,
      condition: 'GOOD',
      images: [
        'https://images.unsplash.com/photo-1544191696-15693be7e85b?w=500',
        'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=500'
      ],
      categoryId: '770e8400-e29b-41d4-a716-446655440005',
      neighborhoodId: '550e8400-e29b-41d4-a716-446655440001',
      tagIds: ['880e8400-e29b-41d4-a716-446655440001']
    }
  },

  listingResponse: {
    summary: 'Marketplace listing',
    value: {
      success: true,
      data: {
        id: '990e8400-e29b-41d4-a716-446655440001',
        title: 'Vintage Racing Bicycle',
        description: 'Beautiful vintage racing bicycle from the 1980s.',
        price: 250.00,
        isFree: false,
        condition: 'GOOD',
        status: 'ACTIVE',
        images: [
          'https://images.unsplash.com/photo-1544191696-15693be7e85b?w=500'
        ],
        views: 15,
        seller: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          username: 'admin',
          fullName: 'Admin User',
          reputationScore: 100
        },
        category: {
          id: '770e8400-e29b-41d4-a716-446655440005',
          name: 'Sports & Recreation'
        },
        neighborhood: {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'Centrum',
          city: 'Amsterdam'
        },
        _count: {
          requests: 2,
          reviews: 0
        }
      }
    }
  },

  createRequestRequest: {
    summary: 'Request item with message',
    value: {
      message: 'Hi! Is this bicycle still available? I can pick it up this weekend.'
    }
  },

  requestResponse: {
    summary: 'Purchase request',
    value: {
      success: true,
      data: {
        id: 'aa0e8400-e29b-41d4-a716-446655440001',
        listingId: '990e8400-e29b-41d4-a716-446655440001',
        buyerId: '550e8400-e29b-41d4-a716-446655440001',
        message: 'Hi! Is this bicycle still available?',
        status: 'PENDING',
        createdAt: '2025-01-15T10:00:00Z',
        buyer: {
          id: '550e8400-e29b-41d4-a716-446655440001',
          username: 'johndoe',
          fullName: 'John Doe'
        }
      }
    }
  },

  // Pagination example
  paginatedResponse: {
    summary: 'Paginated events',
    value: {
      success: true,
      data: [
        {
          id: '660e8400-e29b-41d4-a716-446655440001',
          title: 'Community Yoga Session',
          category: 'HEALTH',
          startDate: '2025-06-01T09:00:00Z'
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