import { NextRequest, NextResponse } from 'next/server'

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

    // For protected routes, let the individual route handlers handle authentication
    // This removes the duplicate token verification issue
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/api/:path*'
    ]
}