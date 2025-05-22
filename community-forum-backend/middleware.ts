import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Skip middleware for public routes
    const publicRoutes = [
        '/api/auth/login',
        '/api/auth/register',
        '/api/events',
        '/api/events/categories',
        '/api/docs',
        '/api-docs'
    ]

    // Check if route is public or getting a specific event (GET /api/events/[id])
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route)) ||
        (pathname.match(/^\/api\/events\/[^\/]+$/) && request.method === 'GET')

    if (isPublicRoute) {
        return NextResponse.next()
    }

    // Protected routes that require authentication
    const protectedPaths = [
        '/api/users',
        '/api/events'
    ]

    const isProtectedPath = protectedPaths.some(path =>
        pathname.startsWith(path)
    )

    if (isProtectedPath) {
        const token = request.headers.get('authorization')?.replace('Bearer ', '')

        if (!token) {
            return NextResponse.json(
                { success: false, error: 'Authentication required' },
                { status: 401 }
            )
        }

        try {
            verifyToken(token)
        } catch (error) {
            return NextResponse.json(
                { success: false, error: 'Invalid or expired token' },
                { status: 401 }
            )
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/api/:path*'
    ]
}