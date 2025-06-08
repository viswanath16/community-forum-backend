// app/api/events/[id]/comments/route.ts

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, requireAuth } from '@/lib/auth'
import { successResponse, errorResponse, paginatedResponse } from '@/lib/utils/responses'
import { handleApiError } from '@/lib/utils/error-handler'
import { z } from 'zod'


const createCommentSchema = z.object({
    content: z.string().min(1, 'Content is required').max(1000, 'Content too long'),
    parent_id: z.string().uuid().optional()
})

/**
 * @swagger
 * /api/events/{id}/comments:
 *   get:
 *     summary: Get comments and questions for an event
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
 *           default: 10
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, oldest]
 *           default: newest
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
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
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))
        const sort = searchParams.get('sort') === 'oldest' ? 'asc' : 'desc'
        const skip = (page - 1) * limit

        // Check if event exists
        const event = await prisma.event.findUnique({
            where: { id }
        })

        if (!event) {
            return errorResponse('Event not found', 404)
        }

        // For now, return mock data since EventComment model doesn't exist yet
        // This structure shows what the response should look like
        const mockComments = [
            {
                id: "comment_123",
                user: {
                    id: "user_456",
                    name: "Maria K.",
                    avatar: "https://images.unsplash.com/photo-1494790108755-2616b9c6f3a7?w=150"
                },
                content: "What should I bring to the cleanup event?",
                created_at: "2024-02-01T14:30:00Z",
                replies: [
                    {
                        id: "reply_789",
                        user: {
                            id: event.createdBy,
                            name: "Event Organizer",
                            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
                            is_organizer: true
                        },
                        content: "We'll provide gloves and bags. Just bring enthusiasm!",
                        created_at: "2024-02-01T15:00:00Z"
                    }
                ],
                reply_count: 1
            }
        ]

        const responseData = {
            comments: mockComments,
            pagination: {
                current_page: page,
                total_pages: 1,
                total_comments: mockComments.length,
                per_page: limit,
                has_next: false,
                has_prev: false
            }
        }

        return successResponse(responseData, 'Comments retrieved successfully')

    } catch (error) {
        return handleApiError(error)
    }
}

/**
 * @swagger
 * /api/events/{id}/comments:
 *   post:
 *     summary: Add a comment or question to an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 1000
 *                 example: "What should I bring to the cleanup event?"
 *               parent_id:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: Parent comment ID for replies
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
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

        const body = await request.json()
        const validatedData = createCommentSchema.parse(body)

        // Check if event exists
        const event = await prisma.event.findUnique({
            where: { id }
        })

        if (!event) {
            return errorResponse('Event not found', 404)
        }

        // Check if parent comment exists (if replying)
        if (validatedData.parent_id) {
            // This would need the EventComment model
            // const parentComment = await prisma.eventComment.findUnique({
            //     where: { id: validatedData.parent_id, eventId: id }
            // })
            // if (!parentComment) {
            //     return errorResponse('Parent comment not found', 404)
            // }
        }

        // Mock response for now - replace with actual database creation
        const mockComment = {
            id: `comment_${Date.now()}`,
            user: {
                id: user.id,
                name: user.fullName || user.username,
                avatar: user.avatarUrl,
                is_organizer: user.id === event.createdBy
            },
            content: validatedData.content,
            created_at: new Date().toISOString(),
            replies: [],
            reply_count: 0,
            parent_id: validatedData.parent_id || null
        }

        return successResponse(mockComment, 'Comment created successfully', 201)

    } catch (error) {
        return handleApiError(error)
    }
}