// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log(`Start seeding ...`);

    // Clean up existing data (if needed)
    await prisma.eventAttendee.deleteMany();
    await prisma.event.deleteMany();
    await prisma.marketRequest.deleteMany();
    await prisma.marketListing.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.category.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
    await prisma.neighborhood.deleteMany();
    await prisma.interest.deleteMany();

    // Create admin user
    const adminUser = await prisma.user.create({
        data: {
            email: 'admin@example.com',
            role: 'ADMIN',
            profile: {
                create: {
                    displayName: 'Admin User',
                    firstName: 'Admin',
                    lastName: 'User',
                    bio: 'System administrator',
                },
            },
        },
    });

    console.log(`Created admin user: ${adminUser.email}`);

    // Create neighborhoods
    const neighborhoods = await Promise.all([
        prisma.neighborhood.create({
            data: {
                name: 'Amsterdam Centrum',
                city: 'Amsterdam',
                description: 'The historic center of Amsterdam',
                postalCodes: ['1011', '1012', '1013', '1015', '1016', '1017'],
            },
        }),
        prisma.neighborhood.create({
            data: {
                name: 'Amsterdam Zuid',
                city: 'Amsterdam',
                description: 'The southern district of Amsterdam',
                postalCodes: ['1071', '1072', '1073', '1074', '1075'],
            },
        }),
        prisma.neighborhood.create({
            data: {
                name: 'Utrecht Centrum',
                city: 'Utrecht',
                description: 'The historic center of Utrecht',
                postalCodes: ['3511', '3512', '3513', '3514'],
            },
        }),
    ]);

    console.log(`Created ${neighborhoods.length} neighborhoods`);

    // Create interests
    const interests = await Promise.all([
        prisma.interest.create({ data: { name: 'Sports' } }),
        prisma.interest.create({ data: { name: 'Music' } }),
        prisma.interest.create({ data: { name: 'Art' } }),
        prisma.interest.create({ data: { name: 'Technology' } }),
        prisma.interest.create({ data: { name: 'Food' } }),
        prisma.interest.create({ data: { name: 'Environment' } }),
        prisma.interest.create({ data: { name: 'Education' } }),
    ]);

    console.log(`Created ${interests.length} interests`);

    // Create categories
    const eventCategories = await Promise.all([
        prisma.category.create({
            data: {
                name: 'Workshop',
                type: 'EVENT',
                description: 'Interactive learning sessions',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Community Meeting',
                type: 'EVENT',
                description: 'Formal or informal community gatherings',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Cultural',
                type: 'EVENT',
                description: 'Cultural events and celebrations',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Sports',
                type: 'EVENT',
                description: 'Sports and recreational activities',
            },
        }),
    ]);

    const marketCategories = await Promise.all([
        prisma.category.create({
            data: {
                name: 'Furniture',
                type: 'MARKET',
                description: 'Home furniture and decor',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Electronics',
                type: 'MARKET',
                description: 'Electronic devices and accessories',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Clothing',
                type: 'MARKET',
                description: 'Clothing, shoes, and accessories',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Services',
                type: 'MARKET',
                description: 'Professional and personal services',
            },
        }),
    ]);

    const postCategories = await Promise.all([
        prisma.category.create({
            data: {
                name: 'Question',
                type: 'POST',
                description: 'Questions for the community',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Announcement',
                type: 'POST',
                description: 'Community announcements',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Discussion',
                type: 'POST',
                description: 'General discussions on community topics',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Lost & Found',
                type: 'POST',
                description: 'Lost and found items',
            },
        }),
    ]);

    console.log(`Created ${eventCategories.length + marketCategories.length + postCategories.length} categories`);

    // Create demo users
    const users = await Promise.all(
        Array.from({ length: 5 }).map(async (_, i) => {
            return prisma.user.create({
                data: {
                    email: `user${i + 1}@example.com`,
                    role: 'USER',
                    profile: {
                        create: {
                            displayName: `User ${i + 1}`,
                            firstName: `First${i + 1}`,
                            lastName: `Last${i + 1}`,
                            bio: `This is a demo user ${i + 1}`,
                            neighborhood: neighborhoods[i % neighborhoods.length].name,
                            interests: {
                                connect: [
                                    { id: interests[i % interests.length].id },
                                    { id: interests[(i + 1) % interests.length].id },
                                ],
                            },
                        },
                    },
                },
            });
        })
    );

    console.log(`Created ${users.length} demo users`);

    // Create sample events
    const events = await Promise.all([
        prisma.event.create({
            data: {
                title: 'Community Cleanup Day',
                description: 'Join us for a day of cleaning up our neighborhood parks and streets.',
                startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours duration
                location: 'Central Park',
                address: 'Park Street 1, Amsterdam',
                isOnline: false,
                capacity: 20,
                isFree: true,
                isPublished: true,
                creatorId: adminUser.id,
                categoryId: eventCategories.find(c => c.name === 'Community Meeting')?.id || eventCategories[0].id,
                neighborhoodId: neighborhoods[0].id,
                interests: {
                    connect: [{ id: interests.find(i => i.name === 'Environment')?.id || interests[0].id }],
                },
            },
        }),
        prisma.event.create({
            data: {
                title: 'Tech Workshop: Introduction to Coding',
                description: 'Learn the basics of programming in this beginner-friendly workshop.',
                startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
                endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours duration
                isOnline: true,
                meetingUrl: 'https://example.com/meeting',
                capacity: 15,
                isFree: false,
                price: 5.00,
                isPublished: true,
                creatorId: adminUser.id,
                categoryId: eventCategories.find(c => c.name === 'Workshop')?.id || eventCategories[0].id,
                interests: {
                    connect: [{ id: interests.find(i => i.name === 'Technology')?.id || interests[0].id }],
                },
            },
        }),
    ]);

    console.log(`Created ${events.length} demo events`);

    // Register some users for events
    await Promise.all(
        users.flatMap(user =>
            events.map(event =>
                prisma.eventAttendee.create({
                    data: {
                        eventId: event.id,
                        userId: user.id,
                        status: 'REGISTERED',
                    },
                })
            )
        )
    );

    console.log(`Registered users for events`);

    // Create marketplace listings
    const listings = await Promise.all([
        prisma.marketListing.create({
            data: {
                title: 'Vintage Desk Chair',
                description: 'Comfortable vintage desk chair in great condition',
                price: 40.00,
                isFree: false,
                condition: 'GOOD',
                images: ['https://example.com/chair.jpg'],
                status: 'ACTIVE',
                sellerId: users[0].id,
                categoryId: marketCategories.find(c => c.name === 'Furniture')?.id || marketCategories[0].id,
            },
        }),
        prisma.marketListing.create({
            data: {
                title: 'iPhone Charger',
                description: 'Original iPhone charger, barely used',
                price: 15.00,
                isFree: false,
                condition: 'LIKE_NEW',
                images: ['https://example.com/charger.jpg'],
                status: 'ACTIVE',
                sellerId: users[1].id,
                categoryId: marketCategories.find(c => c.name === 'Electronics')?.id || marketCategories[0].id,
            },
        }),
        prisma.marketListing.create({
            data: {
                title: 'Free Books',
                description: 'A collection of novels and non-fiction books, free to a good home',
                isFree: true,
                condition: 'USED',
                images: ['https://example.com/books.jpg'],
                status: 'ACTIVE',
                sellerId: users[2].id,
                categoryId: marketCategories.find(c => c.name === 'Services')?.id || marketCategories[0].id,
            },
        }),
    ]);

    console.log(`Created ${listings.length} marketplace listings`);

    // Create posts
    const posts = await Promise.all([
        prisma.post.create({
            data: {
                title: 'New Community Garden Proposal',
                content: 'I would like to propose creating a community garden in the empty lot on Main Street. What does everyone think?',
                authorId: users[0].id,
                categoryId: postCategories.find(c => c.name === 'Discussion')?.id || postCategories[0].id,
                status: 'PUBLISHED',
            },
        }),
        prisma.post.create({
            data: {
                title: 'Lost Cat - Orange Tabby',
                content: 'My cat Whiskers has gone missing. He\'s an orange tabby with a white spot on his chest. Last seen near Central Park. Please contact me if you see him!',
                authorId: users[1].id,
                categoryId: postCategories.find(c => c.name === 'Lost & Found')?.id || postCategories[0].id,
                status: 'PUBLISHED',
                isPinned: true,
            },
        }),
        prisma.post.create({
            data: {
                title: 'Upcoming Street Festival',
                content: 'The annual street festival will be held on the first weekend of next month. There will be live music, food stalls, and activities for children.',
                authorId: adminUser.id,
                categoryId: postCategories.find(c => c.name === 'Announcement')?.id || postCategories[0].id,
                status: 'PUBLISHED',
            },
        }),
    ]);

    console.log(`Created ${posts.length} posts`);

    // Add comments to posts
    await Promise.all([
        prisma.comment.create({
            data: {
                content: 'Great idea! I would love to help with this.',
                authorId: users[1].id,
                postId: posts[0].id,
            },
        }),
        prisma.comment.create({
            data: {
                content: 'I\'ve seen a cat matching that description near the playground. I\'ll send you a message.',
                authorId: users[2].id,
                postId: posts[1].id,
            },
        }),
        prisma.comment.create({
            data: {
                content: 'Will there be parking available nearby?',
                authorId: users[3].id,
                postId: posts[2].id,
            },
        }),
        prisma.comment.create({
            data: {
                content: 'Yes, the municipal parking lot will be open and free during the festival hours.',
                authorId: adminUser.id,
                postId: posts[2].id,
            },
        }),
    ]);

    console.log(`Added comments to posts`);

    console.log(`Seeding finished.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });