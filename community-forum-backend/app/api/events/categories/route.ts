// app/api/events/categories/route.ts

import { NextRequest } from 'next/server'
import { EventCategory } from '@prisma/client'
import { successResponse } from '@/lib/utils/responses'
import { handleApiError } from '@/lib/utils/error-handler'

/**
 * @swagger
 * /api/events/categories:
 *   get:
 *     summary: Get all event categories with enhanced information
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of enhanced event categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "community-service"
 *                       name:
 *                         type: string
 *                         example: "Community Service"
 *                       description:
 *                         type: string
 *                         example: "Events focused on helping the community"
 *                       color:
 *                         type: string
 *                         example: "#2ECC71"
 *                       icon:
 *                         type: string
 *                         example: "users"
 *                       eventCount:
 *                         type: integer
 *                         example: 12
 */
export async function GET(request: NextRequest) {
    try {
        // Enhanced category mapping with colors and icons
        // Update the categoryMapping object in app/api/events/categories/route.ts
const categoryMapping = {
    SPORTS: {
        id: 'sports',
        name: 'Sports',
        description: 'Sports and recreational activities',
        color: '#E74C3C',
        icon: 'activity'
    },
    CULTURAL: {
        id: 'cultural',
        name: 'Cultural',
        description: 'Cultural events and celebrations',
        color: '#9B59B6',
        icon: 'palette'
    },
    EDUCATIONAL: {
        id: 'educational',
        name: 'Education',
        description: 'Learning and educational activities',
        color: '#FF6B35',
        icon: 'book'
    },
    VOLUNTEER: {
        id: 'community-service',
        name: 'Community Service',
        description: 'Events focused on helping the community',
        color: '#2ECC71',
        icon: 'users'
    },
    SOCIAL: {
        id: 'social',
        name: 'Social',
        description: 'Social gatherings and networking',
        color: '#3498DB',
        icon: 'coffee'
    },
    BUSINESS: {
        id: 'business',
        name: 'Business',
        description: 'Professional and business events',
        color: '#34495E',
        icon: 'briefcase'
    },
    HEALTH: {
        id: 'health',
        name: 'Health & Wellness',
        description: 'Health and wellness activities',
        color: '#1ABC9C',
        icon: 'heart'
    },
    ENVIRONMENT: {
        id: 'environment',
        name: 'Environment',
        description: 'Environmental and sustainability events',
        color: '#27AE60',
        icon: 'leaf'
    },
    TECHNOLOGY: {
        id: 'technology',
        name: 'Technology',
        description: 'Tech meetups and digital events',
        color: '#8E44AD',
        icon: 'laptop'
    },
    // ADD these missing categories:
    MARKET: {
        id: 'market',
        name: 'Market',
        description: 'Local markets and trading events',
        color: '#4A90E2',
        icon: 'shopping-bag'
    },
    WORKSHOP: {
        id: 'workshop',
        name: 'Workshop',
        description: 'Hands-on workshops and training',
        color: '#F39C12',
        icon: 'tool'
    },
    MEETING: {
        id: 'meeting',
        name: 'Meeting',
        description: 'Community meetings and discussions',
        color: '#7F8C8D',
        icon: 'users'
    },
    CELEBRATION: {
        id: 'celebration',
        name: 'Celebration',
        description: 'Festivals and celebrations',
        color: '#E67E22',
        icon: 'star'
    },
    CLEANUP: {
        id: 'cleanup',
        name: 'Cleanup',
        description: 'Environmental cleanup activities',
        color: '#16A085',
        icon: 'trash-2'
    },
    OTHER: {
        id: 'other',
        name: 'Other',
        description: 'Other community events',
        color: '#95A5A6',
        icon: 'more-horizontal'
    }
} as const

        // Get all categories with their event counts
        const categories = Object.values(EventCategory).map(category => ({
            ...categoryMapping[category],
            value: category
        }))

        return successResponse(categories, 'Categories retrieved successfully')

    } catch (error) {
        return handleApiError(error)
    }
}