import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, requireAuth } from '@/lib/auth'
import { successResponse, errorResponse, paginatedResponse } from '@/lib/utils/responses'
import { handleApiError } from '@/lib/utils/error-handler'
import { z } from 'zod'

const createCommentSchema = z.object({
  content: z.string().min(1, 'Content is required').max(1000, 'Content too long')
})

/**
 * @swagger
 * /api/community-posts/{id}/comments:
 *   get:
 *     summary: Get comments for a community post
 *     tags: [CommunityPosts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
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
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *       404:
 *         description: Post not found
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
    const skip = (page - 1) * limit

    const post = await prisma.communityPost.findUnique({ where: { id } })
    if (!post) return errorResponse('Post not found', 404)

    const [comments, total] = await Promise.all([
      prisma.communityPostComment.findMany({
        where: { postId: id },
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' },
        include: { user: true }
      }),
      prisma.communityPostComment.count({ where: { postId: id } })
    ])

    return paginatedResponse(comments, { page, limit, total })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * @swagger
 * /api/community-posts/{id}/comments:
 *   post:
 *     summary: Add a comment to a community post
 *     tags: [CommunityPosts]
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
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 1000
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Post not found
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
    const validated = createCommentSchema.parse(body)
    const post = await prisma.communityPost.findUnique({ where: { id } })
    if (!post) return errorResponse('Post not found', 404)
    const comment = await prisma.communityPostComment.create({
      data: {
        postId: id,
        userId: user.id,
        content: validated.content
      },
      include: { user: true }
    })
    return successResponse(comment, 'Comment created successfully')
  } catch (error) {
    return handleApiError(error)
  }
} 