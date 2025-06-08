// app/api/events/[id]/register/route.ts - Enhanced version

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, requireAuth } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/utils/responses'
import { handleApiError } from '@/lib/utils/error-handler'
import { z } from 'zod'

const enhancedRegistrationSchema = z.object({
    notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
    emergency_contact: z.object({
        name: z.string().min(1, 'Emergency contact name is required').max(100),
        phone: z.string().min(10, 'Valid phone number required').max(20)
    }).optional()
})

/**
 * @swagger
 * /api/events/{id}/register:
 *   post:
 *     tags: [Events]
 *     summary: Register for an event with enhanced options
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
 *                 example: "Looking forward to helping the community!"
 *               emergency_contact:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     maxLength: 100
 *                     example: "Jane Doe"
 *                   phone:
 *                     type: string
 *                     maxLength: 20
 *                     example: "+31612345678"
 *     responses:
 *       201:
 *         description: Successfully registered for event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Successfully registered for the event!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     registration_id:
 *                       type: string
 *                     event_id:
 *                       type: string
 *                     user_id:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [confirmed, waitlist]
 *                     registered_at:
 *                       type: string
 *                       format: date-time
 *                     position:
 *                       type: integer
 *                     waiting_list:
 *                       type: boolean
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
        const authUser = await getAuthUser(request)
        requireAuth(authUser)

        const user = authUser!
        const { id } = await context.params

        const body = await request.json().catch(() => ({}))
        const validatedData = enhancedRegistrationSchema.parse(body)

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

        // Check if event has already passed
        if (event.startDate < new Date()) {
            return errorResponse('Cannot register for past events', 400)
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

        // Check capacity and determine status
        const registeredCount = event._count.registrations
        const isAtCapacity = event.capacity && registeredCount >= event.capacity
        const status = isAtCapacity ? 'WAITLIST' : 'REGISTERED'

        // Calculate position
        const position = status === 'WAITLIST' 
            ? await prisma.eventRegistration.count({
                where: { eventId: id, status: 'WAITLIST' }
            }) + 1
            : registeredCount + 1

        // Create registration with enhanced data
        const registrationData: any = {
            eventId: id,
            userId: user.id,
            status,
            notes: validatedData.notes
        }

        // Store emergency contact if provided (would need to extend schema)
        if (validatedData.emergency_contact) {
            // In a real implementation, you might want to store this securely
            // For now, we'll include it in notes
            const emergencyInfo = `Emergency Contact: ${validatedData.emergency_contact.name} - ${validatedData.emergency_contact.phone}`
            registrationData.notes = validatedData.notes 
                ? `${validatedData.notes}\n\n${emergencyInfo}`
                : emergencyInfo
        }

        const registration = await prisma.eventRegistration.create({
            data: registrationData,
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        startDate: true,
                        location: true,
                        capacity: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                        email: true
                    }
                }
            }
        })

        // Format response according to API spec
        const responseData = {
            registration_id: registration.id,
            event_id: registration.eventId,
            user_id: registration.userId,
            status: status === 'REGISTERED' ? 'confirmed' : 'waitlist',
            registered_at: registration.registeredAt.toISOString(),
            position,
            waiting_list: status === 'WAITLIST',
            event_details: {
                title: registration.event.title,
                date: registration.event.startDate.toISOString().split('T')[0],
                time: registration.event.startDate.toTimeString().substring(0, 5),
                location: registration.event.location
            }
        }

        const message = status === 'WAITLIST'
            ? `Added to waitlist successfully. You are position ${position} on the waiting list.`
            : 'Successfully registered for the event!'

        return successResponse(responseData, message, 201)

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
        const authUser = await getAuthUser(request)
        requireAuth(authUser)

        const user = authUser!
        const { id } = await context.params

        const registration = await prisma.eventRegistration.findUnique({
            where: {
                eventId_userId: {
                    eventId: id,
                    userId: user.id
                }
            },
            include: {
                event: {
                    select: {
                        title: true,
                        startDate: true,
                        capacity: true
                    }
                }
            }
        })

        if (!registration) {
            return errorResponse('Registration not found', 404)
        }

        // Check if event has already started
        if (registration.event.startDate < new Date()) {
            return errorResponse('Cannot unregister from events that have already started', 400)
        }

        // Delete the registration
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

                // In a real implementation, you'd send a notification to the user
                // about being moved from waitlist to confirmed
            }
        }

        const responseData = {
            event_id: id,
            event_title: registration.event.title,
            unregistered_at: new Date().toISOString()
        }

        return successResponse(responseData, 'Successfully unregistered from event')

    } catch (error) {
        return handleApiError(error)
    }
}