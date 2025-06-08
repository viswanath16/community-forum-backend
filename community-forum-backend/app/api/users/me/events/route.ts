// app/api/users/me/events/route.ts

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, requireAuth } from '@/lib/auth'
import { successResponse } from '@/lib/utils/responses'
import { handleApiError } from '@/lib/utils/error-handler'

/**
 * @swagger
 * /api/users/me/events:
 *   get:
 *     summary: Get current user's event activities
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [organized, registered, past, all]
 *           default: all
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
 *         description: User's event activities
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
 *                     organized:
 *                       type: array
 *                       items:
 *                         type: object
 *                     registered:
 *                       type: array
 *                       items:
 *                         type: object
 *                     past:
 *                       type: array
 *                       items:
 *                         type: object
 *       401:
 *         description: Authentication required
 */
export async function GET(request: NextRequest) {
    try {
        const authUser = await getAuthUser(request)
        requireAuth(authUser)

        const user = authUser!
        const { searchParams } = new URL(request.url)
        
        const type = searchParams.get('type') || 'all'
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))
        const skip = (page - 1) * limit

        const now = new Date()

        let organized: any[] = []
        let registered: any[] = []
        let past: any[] = []

        if (type === 'organized' || type === 'all') {
            organized = await prisma.event.findMany({
                where: {
                    createdBy: user.id,
                    startDate: { gte: now }
                },
                include: {
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
                orderBy: { startDate: 'asc' },
                skip: type === 'organized' ? skip : 0,
                take: type === 'organized' ? limit : 10
            })
        }

        if (type === 'registered' || type === 'all') {
            const registrations = await prisma.eventRegistration.findMany({
                where: {
                    userId: user.id,
                    event: {
                        startDate: { gte: now }
                    }
                },
                include: {
                    event: {
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
                            }
                        }
                    }
                },
                orderBy: { event: { startDate: 'asc' } },
                skip: type === 'registered' ? skip : 0,
                take: type === 'registered' ? limit : 10
            })

            registered = registrations.map(reg => ({
                event: {
                    ...reg.event,
                    registration_status: reg.status
                },
                registration: {
                    id: reg.id,
                    status: reg.status,
                    registered_at: reg.registeredAt,
                    notes: reg.notes
                }
            }))
        }

        if (type === 'past' || type === 'all') {
            // Get past organized events
            const pastOrganized = await prisma.event.findMany({
                where: {
                    createdBy: user.id,
                    startDate: { lt: now }
                },
                include: {
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
                orderBy: { startDate: 'desc' },
                take: 5
            })

            // Get past registered events
            const pastRegistrations = await prisma.eventRegistration.findMany({
                where: {
                    userId: user.id,
                    event: {
                        startDate: { lt: now }
                    }
                },
                include: {
                    event: {
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
                            }
                        }
                    }
                },
                orderBy: { event: { startDate: 'desc' } },
                take: 5
            })

            past = [
                ...pastOrganized.map(event => ({ 
                    event, 
                    type: 'organized' as const
                })),
                ...pastRegistrations.map(reg => ({ 
                    event: reg.event, 
                    type: 'registered' as const,
                    registration: {
                        id: reg.id,
                        status: reg.status,
                        registered_at: reg.registeredAt,
                        notes: reg.notes
                    }
                }))
            ].sort((a, b) => 
                new Date(b.event.startDate).getTime() - new Date(a.event.startDate).getTime()
            ).slice(0, type === 'past' ? limit : 10)
        }

        // Format organized events
        const formattedOrganized = organized.map(event => ({
            event: {
                id: event.id,
                title: event.title,
                description: event.description,
                date: event.startDate.toISOString().split('T')[0],
                time: event.startDate.toTimeString().substring(0, 5),
                location: event.location,
                category: event.category,
                attendees_count: event._count.registrations,
                max_attendees: event.capacity,
                status: event.status,
                neighborhood: event.neighborhood
            }
        }))

        // Calculate statistics
        const stats = {
            total_organized: await prisma.event.count({
                where: { createdBy: user.id }
            }),
            total_registered: await prisma.eventRegistration.count({
                where: { userId: user.id }
            }),
            upcoming_organized: organized.length,
            upcoming_registered: registered.length
        }

        const responseData = {
            organized: formattedOrganized,
            registered: registered,
            past: past,
            statistics: stats,
            pagination: {
                current_page: page,
                per_page: limit,
                has_next: false, // Would need more logic for proper pagination
                has_prev: page > 1
            }
        }

        return successResponse(responseData, 'User events retrieved successfully')

    } catch (error) {
        return handleApiError(error)
    }
}