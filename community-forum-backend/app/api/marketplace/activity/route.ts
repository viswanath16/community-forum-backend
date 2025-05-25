import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, requireAuth } from '@/lib/auth'
import { successResponse } from '@/lib/utils/responses'
import { handleApiError } from '@/lib/utils/error-handler'

/**
 * @swagger
 * /api/marketplace/activity:
 *   get:
 *     summary: Get current user's marketplace activity
 *     tags: [Marketplace]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved activity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User marketplace activity retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     listings:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/MarketListing'
 *                     buyRequests:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/MarketRequest'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export async function GET(request: NextRequest) {
    try {
        const authUser = await getAuthUser(request)
        requireAuth(authUser)

        const user = authUser!

        // Get user's listings and buy requests in parallel
        const [listings, buyRequests] = await Promise.all([
            // User's listings
            prisma.marketListing.findMany({
                where: { sellerId: user.id },
                include: {
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
                orderBy: { createdAt: 'desc' },
                take: 20
            }),

            // User's buy requests
            prisma.marketRequest.findMany({
                where: { buyerId: user.id },
                include: {
                    listing: {
                        select: {
                            id: true,
                            title: true,
                            price: true,
                            isFree: true,
                            status: true,
                            images: true,
                            seller: {
                                select: {
                                    id: true,
                                    username: true,
                                    fullName: true,
                                    avatarUrl: true
                                }
                            }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                take: 20
            })
        ])

        const activity = {
            listings,
            buyRequests
        }

        return successResponse(activity, 'User marketplace activity retrieved successfully')

    } catch (error) {
        return handleApiError(error)
    }
}