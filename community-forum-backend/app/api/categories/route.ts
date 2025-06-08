import { NextRequest } from 'next/server'
import { EventCategory } from '@prisma/client'
import { successResponse } from '@/lib/utils/responses'
import { handleApiError } from '@/lib/utils/error-handler'

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags: [Events]
 *     summary: Get all event categories
 *     responses:
 *       200:
 *         description: List of event categories
 */
export async function GET(request: NextRequest) {
    try {
        const categories = Object.values(EventCategory).map(category => ({
            value: category,
            label: category.charAt(0) + category.slice(1).toLowerCase().replace('_', ' ')
        }))

        return successResponse(categories)

    } catch (error) {
        return handleApiError(error)
    }
}
