import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { createEventSchema } from '@/lib/validations/events'
import { successResponse, paginatedResponse, errorResponse } from '@/lib/utils/responses'
import { handleApiError } from '@/lib/utils/error-handler'

/**
 * @swagger
 * /api/events:
 *   get:
 *     tags: [Events]
 *     summary: Get all events
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
 *         name: category
 *         schema:
 *           type: string
 *           enum: [SPORTS, CULTURAL, EDUCATIONAL, VOLUNTEER, SOCIAL, BUSINESS, HEALTH, ENVIRONMENT, TECHNOLOGY, OTHER]
 *       - in: query
 *         name: neighborhoodId
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of events
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        // Parse query parameters manually (no Zod validation)
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))
        const category = searchParams.get('category')
        const neighborhoodId = searchParams.get('neighborhoodId')
        const startDate = searchParams.get('startDate')
        const endDate = searchParams.get('endDate')
        const search = searchParams.get('search')

        const skip = (page - 1) * limit

        // Build where clause conditionally
        const where: any = {
            status: 'ACTIVE'
        }

        if (category) {
            where.category = category
        }

        if (neighborhoodId) {
            where.neighborhoodId = neighborhoodId
        }

        if (startDate) {
            try {
                where.startDate = { gte: new Date(startDate) }
            } catch (e) {
                // Invalid date, ignore
            }
        }

        if (endDate) {
            try {
                if (where.startDate) {
                    where.startDate = { ...where.startDate, lte: new Date(endDate) }
                } else {
                    where.startDate = { lte: new Date(endDate) }
                }
            } catch (e) {
                // Invalid date, ignore
            }
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ]
        }

        const [events, total] = await Promise.all([
            prisma.event.findMany({
                where,
                include: {
                    creator: {
                        select: {
                            id: true,
                            username: true,
                            fullName: true,
                            avatarUrl: true
                        }
                    },
                    neighborhood: {
                        select: {
                            id: true,
                            name: true,
                            city: true
                        }
                    },
                    registrations: {
                        select: {
                            id: true,
                            status: true,
                            user: {
                                select: {
                                    id: true,
                                    username: true
                                }
                            }
                        }
                    },
                    _count: {
                        select: {
                            registrations: true
                        }
                    }
                },
                orderBy: { startDate: 'asc' },
                skip,
                take: limit
            }),
            prisma.event.count({ where })
        ])

        return paginatedResponse(events, {
            page,
            limit,
            total
        })

    } catch (error) {
        return handleApiError(error)
    }
}

/**
 * @swagger
 * /api/events:
 *   post:
 *     tags: [Events]
 *     summary: Create a new event (Admin only)
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
 *               - category
 *               - startDate
 *               - location
 *               - neighborhoodId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [SPORTS, CULTURAL, EDUCATIONAL, VOLUNTEER, SOCIAL, BUSINESS, HEALTH, ENVIRONMENT, TECHNOLOGY, OTHER]
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               neighborhoodId:
 *                 type: string
 *                 format: uuid
 *               isRecurring:
 *                 type: boolean
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *     responses:
 *       201:
 *         description: Event created successfully
 *       403:
 *         description: Admin access required
 */
export async function POST(request: NextRequest) {
    try {
        const user = await getAuthUser(request)

        if (!user?.isAdmin) {
            return errorResponse('Admin access required', 403)
        }

        const body = await request.json()
        const validatedData = createEventSchema.parse(body)

        // Verify neighborhood exists
        const neighborhood = await prisma.neighborhood.findUnique({
            where: { id: validatedData.neighborhoodId }
        })

        if (!neighborhood) {
            return errorResponse('Neighborhood not found', 404)
        }

        const event = await prisma.event.create({
            data: {
                ...validatedData,
                createdBy: user.id,
                startDate: new Date(validatedData.startDate),
                endDate: validatedData.endDate ? new Date(validatedData.endDate) : null
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true
                    }
                },
                neighborhood: {
                    select: {
                        id: true,
                        name: true,
                        city: true
                    }
                }
            }
        })

        return successResponse(event, 'Event created successfully', 201)

    } catch (error) {
        return handleApiError(error)
    }
}