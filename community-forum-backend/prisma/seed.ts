import { PrismaClient, EventCategory } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seeding...')

    // Create neighborhoods
    const neighborhoods = await Promise.all([
        prisma.neighborhood.upsert({
            where: { id: '550e8400-e29b-41d4-a716-446655440001' },
            update: {},
            create: {
                id: '550e8400-e29b-41d4-a716-446655440001',
                name: 'Centrum',
                city: 'Amsterdam',
                postalCode: '1012',
                description: 'Historic city center of Amsterdam'
            }
        }),
        prisma.neighborhood.upsert({
            where: { id: '550e8400-e29b-41d4-a716-446655440002' },
            update: {},
            create: {
                id: '550e8400-e29b-41d4-a716-446655440002',
                name: 'Jordaan',
                city: 'Amsterdam',
                postalCode: '1016',
                description: 'Charming neighborhood with narrow streets and canals'
            }
        }),
        prisma.neighborhood.upsert({
            where: { id: '550e8400-e29b-41d4-a716-446655440003' },
            update: {},
            create: {
                id: '550e8400-e29b-41d4-a716-446655440003',
                name: 'De Pijp',
                city: 'Amsterdam',
                postalCode: '1073',
                description: 'Vibrant area known for the Albert Cuyp Market'
            }
        })
    ])

    console.log('✅ Neighborhoods created')

    // Create admin user
    const adminUser = await prisma.user.upsert({
        where: { email: process.env.ADMIN_EMAIL || 'admin@communityforum.com' },
        update: {},
        create: {
            id: '550e8400-e29b-41d4-a716-446655440000',
            email: process.env.ADMIN_EMAIL || 'admin@communityforum.com',
            username: 'admin',
            fullName: 'Admin User',
            isAdmin: true,
            isVerified: true,
            neighborhoodId: neighborhoods[0].id,
            reputationScore: 100
        }
    })

    // Create regular users
    const users = await Promise.all([
        prisma.user.upsert({
            where: { email: 'john.doe@example.com' },
            update: {},
            create: {
                email: 'john.doe@example.com',
                username: 'johndoe',
                fullName: 'John Doe',
                isVerified: true,
                neighborhoodId: neighborhoods[0].id,
                reputationScore: 50
            }
        }),
        prisma.user.upsert({
            where: { email: 'jane.smith@example.com' },
            update: {},
            create: {
                email: 'jane.smith@example.com',
                username: 'janesmith',
                fullName: 'Jane Smith',
                isVerified: true,
                neighborhoodId: neighborhoods[1].id,
                reputationScore: 75
            }
        }),
        prisma.user.upsert({
            where: { email: 'bob.wilson@example.com' },
            update: {},
            create: {
                email: 'bob.wilson@example.com',
                username: 'bobwilson',
                fullName: 'Bob Wilson',
                isVerified: false,
                neighborhoodId: neighborhoods[2].id,
                reputationScore: 25
            }
        })
    ])

    console.log('✅ Users created')

    // Create sample events
    const events = [
        {
            id: '660e8400-e29b-41d4-a716-446655440001',
            title: 'Community Yoga in the Park',
            description: 'Join us for a relaxing yoga session in Vondelpark. Suitable for all levels. Bring your own mat!',
            category: EventCategory.HEALTH,
            startDate: new Date('2025-06-01T09:00:00Z'),
            endDate: new Date('2025-06-01T10:30:00Z'),
            location: 'Vondelpark, Amsterdam',
            capacity: 20,
            createdBy: adminUser.id,
            neighborhoodId: neighborhoods[0].id,
            coordinates: { lat: 52.3579946, lng: 4.8686671 }
        },
        {
            id: '660e8400-e29b-41d4-a716-446655440002',
            title: 'Tech Meetup: AI & Machine Learning',
            description: 'Monthly meetup for tech enthusiasts to discuss the latest in AI and ML. Networking and knowledge sharing.',
            category: EventCategory.TECHNOLOGY,
            startDate: new Date('2025-06-05T18:00:00Z'),
            endDate: new Date('2025-06-05T21:00:00Z'),
            location: 'TechHub Amsterdam',
            capacity: 50,
            createdBy: adminUser.id,
            neighborhoodId: neighborhoods[0].id,
            coordinates: { lat: 52.3702157, lng: 4.8951679 }
        },
        {
            id: '660e8400-e29b-41d4-a716-446655440003',
            title: 'Neighborhood Cleanup Day',
            description: 'Help keep our neighborhood clean! We provide all supplies. Great way to meet your neighbors.',
            category: EventCategory.VOLUNTEER,
            startDate: new Date('2025-06-08T10:00:00Z'),
            endDate: new Date('2025-06-08T14:00:00Z'),
            location: 'Jordaan District',
            capacity: 30,
            createdBy: adminUser.id,
            neighborhoodId: neighborhoods[1].id,
            coordinates: { lat: 52.3747558, lng: 4.8807363 }
        },
        {
            id: '660e8400-e29b-41d4-a716-446655440004',
            title: 'Cultural Heritage Walk',
            description: 'Discover the rich history of De Pijp with our guided walking tour. Learn about local architecture and stories.',
            category: EventCategory.CULTURAL,
            startDate: new Date('2025-06-12T14:00:00Z'),
            endDate: new Date('2025-06-12T16:00:00Z'),
            location: 'De Pijp District',
            capacity: 15,
            createdBy: adminUser.id,
            neighborhoodId: neighborhoods[2].id,
            coordinates: { lat: 52.3547498, lng: 4.8918393 }
        },
        {
            id: '660e8400-e29b-41d4-a716-446655440005',
            title: 'Football Tournament',
            description: 'Annual neighborhood football tournament. Form teams or join as individual. Prizes for winners!',
            category: EventCategory.SPORTS,
            startDate: new Date('2025-06-15T09:00:00Z'),
            endDate: new Date('2025-06-15T17:00:00Z'),
            location: 'Flevopark Football Fields',
            capacity: 100,
            createdBy: adminUser.id,
            neighborhoodId: neighborhoods[0].id,
            coordinates: { lat: 52.3729469, lng: 4.9441704 }
        }
    ]

    for (const eventData of events) {
        await prisma.event.upsert({
            where: { id: eventData.id },
            update: {},
            create: eventData
        })
    }

    console.log('✅ Events created')

    // Create some event registrations using upsert to avoid duplicates
    const eventRegistrations = [
        {
            eventId: '660e8400-e29b-41d4-a716-446655440001', // Yoga event
            userId: users[0].id,
            status: 'REGISTERED' as const
        },
        {
            eventId: '660e8400-e29b-41d4-a716-446655440002', // Tech meetup
            userId: users[1].id,
            status: 'REGISTERED' as const
        },
        {
            eventId: '660e8400-e29b-41d4-a716-446655440003', // Cleanup day
            userId: users[2].id,
            status: 'REGISTERED' as const
        }
    ]

    for (const registration of eventRegistrations) {
        await prisma.eventRegistration.upsert({
            where: {
                eventId_userId: {
                    eventId: registration.eventId,
                    userId: registration.userId
                }
            },
            update: {},
            create: registration
        })
    }

    console.log('✅ Event registrations created')

    // Create marketplace categories
    const categories = await Promise.all([
        prisma.category.upsert({
            where: { name: 'Electronics' },
            update: {},
            create: {
                id: '770e8400-e29b-41d4-a716-446655440001',
                name: 'Electronics',
                description: 'Electronic devices and gadgets',
                sortOrder: 1
            }
        }),
        prisma.category.upsert({
            where: { name: 'Furniture' },
            update: {},
            create: {
                id: '770e8400-e29b-41d4-a716-446655440002',
                name: 'Furniture',
                description: 'Home and office furniture',
                sortOrder: 2
            }
        }),
        prisma.category.upsert({
            where: { name: 'Clothing' },
            update: {},
            create: {
                id: '770e8400-e29b-41d4-a716-446655440003',
                name: 'Clothing',
                description: 'Clothing and accessories',
                sortOrder: 3
            }
        }),
        prisma.category.upsert({
            where: { name: 'Books' },
            update: {},
            create: {
                id: '770e8400-e29b-41d4-a716-446655440004',
                name: 'Books',
                description: 'Books and educational materials',
                sortOrder: 4
            }
        }),
        prisma.category.upsert({
            where: { name: 'Sports & Recreation' },
            update: {},
            create: {
                id: '770e8400-e29b-41d4-a716-446655440005',
                name: 'Sports & Recreation',
                description: 'Sports equipment and recreational items',
                sortOrder: 5
            }
        }),
        prisma.category.upsert({
            where: { name: 'Home & Garden' },
            update: {},
            create: {
                id: '770e8400-e29b-41d4-a716-446655440006',
                name: 'Home & Garden',
                description: 'Home improvement and garden items',
                sortOrder: 6
            }
        }),
        prisma.category.upsert({
            where: { name: 'Free Items' },
            update: {},
            create: {
                id: '770e8400-e29b-41d4-a716-446655440007',
                name: 'Free Items',
                description: 'Items being given away for free',
                sortOrder: 7
            }
        })
    ])

    console.log('✅ Categories created')

    // Create some subcategories
    const subcategories = await Promise.all([
        prisma.category.upsert({
            where: { name: 'Smartphones' },
            update: {},
            create: {
                id: '770e8400-e29b-41d4-a716-446655440008',
                name: 'Smartphones',
                description: 'Mobile phones and smartphones',
                parentId: categories.find(c => c.name === 'Electronics')?.id,
                sortOrder: 1
            }
        }),
        prisma.category.upsert({
            where: { name: 'Laptops' },
            update: {},
            create: {
                id: '770e8400-e29b-41d4-a716-446655440009',
                name: 'Laptops',
                description: 'Laptops and notebooks',
                parentId: categories.find(c => c.name === 'Electronics')?.id,
                sortOrder: 2
            }
        }),
        prisma.category.upsert({
            where: { name: 'Chairs' },
            update: {},
            create: {
                id: '770e8400-e29b-41d4-a716-446655440010',
                name: 'Chairs',
                description: 'All types of chairs',
                parentId: categories.find(c => c.name === 'Furniture')?.id,
                sortOrder: 1
            }
        }),
        prisma.category.upsert({
            where: { name: 'Tables' },
            update: {},
            create: {
                id: '770e8400-e29b-41d4-a716-446655440011',
                name: 'Tables',
                description: 'Dining tables, coffee tables, desks',
                parentId: categories.find(c => c.name === 'Furniture')?.id,
                sortOrder: 2
            }
        })
    ])

    console.log('✅ Subcategories created')

    // Create tags
    const tags = await Promise.all([
        prisma.tag.upsert({
            where: { name: 'vintage' },
            update: {},
            create: {
                id: '880e8400-e29b-41d4-a716-446655440001',
                name: 'vintage',
                description: 'Vintage or retro items'
            }
        }),
        prisma.tag.upsert({
            where: { name: 'like-new' },
            update: {},
            create: {
                id: '880e8400-e29b-41d4-a716-446655440002',
                name: 'like-new',
                description: 'Items in excellent condition'
            }
        }),
        prisma.tag.upsert({
            where: { name: 'designer' },
            update: {},
            create: {
                id: '880e8400-e29b-41d4-a716-446655440003',
                name: 'designer',
                description: 'Designer or brand items'
            }
        }),
        prisma.tag.upsert({
            where: { name: 'handmade' },
            update: {},
            create: {
                id: '880e8400-e29b-41d4-a716-446655440004',
                name: 'handmade',
                description: 'Handmade or crafted items'
            }
        }),
        prisma.tag.upsert({
            where: { name: 'eco-friendly' },
            update: {},
            create: {
                id: '880e8400-e29b-41d4-a716-446655440005',
                name: 'eco-friendly',
                description: 'Environmentally friendly items'
            }
        })
    ])

    console.log('✅ Tags created')

    // Create sample marketplace listings
    const sampleListings = [
        {
            id: '990e8400-e29b-41d4-a716-446655440001',
            title: 'iPhone 12 Pro - Excellent Condition',
            description: 'Selling my iPhone 12 Pro in excellent condition. No scratches, always used with a case and screen protector. Comes with original box and charger.',
            price: 650.00,
            isFree: false,
            condition: 'LIKE_NEW' as const,
            images: [
                'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
                'https://images.unsplash.com/photo-1565849904461-04a58b4e0224?w=500'
            ],
            sellerId: users[0].id,
            categoryId: subcategories.find(c => c.name === 'Smartphones')?.id || categories[0].id,
            neighborhoodId: neighborhoods[0].id
        },
        {
            id: '990e8400-e29b-41d4-a716-446655440002',
            title: 'Vintage Wooden Coffee Table',
            description: 'Beautiful vintage wooden coffee table from the 1960s. Some minor wear but adds character. Perfect for a retro living room setup.',
            price: 150.00,
            isFree: false,
            condition: 'GOOD' as const,
            images: [
                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
                'https://images.unsplash.com/photo-1549497538-303791108f95?w=500'
            ],
            sellerId: users[1].id,
            categoryId: subcategories.find(c => c.name === 'Tables')?.id || categories[1].id,
            neighborhoodId: neighborhoods[1].id
        },
        {
            id: '990e8400-e29b-41d4-a716-446655440003',
            title: 'Free Moving Boxes - Various Sizes',
            description: 'Moving out and have lots of sturdy cardboard boxes in good condition. Various sizes available. Free to good home!',
            price: null,
            isFree: true,
            condition: 'USED' as const,
            images: [
                'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500'
            ],
            sellerId: users[2].id,
            categoryId: categories.find(c => c.name === 'Free Items')?.id || categories[6].id,
            neighborhoodId: neighborhoods[2].id
        },
        {
            id: '990e8400-e29b-41d4-a716-446655440004',
            title: 'Programming Books Collection',
            description: 'Collection of programming books including JavaScript, Python, and React. All in good condition. Selling as a bundle.',
            price: 45.00,
            isFree: false,
            condition: 'GOOD' as const,
            images: [
                'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',
                'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500'
            ],
            sellerId: adminUser.id,
            categoryId: categories.find(c => c.name === 'Books')?.id || categories[3].id,
            neighborhoodId: neighborhoods[0].id
        },
        {
            id: '990e8400-e29b-41d4-a716-446655440005',
            title: 'Bicycle - City Bike, Well Maintained',
            description: 'Classic Dutch city bike in great condition. Recently serviced, new brakes and chain. Perfect for commuting around Amsterdam.',
            price: 180.00,
            isFree: false,
            condition: 'GOOD' as const,
            images: [
                'https://images.unsplash.com/photo-1544191696-15693be7e85b?w=500',
                'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=500'
            ],
            sellerId: users[0].id,
            categoryId: categories.find(c => c.name === 'Sports & Recreation')?.id || categories[4].id,
            neighborhoodId: neighborhoods[1].id
        },
        {
            id: '990e8400-e29b-41d4-a716-446655440006',
            title: 'Designer Office Chair - Herman Miller',
            description: 'Herman Miller Aeron chair, size B. Used but in excellent condition. Ergonomic design, perfect for home office.',
            price: 450.00,
            isFree: false,
            condition: 'LIKE_NEW' as const,
            images: [
                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
                'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=500'
            ],
            sellerId: users[1].id,
            categoryId: subcategories.find(c => c.name === 'Chairs')?.id || categories[1].id,
            neighborhoodId: neighborhoods[0].id
        }
    ]

    for (const listingData of sampleListings) {
        await prisma.marketListing.upsert({
            where: { id: listingData.id },
            update: {},
            create: listingData
        })
    }

    console.log('✅ Sample marketplace listings created')

    // Create tags for listings using upsert to avoid conflicts
    const listingTags = [
        // iPhone - like-new tag
        {
            listingId: '990e8400-e29b-41d4-a716-446655440001',
            tagId: tags.find(t => t.name === 'like-new')?.id || tags[1].id
        },
        // Coffee table - vintage tag
        {
            listingId: '990e8400-e29b-41d4-a716-446655440002',
            tagId: tags.find(t => t.name === 'vintage')?.id || tags[0].id
        },
        // Herman Miller chair - designer tag
        {
            listingId: '990e8400-e29b-41d4-a716-446655440006',
            tagId: tags.find(t => t.name === 'designer')?.id || tags[2].id
        },
        // Herman Miller chair - like-new tag
        {
            listingId: '990e8400-e29b-41d4-a716-446655440006',
            tagId: tags.find(t => t.name === 'like-new')?.id || tags[1].id
        }
    ]

    for (const tagData of listingTags) {
        await prisma.marketListingTag.upsert({
            where: {
                listingId_tagId: {
                    listingId: tagData.listingId,
                    tagId: tagData.tagId
                }
            },
            update: {},
            create: tagData
        })
    }

    console.log('✅ Listing tags created')

    // Create some sample requests using upsert to avoid conflicts
    const sampleRequests = [
        {
            id: 'aa0e8400-e29b-41d4-a716-446655440001',
            listingId: '990e8400-e29b-41d4-a716-446655440001', // iPhone
            buyerId: users[1].id,
            message: 'Hi! Is this still available? I can pick it up this weekend.',
            status: 'PENDING' as const
        },
        {
            id: 'aa0e8400-e29b-41d4-a716-446655440002',
            listingId: '990e8400-e29b-41d4-a716-446655440002', // Coffee table
            buyerId: users[2].id,
            message: 'Love this table! Would you consider 130?',
            status: 'PENDING' as const
        },
        {
            id: 'aa0e8400-e29b-41d4-a716-446655440003',
            listingId: '990e8400-e29b-41d4-a716-446655440001', // iPhone (different buyer)
            buyerId: users[2].id,
            message: 'Very interested. Can you provide more photos?',
            status: 'PENDING' as const
        }
    ]

    for (const requestData of sampleRequests) {
        await prisma.marketRequest.upsert({
            where: {
                listingId_buyerId: {
                    listingId: requestData.listingId,
                    buyerId: requestData.buyerId
                }
            },
            update: {},
            create: requestData
        })
    }

    console.log('✅ Sample marketplace requests created')
    console.log('🎉 Database seeding completed successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })