import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, requireAuth } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/utils/responses'
import { handleApiError } from '@/lib/utils/error-handler'

/**
 * @swagger
 * /api/marketplace/{id}/requests:
 *   get:
 *     summary: Get all requests for a listing
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
 *         description: Successfully retrieved requests
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the seller or admin
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
        const authUser = await getAuthUser(request)
        requireAuth(authUser)

        const user = authUser!
        const { id } = await context.params

        // Check if listing exists and user has permission to view requests
        const listing = await prisma.marketListing.findUnique({
            where: { id },
            select: {
                id: true,
                sellerId: true,
                title: true
            }
        })

        if (!listing) {
            return errorResponse('Listing not found', 404)
        }

        if (listing.sellerId !== user.id && !user.isAdmin) {
            return errorResponse('Forbidden - Not the seller or admin', 403)
        }

        // Get all requests for this listing
        const requests = await prisma.marketRequest.findMany({
            where: { listingId: id },
            include: {
                buyer: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                        avatarUrl: true,
                        reputationScore: true
                    }
                },
                listing: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        isFree: true,
                        status: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return successResponse(requests, 'Requests retrieved successfully')

    } catch (error) {
        return handleApiError(error)
    }
}