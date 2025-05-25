// app/api/marketplace/categories/route.ts

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse } from '@/lib/utils/responses'
import { handleApiError } from '@/lib/utils/error-handler'

export async function GET(request: NextRequest) {
    try {
        const categories = await prisma.category.findMany({
            where: { isActive: true },
            include: {
                subcategories: {
                    where: { isActive: true },
                    orderBy: { sortOrder: 'asc' }
                },
                _count: {
                    select: {
                        marketListings: {
                            where: { status: 'ACTIVE' }
                        }
                    }
                }
            },
            orderBy: { sortOrder: 'asc' }
        })

        return successResponse(categories, 'Categories retrieved successfully')

    } catch (error) {
        return handleApiError(error)
    }
}