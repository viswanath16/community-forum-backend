// app/api/events/route.ts - Enhanced version with advanced filtering

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { createEventSchema } from '@/lib/validations/events'
import { successResponse, paginatedResponse, errorResponse } from '@/lib/utils/responses'
import { handleApiError } from '@/lib/utils/error-handler'

/**
 * @swagger
 * /api/events:
 *   get:
 *     tags: [Events]
 *     summary: Get all events with advanced filtering
 *     parameters:
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
 *           enum: [SPORTS, CULTURAL, EDUCATIONAL, VOLUNTEER, SOCIAL, BUSINESS, HEALTH, ENVIRONMENT, TECHNOLOGY, OTHER]
 *       - in: query
 *         name: neighborhood
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: date_from
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: date_to
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [date, popularity, price]
 *           default: date
 *       - in: query
 *         name: sort_order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *       - in: query
 *         name: price_min
 *         schema:
 *           type: number
 *       - in: query
 *         name: price_max
 *         schema:
 *           type: number
 *       - in: query
 *         name: has_spots_available
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Enhanced list of events with detailed information
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        // Parse query parameters
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)))
        const category = searchParams.get('category')
        const neighborhood = searchParams.get('neighborhood')
        const dateFrom = searchParams.get('date_from')
        const dateTo = searchParams.get('date_to')
        const search = searchParams.get('search')
        const sortBy = searchParams.get('sort_by') || 'date'
        const sortOrder = searchParams.get('sort_order') || 'asc'
        const priceMin = searchParams.get('price_min')
        const priceMax = searchParams.get('price_max')
        const hasSpotsAvailable = searchParams.get('has_spots_available')

        const skip = (page - 1) * limit

        // Build enhanced where clause
        const where: any = {
            status: 'ACTIVE'
        }

        if (category) {
            where.category = category
        }

        if (neighborhood) {
            where.neighborhoodId = neighborhood
        }

        if (dateFrom || dateTo) {
            where.startDate = {}
            if (dateFrom) {
                where.startDate.gte = new Date(dateFrom)
            }
            if (dateTo) {
                const endDate = new Date(dateTo)
                endDate.setHours(23, 59, 59, 999) // End of day
                where.startDate.lte = endDate
            }
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { location: { contains: search, mode: 'insensitive' } }
            ]
        }

        // Build order clause
        let orderBy: any = {}
        switch (sortBy) {
            case 'date':
                orderBy = { startDate: sortOrder }
                break
            case 'popularity':
                // Sort by registration count (requires aggregation)
                orderBy = { startDate: sortOrder } // Fallback for now
                break
            case 'price':
                // For future implementation when events have prices
                orderBy = { startDate: sortOrder } // Fallback for now
                break
            default:
                orderBy = { startDate: 'asc' }
        }

        const [events, total] = await Promise.all([
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
                    neighborhood: {
                        select: {
                            id: true,
                            name: true,
                            city: true,
                            postalCode: true
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
                            registrations: true
                        }
                    }
                },
                orderBy,
                skip,
                take: limit
            }),
            prisma.event.count({ where })
        ])

        // Transform to enhanced format
        const enhancedEvents = events.map(event => {
            const registeredCount = event.registrations.filter(r => r.status === 'REGISTERED').length
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
                    amount: 0, // Events are currently free
                    currency: "EUR",
                    is_free: true
                },
                images: event.imageUrl ? [{
                    id: "img_1",
                    url: event.imageUrl,
                    alt: event.title,
                    is_primary: true
                }] : [],
                tags: [], // To be implemented
                status: "published",
                registration_status: hasSpotsAvailable === 'true' && event.capacity 
                    ? (registeredCount < event.capacity ? "open" : "full") 
                    : "open",
                created_at: event.createdAt.toISOString(),
                updated_at: event.updatedAt.toISOString(),
                is_featured: false,
                recurring: event.isRecurring ? event.recurrencePattern : null
            }
        })

        // Filter by spots available if requested
        const filteredEvents = hasSpotsAvailable === 'true' 
            ? enhancedEvents.filter(event => 
                !event.attendees.max || event.attendees.current < event.attendees.max
            )
            : enhancedEvents

        const responseData = {
            events: filteredEvents,
            pagination: {
                current_page: page,
                total_pages: Math.ceil(total / limit),
                total_events: total,
                per_page: limit,
                has_next: page < Math.ceil(total / limit),
                has_prev: page > 1
            },
            filters_applied: {
                category,
                neighborhood,
                date_from: dateFrom,
                date_to: dateTo,
                search,
                sort_by: sortBy,
                sort_order: sortOrder
            }
        }

        return successResponse(responseData, 'Events retrieved successfully')

    } catch (error) {
        return handleApiError(error)
    }
}

// Keep existing POST method for event creation
export async function POST(request: NextRequest) {
    try {
        const user = await getAuthUser(request)

        if (!user?.isAdmin) {
            return errorResponse('Admin access required', 403)
        }

        const body = await request.json()
        const validatedData = createEventSchema.parse(body)

        // Verify neighborhood exists
        const neighborhood = await prisma.neighborhood.findUnique({
            where: { id: validatedData.neighborhoodId }
        })

        if (!neighborhood) {
            return errorResponse('Neighborhood not found', 404)
        }

        const event = await prisma.event.create({
            data: {
                ...validatedData,
                createdBy: user.id,
                startDate: new Date(validatedData.startDate),
                endDate: validatedData.endDate ? new Date(validatedData.endDate) : null
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true
                    }
                },
                neighborhood: {
                    select: {
                        id: true,
                        name: true,
                        city: true
                    }
                }
            }
        })

        return successResponse(event, 'Event created successfully', 201)

    } catch (error) {
        return handleApiError(error)
    }
}

// Helper function for category colors
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