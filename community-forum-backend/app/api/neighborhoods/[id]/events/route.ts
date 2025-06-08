// app/api/neighborhoods/[id]/events/route.ts

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, paginatedResponse } from '@/lib/utils/responses'
import { handleApiError } from '@/lib/utils/error-handler'

/**
 * @swagger
 * /api/neighborhoods/{id}/events:
 *   get:
 *     summary: Get events specific to a neighborhood
 *     tags: [Events, Neighborhoods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Neighborhood ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: upcoming_only
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Show only upcoming events
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter featured events
 *     responses:
 *       200:
 *         description: Neighborhood events retrieved successfully
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
 *                     events:
 *                       type: array
 *                     neighborhood:
 *                       type: object
 *                     statistics:
 *                       type: object
 *       404:
 *         description: Neighborhood not found
 */
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const { searchParams } = new URL(request.url)

        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)))
        const category = searchParams.get('category')
        const upcomingOnly = searchParams.get('upcoming_only') !== 'false'
        const featured = searchParams.get('featured')
        const skip = (page - 1) * limit

        // Verify neighborhood exists
        const neighborhood = await prisma.neighborhood.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                city: true,
                postalCode: true,
                description: true
            }
        })

        if (!neighborhood) {
            return errorResponse('Neighborhood not found', 404)
        }

        // Build where clause
        const where: any = {
            neighborhoodId: id,
            status: 'ACTIVE'
        }

        if (upcomingOnly) {
            where.startDate = { gte: new Date() }
        }

        if (category) {
            where.category = category
        }

        // Get events
        const [events, totalCount] = await Promise.all([
            prisma.event.findMany({
                where,
                include: {
                    creator: {
                        select: {
                            id: true,
                            username: true,
                            fullName: true,
                            avatarUrl: true,
                            isAdmin: true
                        }
                    },
                    registrations: {
                        select: {
                            id: true,
                            status: true,
                            user: {
                                select: {
                                    id: true,
                                    username: true,
                                    avatarUrl: true
                                }
                            }
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
                orderBy: { startDate: 'asc' },
                skip,
                take: limit
            }),
            prisma.event.count({ where })
        ])

        // Get neighborhood statistics
        const now = new Date()
        const [
            totalEvents,
            upcomingEvents,
            thisMonthEvents,
            totalResidents,
            activeOrganizers
        ] = await Promise.all([
            prisma.event.count({ 
                where: { neighborhoodId: id, status: 'ACTIVE' } 
            }),
            prisma.event.count({ 
                where: { 
                    neighborhoodId: id, 
                    status: 'ACTIVE',
                    startDate: { gte: now }
                } 
            }),
            prisma.event.count({ 
                where: { 
                    neighborhoodId: id, 
                    status: 'ACTIVE',
                    startDate: { 
                        gte: new Date(now.getFullYear(), now.getMonth(), 1),
                        lt: new Date(now.getFullYear(), now.getMonth() + 1, 1)
                    }
                } 
            }),
            prisma.user.count({ 
                where: { neighborhoodId: id } 
            }),
            prisma.event.groupBy({
                by: ['createdBy'],
                where: { neighborhoodId: id }
            }).then(result => result.length)
        ])

        // Format events
        const formattedEvents = events.map(event => {
            const registeredCount = event._count.registrations
            const waitingListCount = event.registrations.filter(r => r.status === 'WAITLIST').length
            
            return {
                id: event.id,
                title: event.title,
                description: event.description,
                short_description: event.description.length > 150 
                    ? event.description.substring(0, 150) + '...' 
                    : event.description,
                date: event.startDate.toISOString().split('T')[0],
                time: event.startDate.toTimeString().substring(0, 5),
                end_time: event.endDate?.toTimeString().substring(0, 5) || null,
                location: {
                    name: event.location,
                    address: event.location,
                    coordinates: event.coordinates as any || null
                },
                category: {
                    id: event.category.toLowerCase().replace('_', '-'),
                    name: event.category.charAt(0) + event.category.slice(1).toLowerCase().replace('_', ' '),
                    color: getCategoryColor(event.category)
                },
                organizer: {
                    id: event.creator.id,
                    name: event.creator.fullName || event.creator.username,
                    avatar: event.creator.avatarUrl || null,
                    verified: event.creator.isAdmin
                },
                attendees: {
                    current: registeredCount,
                    max: event.capacity || null,
                    waiting_list: waitingListCount
                },
                price: {
                    amount: 0,
                    currency: "EUR",
                    is_free: true
                },
                images: event.imageUrl ? [{
                    id: "img_1",
                    url: event.imageUrl,
                    alt: event.title,
                    is_primary: true
                }] : [],
                tags: [],
                status: "published",
                registration_status: event.capacity 
                    ? (registeredCount < event.capacity ? "open" : "full") 
                    : "open",
                created_at: event.createdAt.toISOString(),
                updated_at: event.updatedAt.toISOString(),
                is_featured: false,
                recurring: event.isRecurring ? event.recurrencePattern : null
            }
        })

        // Category breakdown
        const categoryStats = await prisma.event.groupBy({
            by: ['category'],
            where: { 
                neighborhoodId: id, 
                status: 'ACTIVE',
                startDate: { gte: now }
            },
            _count: {
                category: true
            }
        })

        const categoryBreakdown = categoryStats.reduce((acc, stat) => {
            acc[stat.category.toLowerCase()] = stat._count.category
            return acc
        }, {} as Record<string, number>)

        // Popular times analysis
        const eventsByHour = await prisma.event.findMany({
            where: { 
                neighborhoodId: id, 
                status: 'ACTIVE',
                startDate: { gte: now }
            },
            select: { startDate: true }
        })

        const hourlyDistribution = eventsByHour.reduce((acc, event) => {
            const hour = event.startDate.getHours()
            acc[hour] = (acc[hour] || 0) + 1
            return acc
        }, {} as Record<number, number>)

        const responseData = {
            events: formattedEvents,
            neighborhood: {
                ...neighborhood,
                coordinates: null // Would be added if stored
            },
            statistics: {
                total_events: totalEvents,
                upcoming_events: upcomingEvents,
                this_month_events: thisMonthEvents,
                total_residents: totalResidents,
                active_organizers: activeOrganizers,
                category_breakdown: categoryBreakdown,
                popular_times: hourlyDistribution,
                avg_attendance: events.length > 0 
                    ? Math.round(events.reduce((sum, e) => sum + e._count.registrations, 0) / events.length)
                    : 0
            },
            pagination: {
                current_page: page,
                total_pages: Math.ceil(totalCount / limit),
                total_events: totalCount,
                per_page: limit,
                has_next: page < Math.ceil(totalCount / limit),
                has_prev: page > 1
            },
            filters_applied: {
                category,
                upcoming_only: upcomingOnly,
                featured
            }
        }

        return successResponse(responseData, 'Neighborhood events retrieved successfully')

    } catch (error) {
        return handleApiError(error)
    }
}

// Helper function for category colors (reused from events route)
function getCategoryColor(category: string): string {
    const colors = {
        SPORTS: '#E74C3C',
        CULTURAL: '#9B59B6',
        EDUCATIONAL: '#FF6B35',
        VOLUNTEER: '#2ECC71',
        SOCIAL: '#3498DB',
        BUSINESS: '#34495E',
        HEALTH: '#1ABC9C',
        ENVIRONMENT: '#27AE60',
        TECHNOLOGY: '#8E44AD',
        OTHER: '#95A5A6'
    }
    return colors[category as keyof typeof colors] || '#95A5A6'
}