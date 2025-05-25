// app/api/marketplace/[id]/status/route.ts

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, requireAuth } from '@/lib/auth'
import { validateUpdateListingStatus } from '@/lib/validations/marketplace'
import { successResponse, errorResponse } from '@/lib/utils/responses'
import { handleApiError } from '@/lib/utils/error-handler'

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
        const validation = validateUpdateListingStatus(body)

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

        // Update listing status
        const updatedListing = await prisma.marketListing.update({
            where: { id },
            data: { status: validatedData.status },
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

        // Generate appropriate message based on status
        let message = 'Listing status updated successfully'
        switch (validatedData.status) {
            case 'SOLD':
                message = 'Listing marked as sold successfully'
                break
            case 'RESERVED':
                message = 'Listing marked as reserved successfully'
                break
            case 'ACTIVE':
                message = 'Listing reactivated successfully'
                break
            case 'CLOSED':
                message = 'Listing closed successfully'
                break
        }

        return successResponse(updatedListing, message)

    } catch (error) {
        return handleApiError(error)
    }
}