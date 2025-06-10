// prisma/seed.ts - Enhanced with all new tables and relationships

import { PrismaClient, EventCategory, ItemCondition, ListingStatus, RequestStatus, ReviewType, EventStatus, RegistrationStatus, CommunityPostCategory } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting comprehensive database seeding...')

    // Clean up existing data
    console.log('🧹 Cleaning existing data...')
    await prisma.$transaction([
        prisma.marketReview.deleteMany(),
        prisma.marketRequest.deleteMany(),
        prisma.marketListingTag.deleteMany(),
        prisma.marketListing.deleteMany(),
        prisma.tag.deleteMany(),
        prisma.category.deleteMany(),
        prisma.eventRegistration.deleteMany(),
        prisma.eventComment.deleteMany(),
        prisma.eventView.deleteMany(),
        prisma.eventImage.deleteMany(),
        prisma.event.deleteMany(),
        prisma.communityPostComment.deleteMany(),
        prisma.communityPostAttachment.deleteMany(),
        prisma.communityPost.deleteMany(),
        prisma.user.deleteMany(),
        prisma.neighborhood.deleteMany()
    ])

    // 1. Create Neighborhoods
    console.log('🏘️ Creating neighborhoods...')
    const neighborhoods = await Promise.all([
        prisma.neighborhood.create({
            data: {
                id: '550e8400-e29b-41d4-a716-446655440001',
                name: 'Centrum',
                city: 'Amsterdam',
                postalCode: '1012',
                description: 'Historic city center of Amsterdam',
                boundaryCoordinates: {
                    type: 'Polygon',
                    coordinates: [[[4.88, 52.36], [4.90, 52.36], [4.90, 52.38], [4.88, 52.38], [4.88, 52.36]]]
                }
            }
        }),
        prisma.neighborhood.create({
            data: {
                id: '550e8400-e29b-41d4-a716-446655440002',
                name: 'Jordaan',
                city: 'Amsterdam',
                postalCode: '1016',
                description: 'Charming neighborhood with narrow streets and canals',
                boundaryCoordinates: {
                    type: 'Polygon',
                    coordinates: [[[4.87, 52.37], [4.89, 52.37], [4.89, 52.39], [4.87, 52.39], [4.87, 52.37]]]
                }
            }
        }),
        prisma.neighborhood.create({
            data: {
                id: '550e8400-e29b-41d4-a716-446655440003',
                name: 'De Pijp',
                city: 'Amsterdam',
                postalCode: '1073',
                description: 'Vibrant area known for the Albert Cuyp Market',
                boundaryCoordinates: {
                    type: 'Polygon',
                    coordinates: [[[4.89, 52.35], [4.91, 52.35], [4.91, 52.37], [4.89, 52.37], [4.89, 52.35]]]
                }
            }
        }),
        prisma.neighborhood.create({
            data: {
                id: '550e8400-e29b-41d4-a716-446655440004',
                name: 'Oud-Zuid',
                city: 'Amsterdam',
                postalCode: '1071',
                description: 'Upscale area with museums and parks'
            }
        }),
        prisma.neighborhood.create({
            data: {
                id: '550e8400-e29b-41d4-a716-446655440005',
                name: 'Noord',
                city: 'Amsterdam',
                postalCode: '1031',
                description: 'Creative and upcoming area across the IJ'
            }
        })
    ])

    // 2. Create Users
    console.log('👥 Creating users...')
    const adminUser = await prisma.user.create({
        data: {
            id: '550e8400-e29b-41d4-a716-446655440000',
            email: process.env.ADMIN_EMAIL || 'admin@communityforum.com',
            username: 'admin',
            fullName: 'Admin User',
            isAdmin: true,
            isVerified: true,
            neighborhoodId: neighborhoods[0].id,
            reputationScore: 100,
            avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            privacySettings: {
                showEmail: false,
                showPhone: false,
                showLastActive: true
            },
            notificationPreferences: {
                emailNotifications: true,
                pushNotifications: true,
                eventReminders: true
            }
        }
    })

    const users = await Promise.all([
        prisma.user.create({
            data: {
                email: 'john.doe@example.com',
                username: 'johndoe',
                fullName: 'John Doe',
                isVerified: true,
                neighborhoodId: neighborhoods[0].id,
                reputationScore: 85,
                avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                phone: '+31612345678'
            }
        }),
        prisma.user.create({
            data: {
                email: 'jane.smith@example.com',
                username: 'janesmith',
                fullName: 'Jane Smith',
                isVerified: true,
                neighborhoodId: neighborhoods[1].id,
                reputationScore: 92,
                avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b9c6f3a7?w=150',
                phone: '+31687654321'
            }
        }),
        prisma.user.create({
            data: {
                email: 'bob.wilson@example.com',
                username: 'bobwilson',
                fullName: 'Bob Wilson',
                isVerified: false,
                neighborhoodId: neighborhoods[2].id,
                reputationScore: 45,
                avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
            }
        }),
        prisma.user.create({
            data: {
                email: 'alice.brown@example.com',
                username: 'alicebrown',
                fullName: 'Alice Brown',
                isVerified: true,
                neighborhoodId: neighborhoods[3].id,
                reputationScore: 78,
                avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
            }
        }),
        prisma.user.create({
            data: {
                email: 'charlie.davis@example.com',
                username: 'charliedavis',
                fullName: 'Charlie Davis',
                isVerified: true,
                neighborhoodId: neighborhoods[4].id,
                reputationScore: 67,
                avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
            }
        }),
        prisma.user.create({
            data: {
                email: 'emma.johnson@example.com',
                username: 'emmajohnson',
                fullName: 'Emma Johnson',
                isVerified: true,
                neighborhoodId: neighborhoods[1].id,
                reputationScore: 89,
                avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
            }
        })
    ])

    // 3. Create Events with enhanced data
    console.log('📅 Creating events...')
    const events = await Promise.all([
        prisma.event.create({
            data: {
                id: '660e8400-e29b-41d4-a716-446655440001',
                title: 'Community Yoga in Vondelpark',
                description: 'Join us for a relaxing yoga session in the beautiful Vondelpark. This session is suitable for all levels, from beginners to advanced practitioners. We will focus on breathing techniques, basic poses, and meditation. Bring your own yoga mat and water bottle. In case of rain, the session will be moved to the community center.',
                shortDescription: 'Relaxing yoga session in Vondelpark for all levels',
                category: EventCategory.HEALTH,
                startDate: new Date('2025-06-15T09:00:00Z'),
                endDate: new Date('2025-06-15T10:30:00Z'),
                location: 'Vondelpark, Amsterdam',
                coordinates: { lat: 52.3579946, lng: 4.8686671 },
                capacity: 25,
                price: 0,
                isFree: true,
                tags: ['yoga', 'wellness', 'outdoor', 'beginner-friendly'],
                createdBy: adminUser.id,
                neighborhoodId: neighborhoods[0].id,
                status: EventStatus.ACTIVE,
                featured: true,
                imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800'
            }
        }),
        prisma.event.create({
            data: {
                id: '660e8400-e29b-41d4-a716-446655440002',
                title: 'Tech Meetup: AI & Machine Learning',
                description: 'Monthly meetup for tech enthusiasts to discuss the latest developments in AI and Machine Learning. This month we will have presentations about neural networks, practical applications of AI in daily life, and hands-on workshops with Python and TensorFlow.',
                shortDescription: 'Monthly tech meetup on AI and ML topics',
                category: EventCategory.TECHNOLOGY,
                startDate: new Date('2025-06-20T18:00:00Z'),
                endDate: new Date('2025-06-20T21:00:00Z'),
                location: 'TechHub Amsterdam, Oosterdoksstraat 114',
                coordinates: { lat: 52.3702157, lng: 4.8951679 },
                capacity: 50,
                price: 5.00,
                isFree: false,
                tags: ['tech', 'AI', 'programming', 'networking'],
                createdBy: users[0].id,
                neighborhoodId: neighborhoods[0].id,
                status: EventStatus.ACTIVE,
                imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800'
            }
        }),
        prisma.event.create({
            data: {
                id: '660e8400-e29b-41d4-a716-446655440003',
                title: 'Neighborhood Cleanup Day',
                description: 'Help keep our beautiful Jordaan neighborhood clean and green! We provide all necessary supplies including gloves, trash bags, and cleaning tools. Great opportunity to meet your neighbors and make a positive impact on our community.',
                shortDescription: 'Community cleanup event in Jordaan district',
                category: EventCategory.CLEANUP,
                startDate: new Date('2025-06-22T10:00:00Z'),
                endDate: new Date('2025-06-22T14:00:00Z'),
                location: 'Jordaan District, Meeting point: Noordermarkt',
                coordinates: { lat: 52.3747558, lng: 4.8807363 },
                capacity: 30,
                price: 0,
                isFree: true,
                tags: ['environment', 'community', 'volunteer'],
                createdBy: users[1].id,
                neighborhoodId: neighborhoods[1].id,
                status: EventStatus.ACTIVE,
                featured: true,
                imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800'
            }
        }),
        prisma.event.create({
            data: {
                id: '660e8400-e29b-41d4-a716-446655440004',
                title: 'Cultural Heritage Walking Tour',
                description: 'Discover the rich cultural heritage of De Pijp district through our guided walking tour. Learn about the architecture, history, and stories that shaped this vibrant neighborhood. Tour includes stops at historical buildings, local art installations, and hidden gems.',
                shortDescription: 'Guided tour of De Pijp cultural heritage',
                category: EventCategory.CULTURAL,
                startDate: new Date('2025-06-25T14:00:00Z'),
                endDate: new Date('2025-06-25T16:30:00Z'),
                location: 'De Pijp District, Starting point: Albert Cuyp Market',
                coordinates: { lat: 52.3547498, lng: 4.8918393 },
                capacity: 20,
                price: 7.50,
                isFree: false,
                tags: ['culture', 'history', 'walking', 'heritage'],
                createdBy: users[2].id,
                neighborhoodId: neighborhoods[2].id,
                status: EventStatus.ACTIVE,
                imageUrl: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800'
            }
        }),
        prisma.event.create({
            data: {
                id: '660e8400-e29b-41d4-a716-446655440005',
                title: 'Community Football Tournament',
                description: 'Annual neighborhood football tournament open to all skill levels. Form teams with your neighbors or join as an individual. Prizes for winners, but the main goal is fun and community building!',
                shortDescription: 'Annual neighborhood football tournament',
                category: EventCategory.SPORTS,
                startDate: new Date('2025-06-28T09:00:00Z'),
                endDate: new Date('2025-06-28T17:00:00Z'),
                location: 'Flevopark Football Fields',
                coordinates: { lat: 52.3729469, lng: 4.9441704 },
                capacity: 100,
                price: 3.00,
                isFree: false,
                tags: ['football', 'sports', 'tournament', 'community'],
                createdBy: users[3].id,
                neighborhoodId: neighborhoods[0].id,
                status: EventStatus.ACTIVE,
                imageUrl: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800'
            }
        }),
        prisma.event.create({
            data: {
                id: '660e8400-e29b-41d4-a716-446655440006',
                title: 'Local Farmers Market Setup',
                description: 'Help set up the weekly farmers market in Noord. Volunteers needed to arrange stalls, set up tables, and assist vendors. Great way to support local farmers and businesses.',
                shortDescription: 'Volunteer at local farmers market setup',
                category: EventCategory.MARKET,
                startDate: new Date('2025-06-30T07:00:00Z'),
                endDate: new Date('2025-06-30T09:00:00Z'),
                location: 'Noorderpark, Amsterdam Noord',
                coordinates: { lat: 52.3899849, lng: 4.9235838 },
                capacity: 15,
                price: 0,
                isFree: true,
                tags: ['market', 'volunteer', 'local-business'],
                createdBy: users[4].id,
                neighborhoodId: neighborhoods[4].id,
                status: EventStatus.ACTIVE,
                imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800'
            }
        }),
        prisma.event.create({
            data: {
                id: '660e8400-e29b-41d4-a716-446655440007',
                title: 'Sustainable Living Workshop',
                description: 'Learn practical tips for sustainable living in an urban environment. Topics include zero waste practices, urban gardening, energy conservation, and sustainable transportation options.',
                shortDescription: 'Learn practical sustainable living tips',
                category: EventCategory.WORKSHOP,
                startDate: new Date('2025-07-02T19:00:00Z'),
                endDate: new Date('2025-07-02T21:00:00Z'),
                location: 'Community Center Oud-Zuid',
                coordinates: { lat: 52.3540573, lng: 4.8788717 },
                capacity: 25,
                price: 10.00,
                isFree: false,
                tags: ['sustainability', 'workshop', 'environment', 'education'],
                createdBy: users[5].id,
                neighborhoodId: neighborhoods[3].id,
                status: EventStatus.ACTIVE,
                imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800'
            }
        })
    ])

    // 4. Create Event Images
    console.log('🖼️ Creating event images...')
    const eventImages = await Promise.all([
        // Yoga event images
        prisma.eventImage.create({
            data: {
                eventId: events[0].id,
                url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
                alt: 'People doing yoga in park',
                isPrimary: true,
                order: 1
            }
        }),
        prisma.eventImage.create({
            data: {
                eventId: events[0].id,
                url: 'https://images.unsplash.com/photo-1506629905242-5d2d3b7b0c5e?w=800',
                alt: 'Yoga mats in Vondelpark',
                isPrimary: false,
                order: 2
            }
        }),
        // Tech meetup images
        prisma.eventImage.create({
            data: {
                eventId: events[1].id,
                url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
                alt: 'Tech meetup presentation',
                isPrimary: true,
                order: 1
            }
        }),
        // Cleanup event images
        prisma.eventImage.create({
            data: {
                eventId: events[2].id,
                url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800',
                alt: 'Community cleanup volunteers',
                isPrimary: true,
                order: 1
            }
        }),
        prisma.eventImage.create({
            data: {
                eventId: events[2].id,
                url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
                alt: 'Cleanup supplies ready',
                isPrimary: false,
                order: 2
            }
        })
    ])

    // 5. Create Event Registrations
    console.log('📝 Creating event registrations...')
    const registrations = await Promise.all([
        // Yoga event registrations
        prisma.eventRegistration.create({
            data: {
                eventId: events[0].id,
                userId: users[0].id,
                status: RegistrationStatus.REGISTERED,
                notes: 'Looking forward to my first yoga session!',
                position: 1
            }
        }),
        prisma.eventRegistration.create({
            data: {
                eventId: events[0].id,
                userId: users[1].id,
                status: RegistrationStatus.REGISTERED,
                notes: 'I practice yoga regularly, excited to join the community',
                emergencyContact: {
                    name: 'John Smith',
                    phone: '+31612345678'
                },
                position: 2
            }
        }),
        prisma.eventRegistration.create({
            data: {
                eventId: events[0].id,
                userId: users[2].id,
                status: RegistrationStatus.WAITLIST,
                notes: 'Hope there will be a spot available',
                position: 1
            }
        }),
        // Tech meetup registrations
        prisma.eventRegistration.create({
            data: {
                eventId: events[1].id,
                userId: users[1].id,
                status: RegistrationStatus.REGISTERED,
                notes: 'Interested in AI applications in healthcare',
                position: 1
            }
        }),
        prisma.eventRegistration.create({
            data: {
                eventId: events[1].id,
                userId: users[3].id,
                status: RegistrationStatus.REGISTERED,
                notes: 'Machine learning enthusiast',
                position: 2
            }
        }),
        // Cleanup event registrations
        prisma.eventRegistration.create({
            data: {
                eventId: events[2].id,
                userId: users[0].id,
                status: RegistrationStatus.REGISTERED,
                notes: 'Happy to help keep our neighborhood clean',
                position: 1
            }
        }),
        prisma.eventRegistration.create({
            data: {
                eventId: events[2].id,
                userId: users[4].id,
                status: RegistrationStatus.REGISTERED,
                notes: 'Environmental activist, excited to contribute',
                position: 2
            }
        }),
        // Cultural tour registrations
        prisma.eventRegistration.create({
            data: {
                eventId: events[3].id,
                userId: users[2].id,
                status: RegistrationStatus.REGISTERED,
                notes: 'Love learning about local history',
                position: 1
            }
        })
    ])

    // 6. Create Event Comments
    console.log('💬 Creating event comments...')
    const comments = await Promise.all([
        // Comments on yoga event
        prisma.eventComment.create({
            data: {
                eventId: events[0].id,
                userId: users[0].id,
                content: 'What should I bring besides a yoga mat?',
                createdAt: new Date('2025-06-10T14:30:00Z')
            }
        }),
        prisma.eventComment.create({
            data: {
                eventId: events[0].id,
                userId: adminUser.id,
                content: 'Just bring a water bottle and comfortable clothes. We provide everything else!',
                parentId: undefined, // This would be set to the previous comment ID in a real scenario
                createdAt: new Date('2025-06-10T15:00:00Z')
            }
        }),
        prisma.eventComment.create({
            data: {
                eventId: events[0].id,
                userId: users[1].id,
                content: 'Is this suitable for complete beginners?',
                createdAt: new Date('2025-06-11T10:00:00Z')
            }
        }),
        // Comments on tech meetup
        prisma.eventComment.create({
            data: {
                eventId: events[1].id,
                userId: users[3].id,
                content: 'Will there be hands-on coding sessions?',
                createdAt: new Date('2025-06-18T16:20:00Z')
            }
        }),
        prisma.eventComment.create({
            data: {
                eventId: events[1].id,
                userId: users[0].id,
                content: 'Yes! We\'ll have Python workshops and TensorFlow demos.',
                createdAt: new Date('2025-06-18T16:45:00Z')
            }
        }),
        // Comments on cleanup event
        prisma.eventComment.create({
            data: {
                eventId: events[2].id,
                userId: users[4].id,
                content: 'What time should we arrive for the briefing?',
                createdAt: new Date('2025-06-20T12:00:00Z')
            }
        })
    ])

    // 7. Create Event Views (for analytics)
    console.log('👀 Creating event views...')
    const eventViews = []
    for (let i = 0; i < 50; i++) {
        const randomEvent = events[Math.floor(Math.random() * events.length)]
        const randomUser = Math.random() > 0.3 ? users[Math.floor(Math.random() * users.length)] : null
        const viewDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date in last 30 days
        
        eventViews.push(
            prisma.eventView.create({
                data: {
                    eventId: randomEvent.id,
                    userId: randomUser?.id,
                    viewedAt: viewDate,
                    duration: Math.floor(Math.random() * 300) + 30, // 30-330 seconds
                    source: ['direct', 'social', 'search', 'email'][Math.floor(Math.random() * 4)],
                    ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
                    userAgent: 'Mozilla/5.0 (compatible; Community Forum)'
                }
            })
        )
    }
    await Promise.all(eventViews)

    // 8. Create Marketplace Categories
    console.log('🏪 Creating marketplace categories...')
    const categories = await Promise.all([
        prisma.category.create({
            data: {
                id: '770e8400-e29b-41d4-a716-446655440001',
                name: 'Electronics',
                description: 'Electronic devices and gadgets',
                sortOrder: 1
            }
        }),
        prisma.category.create({
            data: {
                id: '770e8400-e29b-41d4-a716-446655440002',
                name: 'Furniture',
                description: 'Home and office furniture',
                sortOrder: 2
            }
        }),
        prisma.category.create({
            data: {
                id: '770e8400-e29b-41d4-a716-446655440003',
                name: 'Clothing',
                description: 'Clothing and accessories',
                sortOrder: 3
            }
        }),
        prisma.category.create({
            data: {
                id: '770e8400-e29b-41d4-a716-446655440004',
                name: 'Books',
                description: 'Books and educational materials',
                sortOrder: 4
            }
        }),
        prisma.category.create({
            data: {
                id: '770e8400-e29b-41d4-a716-446655440005',
                name: 'Sports & Recreation',
                description: 'Sports equipment and recreational items',
                sortOrder: 5
            }
        }),
        prisma.category.create({
            data: {
                id: '770e8400-e29b-41d4-a716-446655440006',
                name: 'Home & Garden',
                description: 'Home improvement and garden items',
                sortOrder: 6
            }
        }),
        prisma.category.create({
            data: {
                id: '770e8400-e29b-41d4-a716-446655440007',
                name: 'Free Items',
                description: 'Items being given away for free',
                sortOrder: 7
            }
        })
    ])

    // 9. Create subcategories
    console.log('📂 Creating subcategories...')
    const subcategories = await Promise.all([
        prisma.category.create({
            data: {
                name: 'Smartphones',
                description: 'Mobile phones and smartphones',
                parentId: categories[0].id,
                sortOrder: 1
            }
        }),
        prisma.category.create({
            data: {
                name: 'Laptops',
                description: 'Laptops and notebooks',
                parentId: categories[0].id,
                sortOrder: 2
            }
        }),
        prisma.category.create({
            data: {
                name: 'Chairs',
                description: 'All types of chairs',
                parentId: categories[1].id,
                sortOrder: 1
            }
        }),
        prisma.category.create({
            data: {
                name: 'Tables',
                description: 'Dining tables, coffee tables, desks',
                parentId: categories[1].id,
                sortOrder: 2
            }
        })
    ])

    // 10. Create Tags
    console.log('🏷️ Creating tags...')
    const tags = await Promise.all([
        prisma.tag.create({
            data: {
                name: 'vintage',
                description: 'Vintage or retro items'
            }
        }),
        prisma.tag.create({
            data: {
                name: 'like-new',
                description: 'Items in excellent condition'
            }
        }),
        prisma.tag.create({
            data: {
                name: 'designer',
                description: 'Designer or brand items'
            }
        }),
        prisma.tag.create({
            data: {
                name: 'handmade',
                description: 'Handmade or crafted items'
            }
        }),
        prisma.tag.create({
            data: {
                name: 'eco-friendly',
                description: 'Environmentally friendly items'
            }
        }),
        prisma.tag.create({
            data: {
                name: 'urgent',
                description: 'Items that need to be sold/given away quickly'
            }
        }),
        prisma.tag.create({
            data: {
                name: 'collectible',
                description: 'Collectible or rare items'
            }
        })
    ])

    // 11. Create Marketplace Listings
    console.log('🛍️ Creating marketplace listings...')
    const marketListings = await Promise.all([
        prisma.marketListing.create({
            data: {
                id: '990e8400-e29b-41d4-a716-446655440001',
                title: 'iPhone 13 Pro - Excellent Condition',
                description: 'Selling my iPhone 13 Pro in excellent condition. No scratches, always used with a case and screen protector. Comes with original box, charger, and unused EarPods. Battery health at 95%. Unlocked to all networks.',
                price: 650.00,
                isFree: false,
                condition: ItemCondition.LIKE_NEW,
                images: [
                    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
                    'https://images.unsplash.com/photo-1565849904461-04a58b4e0224?w=500'
                ],
                sellerId: users[0].id,
                categoryId: subcategories[0].id, // Smartphones
                neighborhoodId: neighborhoods[0].id,
                views: 45
            }
        }),
        prisma.marketListing.create({
            data: {
                id: '990e8400-e29b-41d4-a716-446655440002',
                title: 'Vintage Scandinavian Coffee Table',
                description: 'Beautiful vintage Scandinavian coffee table from the 1960s. Solid teak wood with some minor wear that adds character. Perfect for a retro living room setup. Dimensions: 120cm x 60cm x 45cm.',
                price: 185.00,
                isFree: false,
                condition: ItemCondition.GOOD,
                images: [
                    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
                    'https://images.unsplash.com/photo-1549497538-303791108f95?w=500'
                ],
                sellerId: users[1].id,
                categoryId: subcategories[3].id, // Tables
                neighborhoodId: neighborhoods[1].id,
                views: 32
            }
        }),
        prisma.marketListing.create({
            data: {
                id: '990e8400-e29b-41d4-a716-446655440003',
                title: 'Free Moving Boxes - Various Sizes',
                description: 'Moving out and have lots of sturdy cardboard boxes in good condition. Various sizes available from small to extra large. Perfect for your next move or storage needs. Free to good home! Pick up only.',
                price: null,
                isFree: true,
                condition: ItemCondition.USED,
                images: [
                    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500'
                ],
                sellerId: users[2].id,
                categoryId: categories[6].id, // Free Items
                neighborhoodId: neighborhoods[2].id,
                views: 28
            }
        }),
        prisma.marketListing.create({
            data: {
                id: '990e8400-e29b-41d4-a716-446655440004',
                title: 'Programming Books Collection',
                description: 'Complete collection of programming books including JavaScript: The Good Parts, Clean Code, Python Crash Course, and React documentation. All books in good condition with minimal highlighting. Selling as a bundle only.',
                price: 45.00,
                isFree: false,
                condition: ItemCondition.GOOD,
                images: [
                    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',
                    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500'
                ],
                sellerId: adminUser.id,
                categoryId: categories[3].id, // Books
                neighborhoodId: neighborhoods[0].id,
                views: 67
            }
        }),
        prisma.marketListing.create({
            data: {
                id: '990e8400-e29b-41d4-a716-446655440005',
                title: 'Dutch City Bike - Well Maintained',
                description: 'Classic Dutch city bike in great condition. Recently serviced with new brakes, chain, and tires. Perfect for commuting around Amsterdam. Includes front basket, lights, and lock. 7-speed Shimano gears.',
                price: 220.00,
                isFree: false,
                condition: ItemCondition.GOOD,
                images: [
                    'https://images.unsplash.com/photo-1544191696-15693be7e85b?w=500',
                    'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=500'
                ],
                sellerId: users[3].id,
                categoryId: categories[4].id, // Sports & Recreation
                neighborhoodId: neighborhoods[1].id,
                views: 89
            }
        }),
        prisma.marketListing.create({
            data: {
                id: '990e8400-e29b-41d4-a716-446655440006',
                title: 'Herman Miller Aeron Chair - Size B',
                description: 'Herman Miller Aeron chair in size B (medium). Used but in excellent condition. All mechanisms work perfectly. Ergonomic design perfect for home office or study. No pets, no smoking household.',
                price: 485.00,
                isFree: false,
                condition: ItemCondition.LIKE_NEW,
                images: [
                    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
                    'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=500'
                ],
                sellerId: users[4].id,
                categoryId: subcategories[2].id, // Chairs
                neighborhoodId: neighborhoods[3].id,
                views: 156
            }
        }),
        prisma.marketListing.create({
            data: {
                id: '990e8400-e29b-41d4-a716-446655440007',
                title: 'MacBook Pro 2021 - 16 inch',
                description: 'MacBook Pro 16" 2021 model with M1 Pro chip, 16GB RAM, 512GB SSD. Excellent condition, barely used. Comes with original charger and box. Perfect for creative work and development.',
                price: 1850.00,
                isFree: false,
                condition: ItemCondition.LIKE_NEW,
                images: [
                    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
                    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'
                ],
                sellerId: users[5].id,
                categoryId: subcategories[1].id, // Laptops
                neighborhoodId: neighborhoods[4].id,
                views: 234
            }
        }),
        prisma.marketListing.create({
            data: {
                id: '990e8400-e29b-41d4-a716-446655440008',
                title: 'Handmade Wooden Bookshelf',
                description: 'Beautiful handmade wooden bookshelf crafted from reclaimed oak. 5 shelves, perfect for books or decorative items. Eco-friendly and unique piece. Dimensions: 180cm H x 80cm W x 30cm D.',
                price: 125.00,
                isFree: false,
                condition: ItemCondition.NEW,
                images: [
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'
                ],
                sellerId: users[1].id,
                categoryId: categories[1].id, // Furniture
                neighborhoodId: neighborhoods[1].id,
                views: 78
            }
        })
    ])

    // 12. Create Market Listing Tags
    console.log('🔗 Creating listing tags...')
    await Promise.all([
        // iPhone - like-new tag
        prisma.marketListingTag.create({
            data: {
                listingId: marketListings[0].id,
                tagId: tags[1].id // like-new
            }
        }),
        // Coffee table - vintage tag
        prisma.marketListingTag.create({
            data: {
                listingId: marketListings[1].id,
                tagId: tags[0].id // vintage
            }
        }),
        // Moving boxes - urgent tag
        prisma.marketListingTag.create({
            data: {
                listingId: marketListings[2].id,
                tagId: tags[5].id // urgent
            }
        }),
        // Herman Miller chair - designer tag
        prisma.marketListingTag.create({
            data: {
                listingId: marketListings[5].id,
                tagId: tags[2].id // designer
            }
        }),
        // Herman Miller chair - like-new tag
        prisma.marketListingTag.create({
            data: {
                listingId: marketListings[5].id,
                tagId: tags[1].id // like-new
            }
        }),
        // Handmade bookshelf tags
        prisma.marketListingTag.create({
            data: {
                listingId: marketListings[7].id,
                tagId: tags[3].id // handmade
            }
        }),
        prisma.marketListingTag.create({
            data: {
                listingId: marketListings[7].id,
                tagId: tags[4].id // eco-friendly
            }
        })
    ])

    // 13. Create Market Requests
    console.log('💰 Creating market requests...')
    const marketRequests = await Promise.all([
        prisma.marketRequest.create({
            data: {
                listingId: marketListings[0].id, // iPhone
                buyerId: users[1].id,
                message: 'Hi! Is this still available? I can pick it up this weekend. Would you accept 600?',
                status: RequestStatus.PENDING
            }
        }),
        prisma.marketRequest.create({
            data: {
                listingId: marketListings[1].id, // Coffee table
                buyerId: users[2].id,
                message: 'Love this table! Would you consider 150? I can collect immediately.',
                status: RequestStatus.PENDING
            }
        }),
        prisma.marketRequest.create({
            data: {
                listingId: marketListings[0].id, // iPhone (different buyer)
                buyerId: users[3].id,
                message: 'Very interested! Can you provide more photos of the screen and back?',
                status: RequestStatus.PENDING
            }
        }),
        prisma.marketRequest.create({
            data: {
                listingId: marketListings[4].id, // Dutch bike
                buyerId: users[0].id,
                message: 'Perfect bike for my daily commute! Is the price negotiable?',
                status: RequestStatus.ACCEPTED
            }
        }),
        prisma.marketRequest.create({
            data: {
                listingId: marketListings[5].id, // Herman Miller chair
                buyerId: users[2].id,
                message: 'Been looking for this exact chair! When can I view it?',
                status: RequestStatus.ACCEPTED
            }
        }),
        prisma.marketRequest.create({
            data: {
                listingId: marketListings[6].id, // MacBook
                buyerId: users[0].id,
                message: 'Interested in the MacBook. Can we meet in Centrum?',
                status: RequestStatus.COMPLETED
            }
        })
    ])

    // 14. Create Market Reviews
    console.log('⭐ Creating market reviews...')
    await Promise.all([
        // Review for completed MacBook transaction
        prisma.marketReview.create({
            data: {
                listingId: marketListings[6].id,
                sellerId: users[5].id,
                buyerId: users[0].id,
                rating: 5,
                comment: 'Excellent seller! MacBook exactly as described, quick response, smooth transaction.',
                type: ReviewType.SELLER
            }
        }),
        // Review for Dutch bike (from buyer perspective)
        prisma.marketReview.create({
            data: {
                listingId: marketListings[4].id,
                sellerId: users[3].id,
                buyerId: users[0].id,
                rating: 4,
                comment: 'Great bike, very well maintained. Seller was helpful and flexible with pickup time.',
                type: ReviewType.SELLER
            }
        }),
        // Review for Herman Miller chair
        prisma.marketReview.create({
            data: {
                listingId: marketListings[5].id,
                sellerId: users[4].id,
                buyerId: users[2].id,
                rating: 5,
                comment: 'Chair is in perfect condition! Exactly what I needed for my home office.',
                type: ReviewType.SELLER
            }
        })
    ])

    // 15. Create Community Posts
    console.log('📝 Creating community posts...')
    const post1 = await prisma.communityPost.create({
        data: {
            title: 'Welcome to our community!',
            content: 'Welcome everyone to our new community forum.',
            category: CommunityPostCategory.ANNOUNCEMENT,
            userId: adminUser.id
        }
    })

    // Create community post comments
    await prisma.communityPostComment.create({
        data: {
            postId: post1.id,
            userId: users[0].id,
            content: 'Thanks for the warm welcome!'
        }
    })

    console.log('✅ Database seeding completed successfully!')
    
    // Print summary
    console.log('\n📊 Seeding Summary:')
    console.log(`├─ 🏘️ Neighborhoods: ${neighborhoods.length}`)
    console.log(`├─ 👥 Users: ${users.length + 1} (including admin)`)
    console.log(`├─ 📅 Events: ${events.length}`)
    console.log(`├─ 🖼️ Event Images: ${eventImages.length}`)
    console.log(`├─ 📝 Event Registrations: ${registrations.length}`)
    console.log(`├─ 💬 Event Comments: ${comments.length}`)
    console.log(`├─ 👀 Event Views: 50`)
    console.log(`├─ 📂 Event Categories: ${categories.length}`)
    console.log(`├─ 🏪 Marketplace Categories: ${categories.length}`)
    console.log(`├─ 📂 Subcategories: ${subcategories.length}`)
    console.log(`├─ 🏷️ Tags: ${tags.length}`)
    console.log(`├─ 🛍️ Market Listings: ${marketListings.length}`)
    console.log(`├─ 💰 Market Requests: ${marketRequests.length}`)
    console.log(`└─ ⭐ Market Reviews: 3`)
    
    console.log('\n🔑 Test Accounts:')
    console.log('├─ Admin: admin@communityforum.com / admin123')
    console.log('├─ User 1: john.doe@example.com / password123')
    console.log('├─ User 2: jane.smith@example.com / password123')
    console.log('├─ User 3: bob.wilson@example.com / password123')
    console.log('├─ User 4: alice.brown@example.com / password123')
    console.log('├─ User 5: charlie.davis@example.com / password123')
    console.log('└─ User 6: emma.johnson@example.com / password123')
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })