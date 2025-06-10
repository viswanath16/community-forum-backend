import { PrismaClient, EventCategory, EventStatus, RegistrationStatus, ItemCondition, ListingStatus, RequestStatus, ReviewType, CommunityPostCategory } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seeding...');
  
  // Clear existing data
  console.log('🧹 Cleaning existing data...');
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
  ]);

  // Create neighborhoods
  console.log('🏘️ Creating neighborhoods...');
  const neighborhoods = await Promise.all([
    prisma.neighborhood.create({
      data: {
        name: 'Green Valley',
        city: 'San Francisco',
        postalCode: '94110',
        description: 'A vibrant community in the heart of San Francisco',
        boundaryCoordinates: {
          type: 'Polygon',
          coordinates: [[[37.7749, -122.4194], [37.7848, -122.4294], [37.7949, -122.4394], [37.8049, -122.4494]]]
        }
      }
    }),
    prisma.neighborhood.create({
      data: {
        name: 'Sunset Heights',
        city: 'San Francisco',
        postalCode: '94122',
        description: 'Peaceful neighborhood with beautiful sunset views',
        boundaryCoordinates: {
          type: 'Polygon',
          coordinates: [[[37.7649, -122.5094], [37.7748, -122.5194], [37.7849, -122.5294], [37.7949, -122.5394]]]
        }
      }
    })
  ]);

  // Create users
  console.log('👥 Creating users...');
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@example.com',
        username: 'admin',
        fullName: 'Admin User',
        avatarUrl: 'https://example.com/avatars/admin.jpg',
        phone: '+1234567890',
        neighborhoodId: neighborhoods[0].id,
        isVerified: true,
        isAdmin: true,
        reputationScore: 100,
        privacySettings: { showEmail: false, showPhone: false },
        notificationPreferences: { email: true, push: true }
      }
    }),
    prisma.user.create({
      data: {
        email: 'john@example.com',
        username: 'john_doe',
        fullName: 'John Doe',
        avatarUrl: 'https://example.com/avatars/john.jpg',
        phone: '+1234567891',
        neighborhoodId: neighborhoods[0].id,
        isVerified: true,
        reputationScore: 50,
        privacySettings: { showEmail: true, showPhone: true },
        notificationPreferences: { email: true, push: false }
      }
    }),
    prisma.user.create({
      data: {
        email: 'jane@example.com',
        username: 'jane_smith',
        fullName: 'Jane Smith',
        avatarUrl: 'https://example.com/avatars/jane.jpg',
        phone: '+1234567892',
        neighborhoodId: neighborhoods[1].id,
        isVerified: true,
        reputationScore: 75,
        privacySettings: { showEmail: false, showPhone: true },
        notificationPreferences: { email: false, push: true }
      }
    })
  ]);

  // Create categories
  console.log('📂 Creating categories...');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Electronics',
        description: 'Electronic devices and accessories',
        isActive: true,
        sortOrder: 1
      }
    }),
    prisma.category.create({
      data: {
        name: 'Furniture',
        description: 'Home and office furniture',
        isActive: true,
        sortOrder: 2
      }
    })
  ]);

  // Create tags
  console.log('🏷️ Creating tags...');
  const tags = await Promise.all([
    prisma.tag.create({
      data: { name: 'new', description: 'New items' }
    }),
    prisma.tag.create({
      data: { name: 'popular', description: 'Popular items' }
    })
  ]);

  // Create events
  console.log('📅 Creating events...');
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: 'Community Cleanup Day',
        description: 'Join us for a day of cleaning up our neighborhood',
        shortDescription: 'Help make our community cleaner',
        category: EventCategory.CLEANUP,
        startDate: new Date('2024-04-01T10:00:00Z'),
        endDate: new Date('2024-04-01T16:00:00Z'),
        location: 'Green Valley Park',
        coordinates: { lat: 37.7749, lng: -122.4194 },
        capacity: 50,
        isFree: true,
        tags: ['community', 'cleanup', 'volunteer'],
        createdBy: users[0].id,
        neighborhoodId: neighborhoods[0].id,
        status: EventStatus.ACTIVE,
        imageUrl: 'https://example.com/events/cleanup.jpg',
        featured: true,
        requiresApproval: false
      }
    }),
    prisma.event.create({
      data: {
        title: 'Tech Workshop',
        description: 'Learn about the latest technology trends',
        shortDescription: 'Tech workshop for beginners',
        category: EventCategory.TECHNOLOGY,
        startDate: new Date('2024-04-15T14:00:00Z'),
        endDate: new Date('2024-04-15T17:00:00Z'),
        location: 'Community Center',
        coordinates: { lat: 37.7849, lng: -122.4294 },
        capacity: 30,
        price: 25.00,
        isFree: false,
        tags: ['technology', 'workshop', 'learning'],
        createdBy: users[1].id,
        neighborhoodId: neighborhoods[1].id,
        status: EventStatus.ACTIVE,
        imageUrl: 'https://example.com/events/tech.jpg',
        featured: false,
        requiresApproval: true
      }
    })
  ]);

  // Create event registrations
  console.log('📝 Creating event registrations...');
  await Promise.all([
    prisma.eventRegistration.create({
      data: {
        eventId: events[0].id,
        userId: users[1].id,
        status: RegistrationStatus.REGISTERED,
        notes: 'Bringing gloves and trash bags',
        emergencyContact: {
          name: 'Emergency Contact',
          phone: '+1234567890',
          relationship: 'Spouse'
        }
      }
    }),
    prisma.eventRegistration.create({
      data: {
        eventId: events[1].id,
        userId: users[2].id,
        status: RegistrationStatus.WAITLIST,
        position: 1
      }
    })
  ]);

  // Create event comments
  console.log('💬 Creating event comments...');
  await Promise.all([
    prisma.eventComment.create({
      data: {
        eventId: events[0].id,
        userId: users[1].id,
        content: 'Looking forward to this event!'
      }
    }),
    prisma.eventComment.create({
      data: {
        eventId: events[1].id,
        userId: users[2].id,
        content: 'Will there be any prerequisites for the workshop?'
      }
    })
  ]);

  // Create event views
  console.log('👀 Creating event views...');
  await Promise.all([
    prisma.eventView.create({
      data: {
        eventId: events[0].id,
        userId: users[1].id,
        viewedAt: new Date()
      }
    }),
    prisma.eventView.create({
      data: {
        eventId: events[1].id,
        userId: users[2].id,
        viewedAt: new Date()
      }
    })
  ]);

  // Create event images
  console.log('🖼️ Creating event images...');
  await Promise.all([
    prisma.eventImage.create({
      data: {
        eventId: events[0].id,
        url: 'https://example.com/events/cleanup1.jpg',
        alt: 'Previous cleanup event',
        isPrimary: true,
        order: 1
      }
    }),
    prisma.eventImage.create({
      data: {
        eventId: events[1].id,
        url: 'https://example.com/events/tech1.jpg',
        alt: 'Workshop setup',
        isPrimary: true,
        order: 1
      }
    })
  ]);

  // Create market listings
  console.log('🛍️ Creating market listings...');
  const marketListings = await Promise.all([
    prisma.marketListing.create({
      data: {
        title: 'iPhone 12 Pro',
        description: 'Excellent condition, comes with original box and accessories',
        price: 699.99,
        condition: ItemCondition.LIKE_NEW,
        status: ListingStatus.ACTIVE,
        sellerId: users[1].id,
        categoryId: categories[0].id,
        neighborhoodId: neighborhoods[0].id,
        images: ['https://example.com/listings/iphone1.jpg', 'https://example.com/listings/iphone2.jpg'],
        isPromoted: true,
        promotedUntil: new Date('2024-04-30')
      }
    }),
    prisma.marketListing.create({
      data: {
        title: 'Office Chair',
        description: 'Ergonomic office chair, barely used',
        price: 150.00,
        condition: ItemCondition.GOOD,
        status: ListingStatus.ACTIVE,
        sellerId: users[2].id,
        categoryId: categories[1].id,
        neighborhoodId: neighborhoods[1].id,
        images: ['https://example.com/listings/chair1.jpg']
      }
    })
  ]);

  // Create market listing tags
  console.log('🏷️ Creating market listing tags...');
  await Promise.all([
    prisma.marketListingTag.create({
      data: {
        listingId: marketListings[0].id,
        tagId: tags[0].id
      }
    }),
    prisma.marketListingTag.create({
      data: {
        listingId: marketListings[1].id,
        tagId: tags[1].id
      }
    })
  ]);

  // Create market requests
  console.log('🛒 Creating market requests...');
  await Promise.all([
    prisma.marketRequest.create({
      data: {
        listingId: marketListings[0].id,
        buyerId: users[2].id,
        status: RequestStatus.PENDING,
        message: 'Is this still available?'
      }
    }),
    prisma.marketRequest.create({
      data: {
        listingId: marketListings[1].id,
        buyerId: users[1].id,
        status: RequestStatus.ACCEPTED,
        message: 'Can I pick it up tomorrow?'
      }
    })
  ]);

  // Create market reviews
  console.log('⭐ Creating market reviews...');
  await Promise.all([
    prisma.marketReview.create({
      data: {
        listingId: marketListings[0].id,
        sellerId: users[1].id,
        buyerId: users[2].id,
        rating: 5,
        comment: 'Great seller, item as described',
        type: ReviewType.SELLER
      }
    }),
    prisma.marketReview.create({
      data: {
        listingId: marketListings[1].id,
        sellerId: users[2].id,
        buyerId: users[1].id,
        rating: 4,
        comment: 'Good buyer, smooth transaction',
        type: ReviewType.BUYER
      }
    })
  ]);

  // Create community posts
  console.log('📝 Creating community posts...');
  const communityPosts = await Promise.all([
    prisma.communityPost.create({
      data: {
        title: 'Lost Dog in Green Valley',
        content: 'Has anyone seen a golden retriever named Max?',
        category: CommunityPostCategory.ISSUE,
        userId: users[1].id
      }
    }),
    prisma.communityPost.create({
      data: {
        title: 'Tutoring Services Available',
        content: 'Offering math and science tutoring for high school students',
        category: CommunityPostCategory.SERVICE,
        userId: users[2].id
      }
    })
  ]);

  // Create community post comments
  console.log('💬 Creating community post comments...');
  await Promise.all([
    prisma.communityPostComment.create({
      data: {
        postId: communityPosts[0].id,
        userId: users[2].id,
        content: 'I think I saw him near the park'
      }
    }),
    prisma.communityPostComment.create({
      data: {
        postId: communityPosts[1].id,
        userId: users[1].id,
        content: 'What are your rates?'
      }
    })
  ]);

  // Create community post attachments
  console.log('📎 Creating community post attachments...');
  await Promise.all([
    prisma.communityPostAttachment.create({
      data: {
        postId: communityPosts[0].id,
        fileUrl: 'https://example.com/attachments/dog1.jpg',
        fileType: 'photo'
      }
    }),
    prisma.communityPostAttachment.create({
      data: {
        postId: communityPosts[1].id,
        fileUrl: 'https://example.com/attachments/resume.pdf',
        fileType: 'document'
      }
    })
  ]);

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 