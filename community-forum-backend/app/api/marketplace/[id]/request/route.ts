// app/api/marketplace/[id]/request/route.ts

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, requireAuth } from '@/lib/auth'
import { validateCreateMarketRequest } from '@/lib/validations/marketplace'
import { successResponse, errorResponse } from '@/lib/utils/responses'
import { handleApiError } from '@/lib/utils/error-handler'

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const authUser = await getAuthUser(request)
        requireAuth(authUser)

        const user = authUser!
        const { id } = await context.params

        const body = await request.json().catch(() => ({}))
        const validation = validateCreateMarketRequest(body)

        if (!validation.isValid) {
            return errorResponse(`Validation error: ${validation.errors.join(', ')}`, 400)
        }

        const validatedData = validation.data!

        // Check if listing exists and is active
        const listing = await prisma.marketListing.findUnique({
            where: { id },
            include: {
                seller: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true
                    }
                }
            }
        })

        if (!listing) {
            return errorResponse('Listing not found', 404)
        }

        if (listing.status !== 'ACTIVE') {
            return errorResponse('Listing is not available for requests', 400)
        }

        // Check if user is trying to request their own listing
        if (listing.sellerId === user.id) {
            return errorResponse('Cannot request your own listing', 400)
        }

        // Check if user already has a pending request
        const existingRequest = await prisma.marketRequest.findUnique({
            where: {
                listingId_buyerId: {
                    listingId: id,
                    buyerId: user.id
                }
            }
        })

        if (existingRequest) {
            return errorResponse('You already have a request for this listing', 400)
        }

        // Create the request
        const newRequest = await prisma.marketRequest.create({
            data: {
                listingId: id,
                buyerId: user.id,
                message: validatedData.message
            },
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

        return successResponse(newRequest, 'Request created successfully', 201)

    } catch (error) {
        return handleApiError(error)
    }
}