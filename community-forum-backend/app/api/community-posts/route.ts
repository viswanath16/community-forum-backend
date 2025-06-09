import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, requireAuth } from '@/lib/auth'
import { successResponse, errorResponse, paginatedResponse } from '@/lib/utils/responses'
import { handleApiError } from '@/lib/utils/error-handler'
import { z } from 'zod'

const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  category: z.enum(['SERVICE', 'ISSUE', 'QUESTION', 'ANNOUNCEMENT'])
})

/**
 * @swagger
 * /api/community-posts:
 *   get:
 *     summary: List community posts
 *     tags: [CommunityPosts]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [SERVICE, ISSUE, QUESTION, ANNOUNCEMENT]
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
 *         description: List of community posts
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryParam = searchParams.get('category')
    const category = categoryParam && ['SERVICE', 'ISSUE', 'QUESTION', 'ANNOUNCEMENT'].includes(categoryParam)
      ? categoryParam as any
      : undefined
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))
    const skip = (page - 1) * limit

    const where = category ? { category } : undefined
    const [posts, total] = await Promise.all([
      prisma.communityPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: true, attachments: true }
      }),
      prisma.communityPost.count({ where })
    ])

    return paginatedResponse(posts, { page, limit, total })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * @swagger
 * /api/community-posts:
 *   post:
 *     summary: Create a new community post
 *     tags: [CommunityPosts]
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
 *               - content
 *               - category
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
 *       201:
 *         description: Community post created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)
    requireAuth(authUser)
    const user = authUser!
    const body = await request.json()
    const validated = createPostSchema.parse(body)
    const post = await prisma.communityPost.create({
      data: {
        userId: user.id,
        ...validated
      }
    })
    return successResponse(post, 'Community post created')
  } catch (error) {
    return handleApiError(error)
  }
} 