import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, requireAuth } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/utils/responses'
import { handleApiError } from '@/lib/utils/error-handler'

/**
 * @swagger
 * /api/marketplace/request/{requestId}/cancel:
 *   delete:
 *     summary: Cancel a request (buyer only)
 *     tags: [Marketplace]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: Request ID
 *     responses:
 *       200:
 *         description: Request canceled successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the buyer
 *       404:
 *         description: Request not found
 *       500:
 *         description: Server error
 */
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ requestId: string }> }
) {
    try {
        const authUser = await getAuthUser(request)
        requireAuth(authUser)

        const user = authUser!
        const { requestId } = await context.params

        // Check if request exists and user is the buyer
        const marketRequest = await prisma.marketRequest.findUnique({
            where: { id: requestId },
            include: {
                listing: {
                    select: {
                        id: true,
                        title: true,
                        status: true
                    }
                }
            }
        })

        if (!marketRequest) {
            return errorResponse('Request not found', 404)
        }

        if (marketRequest.buyerId !== user.id) {
            return errorResponse('Forbidden - Not the buyer', 403)
        }

        // Check if request can be cancelled (only pending requests)
        if (marketRequest.status !== 'PENDING') {
            return errorResponse('Cannot cancel a request that has already been processed', 400)
        }

        // Delete the request
        await prisma.marketRequest.delete({
            where: { id: requestId }
        })

        return successResponse(null, 'Request canceled successfully')

    } catch (error) {
        return handleApiError(error)
    }
}