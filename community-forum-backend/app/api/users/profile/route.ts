import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, requireAuth } from '@/lib/auth'
import { successResponse } from '@/lib/utils/responses'
import { handleApiError } from '@/lib/utils/error-handler'

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     tags: [Users]
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile information
 *       401:
 *         description: Authentication required
 */
export async function GET(request: NextRequest) {
    try {
        const user = await getAuthUser(request)
        requireAuth(user)

        const userProfile = await prisma.user.findUnique({
            where: { id: user.id },
            include: {
                neighborhood: {
                    select: {
                        id: true,
                        name: true,
                        city: true,
                        postalCode: true
                    }
                },
                eventRegistrations: {
                    include: {
                        event: {
                            select: {
                                id: true,
                                title: true,
                                startDate: true,
                                category: true
                            }
                        }
                    },
                    orderBy: { registeredAt: 'desc' },
                    take: 10
                },
                events: {
                    select: {
                        id: true,
                        title: true,
                        startDate: true,
                        category: true,
                        status: true
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10
                }
            }
        })

        return successResponse(userProfile)

    } catch (error) {
        return handleApiError(error)
    }
}