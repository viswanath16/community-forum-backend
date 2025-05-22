import { PrismaClient, EventCategory } from '@prisma/client'
import { hashPassword } from '../lib/auth'

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
        await prisma.event.create({
            data: eventData
        })
    }

    console.log('✅ Events created')

    // Create some event registrations
    await prisma.eventRegistration.createMany({
        data: [
            {
                eventId: (await prisma.event.findFirst({ where: { title: 'Community Yoga in the Park' } }))!.id,
                userId: users[0].id,
                status: 'REGISTERED'
            },
            {
                eventId: (await prisma.event.findFirst({ where: { title: 'Tech Meetup: AI & Machine Learning' } }))!.id,
                userId: users[1].id,
                status: 'REGISTERED'
            },
            {
                eventId: (await prisma.event.findFirst({ where: { title: 'Neighborhood Cleanup Day' } }))!.id,
                userId: users[2].id,
                status: 'REGISTERED'
            }
        ]
    })

    console.log('✅ Event registrations created')
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