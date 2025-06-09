import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, requireAuth } from '@/lib/auth'
import { successResponse, errorResponse, paginatedResponse } from '@/lib/utils/responses'
import { handleApiError } from '@/lib/utils/error-handler'
import { z } from 'zod'

const createAttachmentSchema = z.object({
  fileUrl: z.string().url(),
  fileType: z.enum(['photo', 'document'])
})

/**
 * @swagger
 * /api/community-posts/{id}/attachments:
 *   get:
 *     summary: List attachments for a community post
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
 *         description: List of attachments
 *       404:
 *         description: Post not found
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const post = await prisma.communityPost.findUnique({ where: { id } })
    if (!post) return errorResponse('Post not found', 404)
    const attachments = await prisma.communityPostAttachment.findMany({
      where: { postId: id },
      orderBy: { createdAt: 'asc' }
    })
    return successResponse(attachments)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * @swagger
 * /api/community-posts/{id}/attachments:
 *   post:
 *     summary: Add an attachment to a community post
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
 *               - fileUrl
 *               - fileType
 *             properties:
 *               fileUrl:
 *                 type: string
 *                 format: url
 *               fileType:
 *                 type: string
 *                 enum: [photo, document]
 *     responses:
 *       201:
 *         description: Attachment added
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
    const { id } = await context.params
    const body = await request.json()
    const validated = createAttachmentSchema.parse(body)
    const post = await prisma.communityPost.findUnique({ where: { id } })
    if (!post) return errorResponse('Post not found', 404)
    const attachment = await prisma.communityPostAttachment.create({
      data: {
        postId: id,
        fileUrl: validated.fileUrl,
        fileType: validated.fileType
      }
    })
    return successResponse(attachment, 'Attachment added')
  } catch (error) {
    return handleApiError(error)
  }
} 