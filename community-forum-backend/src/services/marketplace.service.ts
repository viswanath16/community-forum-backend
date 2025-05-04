// src/services/marketplace.service.ts
import { Prisma } from '@prisma/client';
import prisma from '../prisma/client';

export interface MarketListingFilters {
    categoryId?: string;
    sellerId?: string;
    status?: 'ACTIVE' | 'RESERVED' | 'SOLD' | 'CLOSED';
    isFree?: boolean;
    condition?: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'USED' | 'WORN';
    neighborhoodId?: string;
    query?: string;
}

export interface CreateMarketListingInput {
    title: string;
    description: string;
    price?: number;
    isFree: boolean;
    condition?: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'USED' | 'WORN';
    images: string[];
    categoryId: string;
    neighborhoodId?: string;
    tagIds?: string[];
}

export interface SearchParams {
    query?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    condition?: string;
    neighborhoodId?: string;
}

/**
 * Get all marketplace listings with optional filters
 */
export const getListings = async (filters: MarketListingFilters = {}) => {
    const where: Prisma.MarketListingWhereInput = {};

    // Apply filters
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.sellerId) where.sellerId = filters.sellerId;
    if (filters.status) where.status = filters.status;
    if (filters.isFree !== undefined) where.isFree = filters.isFree;
    if (filters.condition) where.condition = filters.condition;
    if (filters.neighborhoodId) where.neighborhoodId = filters.neighborhoodId;

    // Full text search if query provided
    if (filters.query) {
        where.OR = [
            { title: { contains: filters.query, mode: 'insensitive' } },
            { description: { contains: filters.query, mode: 'insensitive' } },
        ];
    }

    const listings = await prisma.marketListing.findMany({
        where,
        include: {
            seller: {
                select: {
                    id: true,
                    email: true,
                    profile: {
                        select: {
                            displayName: true,
                            avatar: true,
                            neighborhood: true,
                        },
                    },
                },
            },
            category: true,
            tags: true,
            _count: {
                select: {
                    requests: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return listings;
};

/**
 * Get a specific marketplace listing by ID
 */
export const getListingById = async (id: string) => {
    const listing = await prisma.marketListing.findUnique({
        where: { id },
        include: {
            seller: {
                select: {
                    id: true,
                    email: true,
                    profile: {
                        select: {
                            displayName: true,
                            avatar: true,
                            neighborhood: true,
                            phoneNumber: true,
                        },
                    },
                },
            },
            category: true,
            tags: true,
            requests: {
                where: {
                    status: {
                        in: ['PENDING', 'ACCEPTED'],
                    },
                },
                select: {
                    id: true,
                    status: true,
                    createdAt: true,
                    buyer: {
                        select: {
                            id: true,
                            profile: {
                                select: {
                                    displayName: true,
                                    avatar: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!listing) {
        throw new Error('Listing not found');
    }

    return listing;
};

/**
 * Create a new marketplace listing
 */
export const createListing = async (data: CreateMarketListingInput, sellerId: string) => {
    const { tagIds, ...listingData } = data;

    return prisma.marketListing.create({
        data: {
            ...listingData,
            seller: {
                connect: { id: sellerId },
            },
            ...(tagIds && tagIds.length > 0
                ? {
                    tags: {
                        connect: tagIds.map((id) => ({ id })),
                    },
                }
                : {}),
        },
        include: {
            seller: {
                select: {
                    id: true,
                    email: true,
                    profile: {
                        select: {
                            displayName: true,
                            avatar: true,
                        },
                    },
                },
            },
            category: true,
            tags: true,
        },
    });
};

/**
 * Update an existing marketplace listing
 */
export const updateListing = async (id: string, data: Partial<CreateMarketListingInput>) => {
    const { tagIds, ...listingData } = data;

    return prisma.marketListing.update({
        where: { id },
        data: {
            ...listingData,
            ...(tagIds
                ? {
                    tags: {
                        set: tagIds.map((id) => ({ id })),
                    },
                }
                : {}),
        },
        include: {
            seller: {
                select: {
                    id: true,
                    email: true,
                    profile: {
                        select: {
                            displayName: true,
                            avatar: true,
                        },
                    },
                },
            },
            category: true,
            tags: true,
        },
    });
};

/**
 * Delete a marketplace listing
 */
export const deleteListing = async (id: string) => {
    return prisma.marketListing.delete({
        where: { id },
    });
};

/**
 * Update a listing's status
 */
export const updateListingStatus = async (id: string, status: 'ACTIVE' | 'RESERVED' | 'SOLD' | 'CLOSED') => {
    // Validate status
    const validStatuses = ['ACTIVE', 'RESERVED', 'SOLD', 'CLOSED'];
    if (!validStatuses.includes(status)) {
        throw new Error('Invalid status');
    }

    return prisma.marketListing.update({
        where: { id },
        data: { status },
        include: {
            seller: {
                select: {
                    id: true,
                    email: true,
                    profile: {
                        select: {
                            displayName: true,
                            avatar: true,
                        },
                    },
                },
            },
            category: true,
        },
    });
};

/**
 * Create a request to purchase/reserve an item
 */
export const createRequest = async (listingId: string, buyerId: string, message?: string) => {
    return prisma.marketRequest.create({
        data: {
            listing: {
                connect: { id: listingId },
            },
            buyer: {
                connect: { id: buyerId },
            },
            message,
        },
        include: {
            listing: {
                select: {
                    id: true,
                    title: true,
                    seller: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
            },
            buyer: {
                select: {
                    id: true,
                    profile: {
                        select: {
                            displayName: true,
                            avatar: true,
                        },
                    },
                },
            },
        },
    });
};

/**
 * Get all requests for a listing
 */
export const getRequestsForListing = async (listingId: string) => {
    return prisma.marketRequest.findMany({
        where: {
            listingId,
        },
        include: {
            buyer: {
                select: {
                    id: true,
                    email: true,
                    profile: {
                        select: {
                            displayName: true,
                            avatar: true,
                            phoneNumber: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

/**
 * Get all requests made by a user
 */
export const getUserRequests = async (userId: string) => {
    return prisma.marketRequest.findMany({
        where: {
            buyerId: userId,
        },
        include: {
            listing: {
                select: {
                    id: true,
                    title: true,
                    price: true,
                    isFree: true,
                    images: true,
                    status: true,
                    seller: {
                        select: {
                            id: true,
                            profile: {
                                select: {
                                    displayName: true,
                                },
                            },
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

/**
 * Get a specific request by ID
 */
export const getRequestById = async (id: string) => {
    return prisma.marketRequest.findUnique({
        where: { id },
        include: {
            listing: true,
            buyer: true,
        },
    });
};

/**
 * Update a request status
 */
export const updateRequestStatus = async (id: string, status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED') => {
    // Validate status
    const validStatuses = ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
        throw new Error('Invalid status');
    }

    return prisma.marketRequest.update({
        where: { id },
        data: { status },
        include: {
            listing: {
                select: {
                    id: true,
                    title: true,
                },
            },
            buyer: {
                select: {
                    id: true,
                    profile: {
                        select: {
                            displayName: true,
                        },
                    },
                },
            },
        },
    });
};

/**
 * Delete a request
 */
export const deleteRequest = async (id: string) => {
    return prisma.marketRequest.delete({
        where: { id },
    });
};

/**
 * Get marketplace categories
 */
export const getCategories = async () => {
    return prisma.category.findMany({
        where: {
            type: 'MARKET',
        },
        orderBy: {
            name: 'asc',
        },
    });
};

/**
 * Get a user's marketplace activity (listings and requests)
 */
export const getUserMarketplaceActivity = async (userId: string) => {
    const [listings, buyRequests] = await Promise.all([
        prisma.marketListing.findMany({
            where: {
                sellerId: userId,
            },
            include: {
                category: true,
                _count: {
                    select: {
                        requests: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 5,
        }),
        prisma.marketRequest.findMany({
            where: {
                buyerId: userId,
            },
            include: {
                listing: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        images: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 5,
        }),
    ]);

    return {
        listings,
        buyRequests,
    };
};

/**
 * Search marketplace listings with advanced filters
 */
export const searchListings = async (params: SearchParams) => {
    const { query, categoryId, minPrice, maxPrice, condition, neighborhoodId } = params;

    const where: Prisma.MarketListingWhereInput = {
        status: 'ACTIVE', // Only search active listings
    };

    // Apply text search
    if (query) {
        where.OR = [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
        ];
    }

    // Apply filters
    if (categoryId) where.categoryId = categoryId;
    if (condition) where.condition = condition as any;
    if (neighborhoodId) where.neighborhoodId = neighborhoodId;

    // Apply price range filters
    if (minPrice !== undefined || maxPrice !== undefined) {
        where.AND = [];

        if (minPrice !== undefined) {
            where.AND.push({ price: { gte: minPrice } });
        }

        if (maxPrice !== undefined) {
            where.AND.push({ price: { lte: maxPrice } });
        }
    }

    const listings = await prisma.marketListing.findMany({
        where,
        include: {
            seller: {
                select: {
                    id: true,
                    profile: {
                        select: {
                            displayName: true,
                            avatar: true,
                            neighborhood: true,
                        },
                    },
                },
            },
            category: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return listings;
};

/**
 * Get popular tags
 */
export const getPopularTags = async () => {
    // This requires a raw SQL query for efficient tag counting
    const tags = await prisma.$queryRaw`
    SELECT t.id, t.name, COUNT(ml.id) as count
    FROM tags t
    JOIN "_MarketListingToTag" mlt ON t.id = mlt."B"
    JOIN market_listings ml ON mlt."A" = ml.id
    WHERE ml.status = 'ACTIVE'
    GROUP BY t.id, t.name
    ORDER BY count DESC
    LIMIT 10
  `;

    return tags;
};