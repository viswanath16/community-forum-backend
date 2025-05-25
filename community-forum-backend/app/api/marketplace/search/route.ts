// app/api/marketplace/search/route.ts

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseMarketplaceSearch } from '@/lib/validations/marketplace'
import { paginatedResponse } from '@/lib/utils/responses'
import { handleApiError } from '@/lib/utils/error-handler'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        // Map common parameter names for backward compatibility
        const paramsObj: any = Object.fromEntries(searchParams.entries())
        if (paramsObj.query && !paramsObj.q) {
            paramsObj.q = paramsObj.query
        }
        if (paramsObj.category && !paramsObj.categoryId) {
            paramsObj.categoryId = paramsObj.category
        }
        if (paramsObj.neighborhood && !paramsObj.neighborhoodId) {
            paramsObj.neighborhoodId = paramsObj.neighborhood
        }

        // Create new URLSearchParams with mapped parameters
        const mappedSearchParams = new URLSearchParams()
        Object.entries(paramsObj).forEach(([key, value]) => {
            if (value) mappedSearchParams.set(key, value as string)
        })

        const params = parseMarketplaceSearch(mappedSearchParams)

        const skip = (params.page! - 1) * params.limit!

        // Build advanced search where clause
        const where: any = {
            status: 'ACTIVE' // Only show active listings in search
        }

        // Category filter
        if (params.categoryId) {
            where.categoryId = params.categoryId
        }

        // Free items filter
        if (params.isFree !== undefined) {
            where.isFree = params.isFree
        }

        // Condition filter
        if (params.condition) {
            where.condition = params.condition
        }

        // Neighborhood filter
        if (params.neighborhoodId) {
            where.neighborhoodId = params.neighborhoodId
        }

        // Price range filter
        if (params.minPrice !== undefined || params.maxPrice !== undefined) {
            where.price = {}
            if (params.minPrice !== undefined) {
                where.price.gte = params.minPrice
            }
            if (params.maxPrice !== undefined) {
                where.price.lte = params.maxPrice
            }
        }

        // Text search in title and description
        if (params.q) {
            where.OR = [
                { title: { contains: params.q, mode: 'insensitive' } },
                { description: { contains: params.q, mode: 'insensitive' } }
            ]
        }

        // Build order by clause
        const orderBy: any = {}
        orderBy[params.sortBy!] = params.sortOrder

        const [listings, total] = await Promise.all([
            prisma.marketListing.findMany({
                where,
                include: {
                    seller: {
                        select: {
                            id: true,
                            username: true,
                            fullName: true,
                            avatarUrl: true,
                            reputationScore: true
                        }
                    },
                    category: {
                        select: {
                            id: true,
                            name: true,
                            description: true
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
                    tags: {
                        include: {
                            tag: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    },
                    _count: {
                        select: {
                            requests: true,
                            reviews: true
                        }
                    }
                },
                orderBy,
                skip,
                take: params.limit
            }),
            prisma.marketListing.count({ where })
        ])

        return paginatedResponse(listings, {
            page: params.page!,
            limit: params.limit!,
            total
        }, 'Search results retrieved successfully')

    } catch (error) {
        return handleApiError(error)
    }
}