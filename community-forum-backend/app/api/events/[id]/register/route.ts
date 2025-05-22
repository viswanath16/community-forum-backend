import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, requireAuth } from '@/lib/auth'
import { eventRegistrationSchema } from '@/lib/validations/events'
import { successResponse, errorResponse } from '@/lib/utils/responses'
import { handleApiError } from '@/lib/utils/error-handler'

/**
 * @swagger
 * /api/events/{id}/register:
 *   post:
 *     tags: [Events]
 *     summary: Register for an event
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
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       201:
 *         description: Successfully registered for event
 *       400:
 *         description: Already registered or event full
 *       404:
 *         description: Event not found
 */
export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthUser(request)
        requireAuth(user)

        const { id } = await context.params

        const body = await request.json().catch(() => ({}))
        const validatedData = eventRegistrationSchema.parse(body)

        // Check if event exists and is active
        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        registrations: {
                            where: { status: 'REGISTERED' }
                        }
                    }
                }
            }
        })

        if (!event) {
            return errorResponse('Event not found', 404)
        }

        if (event.status !== 'ACTIVE') {
            return errorResponse('Event is not available for registration', 400)
        }

        // Check if user is already registered
        const existingRegistration = await prisma.eventRegistration.findUnique({
            where: {
                eventId_userId: {
                    eventId: id,
                    userId: user.id
                }
            }
        })

        if (existingRegistration) {
            return errorResponse('Already registered for this event', 400)
        }

        // Check capacity
        const registeredCount = event._count.registrations
        const isAtCapacity = event.capacity && registeredCount >= event.capacity

        const registration = await prisma.eventRegistration.create({
            data: {
                eventId: id,
                userId: user.id,
                status: isAtCapacity ? 'WAITLIST' : 'REGISTERED',
                notes: validatedData.notes
            },
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        startDate: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true
                    }
                }
            }
        })

        const message = isAtCapacity
            ? 'Added to waitlist successfully'
            : 'Successfully registered for event'

        return successResponse(registration, message, 201)

    } catch (error) {
        return handleApiError(error)
    }
}

/**
 * @swagger
 * /api/events/{id}/register:
 *   delete:
 *     tags: [Events]
 *     summary: Unregister from an event
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
 *         description: Successfully unregistered from event
 *       404:
 *         description: Registration not found
 */
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthUser(request)
        requireAuth(user)

        const { id } = await context.params

        const registration = await prisma.eventRegistration.findUnique({
            where: {
                eventId_userId: {
                    eventId: id,
                    userId: user.id
                }
            }
        })

        if (!registration) {
            return errorResponse('Registration not found', 404)
        }

        await prisma.eventRegistration.delete({
            where: {
                eventId_userId: {
                    eventId: id,
                    userId: user.id
                }
            }
        })

        // Move someone from waitlist to registered if there's capacity
        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        registrations: {
                            where: { status: 'REGISTERED' }
                        }
                    }
                }
            }
        })

        if (event?.capacity && event._count.registrations < event.capacity) {
            const waitlistRegistration = await prisma.eventRegistration.findFirst({
                where: {
                    eventId: id,
                    status: 'WAITLIST'
                },
                orderBy: { registeredAt: 'asc' }
            })

            if (waitlistRegistration) {
                await prisma.eventRegistration.update({
                    where: { id: waitlistRegistration.id },
                    data: { status: 'REGISTERED' }
                })
            }
        }

        return successResponse(null, 'Successfully unregistered from event')

    } catch (error) {
        return handleApiError(error)
    }
}