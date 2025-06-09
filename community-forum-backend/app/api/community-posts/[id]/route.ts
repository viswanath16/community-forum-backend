import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, requireAuth } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/utils/responses'
import { handleApiError } from '@/lib/utils/error-handler'
import { z } from 'zod'

const updatePostSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  category: z.enum(['SERVICE', 'ISSUE', 'QUESTION', 'ANNOUNCEMENT']).optional()
})

/**
 * @swagger
 * /api/community-posts/{id}:
 *   get:
 *     summary: Get a community post by ID
 *     tags: [CommunityPosts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Community post details
 *       404:
 *         description: Post not found
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const post = await prisma.communityPost.findUnique({
      where: { id },
      include: {
        user: true,
        attachments: true,
        comments: {
          include: { user: true },
          orderBy: { createdAt: 'asc' }
        }
      }
    })
    if (!post) return errorResponse('Post not found', 404)
    return successResponse(post)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * @swagger
 * /api/community-posts/{id}:
 *   put:
 *     summary: Update a community post
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
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [SERVICE, ISSUE, QUESTION, ANNOUNCEMENT]
 *     responses:
 *       200:
 *         description: Community post updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Post not found
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(request)
    requireAuth(authUser)
    const user = authUser!
    const { id } = await context.params
    const body = await request.json()
    const validated = updatePostSchema.parse(body)
    const post = await prisma.communityPost.findUnique({ where: { id } })
    if (!post) return errorResponse('Post not found', 404)
    if (post.userId !== user.id && !user.isAdmin) return errorResponse('Unauthorized', 403)
    const updated = await prisma.communityPost.update({
      where: { id },
      data: validated
    })
    return successResponse(updated, 'Community post updated')
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * @swagger
 * /api/community-posts/{id}:
 *   delete:
 *     summary: Delete a community post
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
 *     responses:
 *       200:
 *         description: Community post deleted
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
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
    const post = await prisma.communityPost.findUnique({ where: { id } })
    if (!post) return errorResponse('Post not found', 404)
    if (post.userId !== user.id && !user.isAdmin) return errorResponse('Unauthorized', 403)
    await prisma.communityPost.delete({ where: { id } })
    return successResponse({}, 'Community post deleted')
  } catch (error) {
    return handleApiError(error)
  }
} 