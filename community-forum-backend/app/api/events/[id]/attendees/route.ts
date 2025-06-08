// app/api/events/[id]/attendees/route.ts

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/utils/responses'
import { handleApiError } from '@/lib/utils/error-handler'

/**
 * @swagger
 * /api/events/{id}/attendees:
 *   get:
 *     summary: Get list of event attendees (public info only)
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Event ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: List of event attendees
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     attendees:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           user_id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                           registered_at:
 *                             type: string
 *                             format: date-time
 *                     total_count:
 *                       type: integer
 *                     waiting_list_count:
 *                       type: integer
 *       404:
 *         description: Event not found
 */
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const { searchParams } = new URL(request.url)
        
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))
        const skip = (page - 1) * limit

        // Check if event exists
        const event = await prisma.event.findUnique({
            where: { id, status: 'ACTIVE' }
        })

        if (!event) {
            return errorResponse('Event not found', 404)
        }

        // Get attendees with public information only
        const [attendees, totalCount, waitingListCount] = await Promise.all([
            prisma.eventRegistration.findMany({
                where: {
                    eventId: id,
                    status: 'REGISTERED'
                },
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
                orderBy: { registeredAt: 'asc' },
                skip,
                take: limit
            }),
            prisma.eventRegistration.count({
                where: {
                    eventId: id,
                    status: 'REGISTERED'
                }
            }),
            prisma.eventRegistration.count({
                where: {
                    eventId: id,
                    status: 'WAITLIST'
                }
            })
        ])

        // Format response to match API specification
        const formattedAttendees = attendees.map(registration => ({
            user_id: registration.user.id,
            name: registration.user.fullName || registration.user.username,
            avatar: registration.user.avatarUrl || null,
            registered_at: registration.registeredAt.toISOString()
        }))

        const responseData = {
            attendees: formattedAttendees,
            total_count: totalCount,
            waiting_list_count: waitingListCount,
            pagination: {
                current_page: page,
                total_pages: Math.ceil(totalCount / limit),
                per_page: limit,
                has_next: page < Math.ceil(totalCount / limit),
                has_prev: page > 1
            }
        }

        return successResponse(responseData, 'Attendees retrieved successfully')

    } catch (error) {
        return handleApiError(error)
    }
}