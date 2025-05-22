import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'
import { errorResponse } from './responses'

export function handleApiError(error: unknown): NextResponse {
    console.error('API Error:', error)

    if (error instanceof Error) {
        if (error.message === 'Authentication required') {
            return errorResponse('Authentication required', 401)
        }
        if (error.message === 'Admin access required') {
            return errorResponse('Admin access required', 403)
        }
    }

    if (error instanceof ZodError) {
        const messages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
        return errorResponse(`Validation error: ${messages.join(', ')}`, 400)
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2002':
                return errorResponse('A record with this information already exists', 409)
            case 'P2025':
                return errorResponse('Record not found', 404)
            case 'P2003':
                return errorResponse('Invalid reference to related record', 400)
            default:
                return errorResponse('Database error occurred', 500)
        }
    }

    return errorResponse('Internal server error', 500)
}