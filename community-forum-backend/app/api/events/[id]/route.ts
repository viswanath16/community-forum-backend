import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, requireAdmin } from '@/lib/auth'
import { updateEventSchema } from '@/lib/validations/events'
import { successResponse, errorResponse } from '@/lib/utils/responses'
import { handleApiError } from '@/lib/utils/error-handler'

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     tags: [Events]
 *     summary: Get event by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Event details
 *       404:
 *         description: Event not found
 */
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params

        const event = await prisma.event.findUnique({
            where: { id },
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
                        city: true,
                        postalCode: true
                    }
                },
                registrations: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                fullName: true,
                                avatarUrl: true
                            }
                        }
                    },
                    orderBy: { registeredAt: 'asc' }
                },
                _count: {
                    select: {
                        registrations: true
                    }
                }
            }
        })

        if (!event) {
            return errorResponse('Event not found', 404)
        }

        return successResponse(event)

    } catch (error) {
        return handleApiError(error)
    }
}

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     tags: [Events]
 *     summary: Update event (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Event not found
 */
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthUser(request)
        requireAdmin(user)

        const { id } = await context.params

        const body = await request.json()
        const validatedData = updateEventSchema.parse(body)

        // Check if event exists
        const existingEvent = await prisma.event.findUnique({
            where: { id }
        })

        if (!existingEvent) {
            return errorResponse('Event not found', 404)
        }

        const updatedEvent = await prisma.event.update({
            where: { id },
            data: {
                ...validatedData,
                ...(validatedData.startDate && { startDate: new Date(validatedData.startDate) }),
                ...(validatedData.endDate && { endDate: new Date(validatedData.endDate) })
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

        return successResponse(updatedEvent, 'Event updated successfully')

    } catch (error) {
        return handleApiError(error)
    }
}

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     tags: [Events]
 *     summary: Delete event (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Event not found
 */
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthUser(request)
        requireAdmin(user)

        const { id } = await context.params

        // Check if event exists
        const existingEvent = await prisma.event.findUnique({
            where: { id }
        })

        if (!existingEvent) {
            return errorResponse('Event not found', 404)
        }

        // Soft delete by updating status
        await prisma.event.update({
            where: { id },
            data: { status: 'CANCELLED' }
        })

        return successResponse(null, 'Event deleted successfully')

    } catch (error) {
        return handleApiError(error)
    }
}