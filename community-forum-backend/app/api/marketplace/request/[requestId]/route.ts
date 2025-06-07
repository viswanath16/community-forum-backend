import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, requireAuth } from '@/lib/auth'
import { validateUpdateRequestStatus } from '@/lib/validations/marketplace'
import { successResponse, errorResponse } from '@/lib/utils/responses'
import { handleApiError } from '@/lib/utils/error-handler'

/**
 * @swagger
 * /api/marketplace/{id}/request/{requestId}:
 *   put:
 *     summary: Update request status (accept/reject)
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
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: Request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACCEPTED, REJECTED, COMPLETED]
 *                 description: New request status
 *     responses:
 *       200:
 *         description: Request status updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the seller
 *       404:
 *         description: Listing or request not found
 *       500:
 *         description: Server error
 */
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string; requestId: string }> }
) {
    try {
        const authUser = await getAuthUser(request)
        requireAuth(authUser)

        const user = authUser!
        const { id, requestId } = await context.params

        const body = await request.json()
        const validation = validateUpdateRequestStatus(body)
        if (!validation.isValid) {
            return errorResponse(`Validation error: ${validation.errors.join(', ')}`, 400)
        }
        const validatedData = validation.data!

        // Check if request exists and belongs to the listing
        const marketRequest = await prisma.marketRequest.findUnique({
            where: { id: requestId },
            include: {
                listing: {
                    select: {
                        id: true,
                        sellerId: true,
                        title: true,
                        status: true
                    }
                },
                buyer: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                        avatarUrl: true
                    }
                }
            }
        })

        if (!marketRequest) {
            return errorResponse('Request not found', 404)
        }

        if (marketRequest.listingId !== id) {
            return errorResponse('Request does not belong to this listing', 400)
        }

        // Check if user is the seller
        if (marketRequest.listing.sellerId !== user.id) {
            return errorResponse('Forbidden - Not the seller', 403)
        }

        // Update request status
        const updatedRequest = await prisma.$transaction(async (tx) => {
            const updated = await tx.marketRequest.update({
                where: { id: requestId },
                data: { status: validatedData.status },
                include: {
                    listing: {
                        select: {
                            id: true,
                            title: true,
                            price: true,
                            isFree: true,
                            status: true,
                            images: true
                        }
                    },
                    buyer: {
                        select: {
                            id: true,
                            username: true,
                            fullName: true,
                            avatarUrl: true
                        }
                    }
                }
            })

            // If request is accepted, optionally mark listing as reserved
            if (validatedData.status === 'ACCEPTED') {
                await tx.marketListing.update({
                    where: { id },
                    data: { status: 'RESERVED' }
                })
            }

            // If request is completed, mark listing as sold
            if (validatedData.status === 'COMPLETED') {
                await tx.marketListing.update({
                    where: { id },
                    data: { status: 'SOLD' }
                })
            }

            return updated
        })

        // Generate appropriate message based on status
        let message = 'Request status updated successfully'
        switch (validatedData.status) {
            case 'ACCEPTED':
                message = 'Request accepted successfully'
                break
            case 'REJECTED':
                message = 'Request rejected successfully'
                break
            case 'COMPLETED':
                message = 'Request completed successfully'
                break
        }

        return successResponse(updatedRequest, message)

    } catch (error) {
        return handleApiError(error)
    }
}