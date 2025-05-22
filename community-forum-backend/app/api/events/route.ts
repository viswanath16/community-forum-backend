import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, requireAdmin } from '@/lib/auth'
import { createEventSchema, eventQuerySchema } from '@/lib/validations/events'
import { successResponse, paginatedResponse } from '@/lib/utils/responses'
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
        const query = eventQuerySchema.parse({
            page: searchParams.get('page'),
            limit: searchParams.get('limit'),
            category: searchParams.get('category'),
            neighborhoodId: searchParams.get('neighborhoodId'),
            startDate: searchParams.get('startDate'),
            endDate: searchParams.get('endDate'),
            search: searchParams.get('search')
        })

        const skip = (query.page - 1) * query.limit

        const where = {
            status: 'ACTIVE' as const,
            ...(query.category && { category: query.category }),
            ...(query.neighborhoodId && { neighborhoodId: query.neighborhoodId }),
            ...(query.startDate && {
                startDate: {
                    gte: new Date(query.startDate)
                }
            }),
            ...(query.endDate && {
                startDate: {
                    lte: new Date(query.endDate)
                }
            }),
            ...(query.search && {
                OR: [
                    { title: { contains: query.search, mode: 'insensitive' as const } },
                    { description: { contains: query.search, mode: 'insensitive' as const } }
                ]
            })
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
                take: query.limit
            }),
            prisma.event.count({ where })
        ])

        return paginatedResponse(events, {
            page: query.page,
            limit: query.limit,
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
        requireAdmin(user)

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