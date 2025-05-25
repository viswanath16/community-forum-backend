import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, requireAuth } from '@/lib/auth'
import { successResponse } from '@/lib/utils/responses'
import { handleApiError } from '@/lib/utils/error-handler'

/**
 * @swagger
 * /api/marketplace/requests:
 *   get:
 *     summary: Get all requests made by current user
 *     tags: [Marketplace]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved requests
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

        // Get all requests made by the current user
        const requests = await prisma.marketRequest.findMany({
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
            orderBy: { createdAt: 'desc' }
        })

        return successResponse(requests, 'Requests retrieved successfully')

    } catch (error) {
        return handleApiError(error)
    }
}