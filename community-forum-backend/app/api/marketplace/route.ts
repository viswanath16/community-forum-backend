// app/api/marketplace/route.ts

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, requireAuth } from '@/lib/auth'
import {
    validateCreateMarketListing,
    parseMarketplaceSearch
} from '@/lib/validations/marketplace'
import { successResponse, paginatedResponse, errorResponse } from '@/lib/utils/responses'
import { handleApiError } from '@/lib/utils/error-handler'

/**
 * @swagger
 * /api/marketplace:
 *   get:
 *     summary: Get marketplace listings
 *     tags: [Marketplace]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: isFree
 *         schema:
 *           type: boolean
 *         description: Filter by free items only
 *       - in: query
 *         name: condition
 *         schema:
 *           type: string
 *           enum: [NEW, LIKE_NEW, GOOD, USED, WORN]
 *         description: Filter by item condition
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, RESERVED, SOLD, CLOSED]
 *           default: ACTIVE
 *         description: Filter by listing status
 *       - in: query
 *         name: sellerId
 *         schema:
 *           type: string
 *         description: Filter by seller ID
 *       - in: query
 *         name: neighborhoodId
 *         schema:
 *           type: string
 *         description: Filter by neighborhood ID
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, price, title, views]
 *           default: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Successfully retrieved listings
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const params = parseMarketplaceSearch(searchParams)

        const skip = (params.page! - 1) * params.limit!

        // Build where clause
        const where: any = {
            status: params.status
        }

        if (params.categoryId) {
            where.categoryId = params.categoryId
        }

        if (params.isFree !== undefined) {
            where.isFree = params.isFree
        }

        if (params.condition) {
            where.condition = params.condition
        }

        if (params.sellerId) {
            where.sellerId = params.sellerId
        }

        if (params.neighborhoodId) {
            where.neighborhoodId = params.neighborhoodId
        }

        if (params.minPrice !== undefined || params.maxPrice !== undefined) {
            where.price = {}
            if (params.minPrice !== undefined) {
                where.price.gte = params.minPrice
            }
            if (params.maxPrice !== undefined) {
                where.price.lte = params.maxPrice
            }
        }

        if (params.q) {
            where.OR = [
                { title: { contains: params.q, mode: 'insensitive' } },
                { description: { contains: params.q, mode: 'insensitive' } }
            ]
        }

        // Build order by clause
        const orderBy: any = {}
        orderBy[params.sortBy!] = params.sortOrder

        const [listings, total] = await Promise.all([
            prisma.marketListing.findMany({
                where,
                include: {
                    seller: {
                        select: {
                            id: true,
                            username: true,
                            fullName: true,
                            avatarUrl: true,
                            reputationScore: true
                        }
                    },
                    category: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    neighborhood: {
                        select: {
                            id: true,
                            name: true,
                            city: true
                        }
                    },
                    _count: {
                        select: {
                            requests: true
                        }
                    }
                },
                orderBy,
                skip,
                take: params.limit
            }),
            prisma.marketListing.count({ where })
        ])

        return paginatedResponse(listings, {
            page: params.page!,
            limit: params.limit!,
            total
        })

    } catch (error) {
        return handleApiError(error)
    }
}

/**
 * @swagger
 * /api/marketplace:
 *   post:
 *     summary: Create a new listing
 *     tags: [Marketplace]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - isFree
 *               - images
 *               - categoryId
 *             properties:
 *               title:
 *                 type: string
 *                 description: Listing title
 *               description:
 *                 type: string
 *                 description: Listing description
 *               price:
 *                 type: number
 *                 description: Price (required if isFree is false)
 *               isFree:
 *                 type: boolean
 *                 description: Whether the item is free
 *               condition:
 *                 type: string
 *                 enum: [NEW, LIKE_NEW, GOOD, USED, WORN]
 *                 description: Item condition
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of image URLs
 *               categoryId:
 *                 type: string
 *                 description: Category ID
 *               neighborhoodId:
 *                 type: string
 *                 description: Neighborhood ID
 *               tagIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of tag IDs
 *     responses:
 *       201:
 *         description: Listing created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export async function POST(request: NextRequest) {
    try {
        const authUser = await getAuthUser(request)
        requireAuth(authUser)

        const user = authUser!

        const body = await request.json()
        const validation = validateCreateMarketListing(body)

        if (!validation.isValid) {
            return errorResponse(`Validation error: ${validation.errors.join(', ')}`, 400)
        }

        const validatedData = validation.data!

        // Verify category exists
        const category = await prisma.category.findUnique({
            where: { id: validatedData.categoryId, isActive: true }
        })

        if (!category) {
            return errorResponse('Category not found or inactive', 404)
        }

        // Verify neighborhood exists if provided
        if (validatedData.neighborhoodId) {
            const neighborhood = await prisma.neighborhood.findUnique({
                where: { id: validatedData.neighborhoodId }
            })

            if (!neighborhood) {
                return errorResponse('Neighborhood not found', 404)
            }
        }

        // Create listing in transaction
        const listing = await prisma.$transaction(async (tx) => {
            // Create the listing
            const newListing = await tx.marketListing.create({
                data: {
                    title: validatedData.title,
                    description: validatedData.description,
                    price: validatedData.price,
                    isFree: validatedData.isFree,
                    condition: validatedData.condition,
                    images: validatedData.images,
                    sellerId: user.id,
                    categoryId: validatedData.categoryId,
                    neighborhoodId: validatedData.neighborhoodId
                },
                include: {
                    seller: {
                        select: {
                            id: true,
                            username: true,
                            fullName: true,
                            avatarUrl: true,
                            reputationScore: true
                        }
                    },
                    category: {
                        select: {
                            id: true,
                            name: true,
                            description: true
                        }
                    },
                    neighborhood: {
                        select: {
                            id: true,
                            name: true,
                            city: true,
                            postalCode: true
                        }
                    }
                }
            })

            // Add tags if provided
            if (validatedData.tagIds && validatedData.tagIds.length > 0) {
                await tx.marketListingTag.createMany({
                    data: validatedData.tagIds.map(tagId => ({
                        listingId: newListing.id,
                        tagId
                    })),
                    skipDuplicates: true
                })
            }

            return newListing
        })

        return successResponse(listing, 'Listing created successfully', 201)

    } catch (error) {
        return handleApiError(error)
    }
}