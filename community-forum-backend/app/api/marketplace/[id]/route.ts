// app/api/marketplace/[id]/route.ts

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, requireAuth } from '@/lib/auth'
import { validateUpdateMarketListing } from '@/lib/validations/marketplace'
import { successResponse, errorResponse } from '@/lib/utils/responses'
import { handleApiError } from '@/lib/utils/error-handler'

/**
 * @swagger
 * /api/marketplace/{id}:
 *   get:
 *     summary: Get a specific listing by ID
 *     tags: [Marketplace]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Listing ID
 *     responses:
 *       200:
 *         description: Successfully retrieved listing
 *       404:
 *         description: Listing not found
 *       500:
 *         description: Server error
 */
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params

        const listing = await prisma.marketListing.findUnique({
            where: { id },
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
                },
                tags: {
                    include: {
                        tag: true
                    }
                },
                requests: {
                    include: {
                        buyer: {
                            select: {
                                id: true,
                                username: true,
                                fullName: true,
                                avatarUrl: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                },
                reviews: {
                    include: {
                        buyer: {
                            select: {
                                id: true,
                                username: true,
                                fullName: true
                            }
                        },
                        seller: {
                            select: {
                                id: true,
                                username: true,
                                fullName: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                },
                _count: {
                    select: {
                        requests: true,
                        reviews: true
                    }
                }
            }
        })

        if (!listing) {
            return errorResponse('Listing not found', 404)
        }

        // Increment view count
        await prisma.marketListing.update({
            where: { id },
            data: { views: { increment: 1 } }
        })

        return successResponse(listing)

    } catch (error) {
        return handleApiError(error)
    }
}

/**
 * @swagger
 * /api/marketplace/{id}:
 *   put:
 *     summary: Update a listing
 *     tags: [Marketplace]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Listing ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Listing title
 *               description:
 *                 type: string
 *                 description: Listing description
 *               price:
 *                 type: number
 *                 description: Price
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
 *       200:
 *         description: Listing updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the seller or admin
 *       404:
 *         description: Listing not found
 *       500:
 *         description: Server error
 */
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const authUser = await getAuthUser(request)
        requireAuth(authUser)

        const user = authUser!
        const { id } = await context.params

        const body = await request.json()
        const validation = validateUpdateMarketListing(body)

        if (!validation.isValid) {
            return errorResponse(`Validation error: ${validation.errors.join(', ')}`, 400)
        }

        const validatedData = validation.data!

        // Check if listing exists and user has permission
        const existingListing = await prisma.marketListing.findUnique({
            where: { id }
        })

        if (!existingListing) {
            return errorResponse('Listing not found', 404)
        }

        if (existingListing.sellerId !== user.id && !user.isAdmin) {
            return errorResponse('Forbidden - Not the seller or admin', 403)
        }

        // Soft delete by updating status to CLOSED
        await prisma.marketListing.update({
            where: { id },
            data: { status: 'CLOSED' }
        })

        return successResponse(null, 'Listing deleted successfully')

    } catch (error) {
        return handleApiError(error)
    }
}Listing) {
    return errorResponse('Listing not found', 404)
}

if (existingListing.sellerId !== user.id && !user.isAdmin) {
    return errorResponse('Forbidden - Not the seller or admin', 403)
}

// Verify category exists if being updated
if (validatedData.categoryId) {
    const category = await prisma.category.findUnique({
        where: { id: validatedData.categoryId, isActive: true }
    })

    if (!category) {
        return errorResponse('Category not found or inactive', 404)
    }
}

// Verify neighborhood exists if being updated
if (validatedData.neighborhoodId) {
    const neighborhood = await prisma.neighborhood.findUnique({
        where: { id: validatedData.neighborhoodId }
    })

    if (!neighborhood) {
        return errorResponse('Neighborhood not found', 404)
    }
}

// Update listing in transaction
const updatedListing = await prisma.$transaction(async (tx) => {
    // Update the listing
    const updateData: any = {}
    if (validatedData.title !== undefined) updateData.title = validatedData.title
    if (validatedData.description !== undefined) updateData.description = validatedData.description
    if (validatedData.price !== undefined) updateData.price = validatedData.price
    if (validatedData.isFree !== undefined) updateData.isFree = validatedData.isFree
    if (validatedData.condition !== undefined) updateData.condition = validatedData.condition
    if (validatedData.images !== undefined) updateData.images = validatedData.images
    if (validatedData.categoryId !== undefined) updateData.categoryId = validatedData.categoryId
    if (validatedData.neighborhoodId !== undefined) updateData.neighborhoodId = validatedData.neighborhoodId

    const updated = await tx.marketListing.update({
        where: { id },
        data: updateData,
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

    // Update tags if provided
    if (validatedData.tagIds !== undefined) {
        // Delete existing tags
        await tx.marketListingTag.deleteMany({
            where: { listingId: id }
        })

        // Add new tags
        if (validatedData.tagIds.length > 0) {
            await tx.marketListingTag.createMany({
                data: validatedData.tagIds.map(tagId => ({
                    listingId: id,
                    tagId
                })),
                skipDuplicates: true
            })
        }
    }

    return updated
})

return successResponse(updatedListing, 'Listing updated successfully')

} catch (error) {
    return handleApiError(error)
}
}

/**
 * @swagger
 * /api/marketplace/{id}:
 *   delete:
 *     summary: Delete a listing
 *     tags: [Marketplace]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Listing ID
 *     responses:
 *       200:
 *         description: Listing deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the seller or admin
 *       404:
 *         description: Listing not found
 *       500:
 *         description: Server error
 */
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const authUser = await getAuthUser(request)
        requireAuth(authUser)

        const user = authUser!
        const { id } = await context.params

        // Check if listing exists and user has permission
        const existingListing = await prisma.marketListing.findUnique({
            where: { id }
        })

        if (!existing