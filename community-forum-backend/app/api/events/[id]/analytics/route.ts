// app/api/events/[id]/analytics/route.ts

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, requireAuth } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/utils/responses'
import { handleApiError } from '@/lib/utils/error-handler'

/**
 * @swagger
 * /api/events/{id}/analytics:
 *   get:
 *     summary: Get event analytics for organizers
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event analytics data
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
 *                     views:
 *                       type: integer
 *                       example: 156
 *                     registrations:
 *                       type: integer
 *                       example: 12
 *                     conversion_rate:
 *                       type: number
 *                       example: 7.7
 *                     demographics:
 *                       type: object
 *                     registration_timeline:
 *                       type: array
 *       403:
 *         description: Forbidden - Not the organizer
 *       404:
 *         description: Event not found
 */
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const authUser = await getAuthUser(request)
        requireAuth(authUser)

        const user = authUser!
        const { id } = await context.params

        // Get event and verify ownership
        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                registrations: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                fullName: true,
                                createdAt: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        registrations: true
                    }
                }
            }
        })

        if (!event) {
            return errorResponse('Event not found', 404)
        }

        // Check if user is the organizer or admin
        if (event.createdBy !== user.id && !user.isAdmin) {
            return errorResponse('Forbidden - Not the organizer', 403)
        }

        // Calculate analytics
        const totalRegistrations = event.registrations.length
        const confirmedRegistrations = event.registrations.filter(r => r.status === 'REGISTERED').length
        const waitlistCount = event.registrations.filter(r => r.status === 'WAITLIST').length
        const cancelledCount = event.registrations.filter(r => r.status === 'CANCELLED').length

        // Mock views data (would be tracked in real implementation)
        const views = Math.floor(Math.random() * 200) + 50

        // Calculate conversion rate
        const conversionRate = views > 0 ? (totalRegistrations / views) * 100 : 0

        // Demographics analysis (mock data based on user creation dates)
        const currentDate = new Date()
        const demographics = {
            age_groups: {
                "18-25": 0,
                "26-35": 0,
                "36-50": 0,
                "51+": 0
            },
            registration_status: {
                confirmed: confirmedRegistrations,
                waitlist: waitlistCount,
                cancelled: cancelledCount
            }
        }

        // Simple age estimation based on account creation (mock)
        event.registrations.forEach(reg => {
            const accountAge = currentDate.getFullYear() - reg.user.createdAt.getFullYear()
            if (accountAge <= 2) demographics.age_groups["18-25"]++
            else if (accountAge <= 4) demographics.age_groups["26-35"]++
            else if (accountAge <= 6) demographics.age_groups["36-50"]++
            else demographics.age_groups["51+"]++
        })

        // Registration timeline (group by date)
        const registrationTimeline: { [key: string]: number } = {}
        event.registrations.forEach(reg => {
            const date = reg.registeredAt.toISOString().split('T')[0]
            registrationTimeline[date] = (registrationTimeline[date] || 0) + 1
        })

        const timelineArray = Object.entries(registrationTimeline)
            .map(([date, count]) => ({ date, registrations: count }))
            .sort((a, b) => a.date.localeCompare(b.date))

        // Traffic sources (mock data)
        const trafficSources = {
            direct: Math.floor(views * 0.4),
            social_media: Math.floor(views * 0.3),
            search: Math.floor(views * 0.2),
            referral: Math.floor(views * 0.1)
        }

        // Peak activity times (mock data)
        const peakTimes = {
            hours: {
                "9": Math.floor(views * 0.1),
                "12": Math.floor(views * 0.15),
                "18": Math.floor(views * 0.2),
                "20": Math.floor(views * 0.25)
            },
            days: {
                "monday": Math.floor(views * 0.1),
                "tuesday": Math.floor(views * 0.12),
                "wednesday": Math.floor(views * 0.15),
                "thursday": Math.floor(views * 0.18),
                "friday": Math.floor(views * 0.2),
                "saturday": Math.floor(views * 0.15),
                "sunday": Math.floor(views * 0.1)
            }
        }

        // Engagement metrics
        const engagementMetrics = {
            average_time_on_page: "2:34", // Mock
            bounce_rate: 0.35, // Mock
            shares: Math.floor(Math.random() * 20),
            comments: 0, // Would come from comments system
            favorites: Math.floor(Math.random() * 30)
        }

        const analyticsData = {
            overview: {
                views,
                registrations: totalRegistrations,
                confirmed_registrations: confirmedRegistrations,
                conversion_rate: Math.round(conversionRate * 100) / 100,
                capacity_utilization: event.capacity 
                    ? Math.round((confirmedRegistrations / event.capacity) * 100) 
                    : null
            },
            demographics,
            registration_timeline: timelineArray,
            traffic_sources: trafficSources,
            peak_activity: peakTimes,
            engagement: engagementMetrics,
            performance_metrics: {
                total_views: views,
                unique_visitors: Math.floor(views * 0.7), // Mock
                returning_visitors: Math.floor(views * 0.3), // Mock
                mobile_traffic: Math.floor(views * 0.6), // Mock
                desktop_traffic: Math.floor(views * 0.4) // Mock
            },
            generated_at: new Date().toISOString(),
            period: {
                start: event.createdAt.toISOString(),
                end: new Date().toISOString()
            }
        }

        return successResponse(analyticsData, 'Event analytics retrieved successfully')

    } catch (error) {
        return handleApiError(error)
    }
}