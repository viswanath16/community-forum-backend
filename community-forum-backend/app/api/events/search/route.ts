// app/api/events/search/route.ts

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/utils/responses'
import { handleApiError } from '@/lib/utils/error-handler'

/**
 * @swagger
 * /api/events/search:
 *   get:
 *     summary: Advanced event search with autocomplete
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *         description: Search query
 *       - in: query
 *         name: suggest
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include search suggestions
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 50
 *         description: Maximum number of results
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: neighborhood
 *         schema:
 *           type: string
 *         description: Filter by neighborhood ID
 *     responses:
 *       200:
 *         description: Search results with optional suggestions
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
 *                     results:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           highlight:
 *                             type: string
 *                           description:
 *                             type: string
 *                           date:
 *                             type: string
 *                           category:
 *                             type: string
 *                           location:
 *                             type: string
 *                     suggestions:
 *                       type: array
 *                       items:
 *                         type: string
 *       400:
 *         description: Invalid search query
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        
        const query = searchParams.get('q')
        const suggest = searchParams.get('suggest') === 'true'
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))
        const category = searchParams.get('category')
        const neighborhood = searchParams.get('neighborhood')

        if (!query || query.length < 2) {
            return errorResponse('Search query must be at least 2 characters', 400)
        }

        // Build search where clause
        const where: any = {
            status: 'ACTIVE',
            OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { location: { contains: query, mode: 'insensitive' } }
            ]
        }

        if (category) {
            where.category = category
        }

        if (neighborhood) {
            where.neighborhoodId = neighborhood
        }

        // Search events
        const events = await prisma.event.findMany({
            where,
            include: {
                creator: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                        avatarUrl: true
                    }
                },
                neighborhood: {
                    select: {
                        id: true,
                        name: true,
                        city: true
                    }
                },
                _count: {
                    select: {
                        registrations: {
                            where: { status: 'REGISTERED' }
                        }
                    }
                }
            },
            orderBy: [
                { startDate: 'asc' }
            ],
            take: limit
        })

        // Format results with highlights
        const results = events.map(event => {
            const titleMatch = event.title.toLowerCase().includes(query.toLowerCase())
            const descMatch = event.description.toLowerCase().includes(query.toLowerCase())
            const locationMatch = event.location.toLowerCase().includes(query.toLowerCase())

            let highlight = event.title
            if (titleMatch) {
                const regex = new RegExp(`(${query})`, 'gi')
                highlight = event.title.replace(regex, '<mark>$1</mark>')
            }

            return {
                id: event.id,
                title: event.title,
                highlight,
                description: event.description.length > 100 
                    ? event.description.substring(0, 100) + '...'
                    : event.description,
                date: event.startDate.toISOString().split('T')[0],
                time: event.startDate.toTimeString().substring(0, 5),
                category: {
                    id: event.category.toLowerCase().replace('_', '-'),
                    name: event.category.charAt(0) + event.category.slice(1).toLowerCase().replace('_', ' ')
                },
                location: event.location,
                organizer: {
                    id: event.creator.id,
                    name: event.creator.fullName || event.creator.username,
                    avatar: event.creator.avatarUrl
                },
                attendees_count: event._count.registrations,
                neighborhood: event.neighborhood,
                match_type: titleMatch ? 'title' : descMatch ? 'description' : 'location'
            }
        })

        // Generate suggestions if requested
        let suggestions: string[] = []
        if (suggest) {
            // Get common search terms and categories
            const commonTerms = [
                'cleanup events',
                'community service',
                'sports activities',
                'cultural events',
                'educational workshops',
                'volunteer opportunities',
                'social gatherings',
                'health and wellness',
                'technology meetups',
                'environmental activities'
            ]

            suggestions = commonTerms
                .filter(term => term.toLowerCase().includes(query.toLowerCase()))
                .slice(0, 5)

            // Add category-based suggestions
            if (query.toLowerCase().includes('clean')) {
                suggestions.push('cleanup events', 'environmental activities')
            }
            if (query.toLowerCase().includes('sport')) {
                suggestions.push('sports activities', 'fitness events')
            }
            if (query.toLowerCase().includes('learn')) {
                suggestions.push('educational workshops', 'skill building')
            }

            // Remove duplicates and limit
            suggestions = [...new Set(suggestions)].slice(0, 5)
        }

        const responseData = {
            results,
            total_found: results.length,
            query,
            suggestions: suggest ? suggestions : undefined,
            search_time: Date.now() // Could add actual search timing
        }

        return successResponse(responseData, 'Search completed successfully')

    } catch (error) {
        return handleApiError(error)
    }
}