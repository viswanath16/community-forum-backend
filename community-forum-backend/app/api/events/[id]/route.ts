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
                        avatarUrl: true,
                        isAdmin: true
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

        // Transform the event data to match the expected format
        const formattedEvent = {
            id: event.id,
            title: event.title,
            description: event.description,
            date: event.startDate.toISOString().split('T')[0],
            time: event.startDate.toTimeString().substring(0, 5),
            end_time: event.endDate?.toTimeString().substring(0, 5) || null,
            location: {
                name: event.location,
                address: event.location,
                coordinates: event.coordinates as any || null
            },
            category: {
                id: event.category.toLowerCase().replace('_', '-'),
                name: event.category.charAt(0) + event.category.slice(1).toLowerCase().replace('_', ' '),
                color: getCategoryColor(event.category)
            },
            organizer: {
                id: event.creator.id,
                name: event.creator.fullName || event.creator.username,
                avatar: event.creator.avatarUrl || null,
                verified: event.creator.isAdmin
            },
            attendees: {
                current: event._count.registrations,
                max: event.capacity || null,
                waiting_list: event.registrations.filter(r => r.status === 'WAITLIST').length
            },
            price: {
                amount: event.price ? Number(event.price) : 0,
                currency: 'EUR',
                is_free: event.isFree
            },
            images: event.imageUrl ? [{
                id: 'img_1',
                url: event.imageUrl,
                alt: event.title,
                is_primary: true
            }] : [],
            tags: event.tags || [],
            status: event.status.toLowerCase(),
            registration_status: event.capacity 
                ? (event._count.registrations < event.capacity ? 'open' : 'full') 
                : 'open',
            created_at: event.createdAt.toISOString(),
            updated_at: event.updatedAt.toISOString(),
            is_featured: event.featured,
            recurring: event.isRecurring ? event.recurrencePattern : null
        }

        return successResponse(formattedEvent)

    } catch (error) {
        return handleApiError(error)
    }
}

// Helper function to get category color
function getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
        'SPORTS': '#3B82F6',
        'CULTURAL': '#8B5CF6',
        'EDUCATIONAL': '#EC4899',
        'VOLUNTEER': '#10B981',
        'SOCIAL': '#F59E0B',
        'BUSINESS': '#6366F1',
        'HEALTH': '#059669',
        'ENVIRONMENT': '#10B981',
        'TECHNOLOGY': '#3B82F6',
        'OTHER': '#6B7280'
    }
    return colors[category] || '#6B7280'
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