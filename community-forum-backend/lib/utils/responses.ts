import { NextResponse } from 'next/server'

export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    error?: string
    message?: string
    pagination?: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export function successResponse<T>(
    data: T,
    message?: string,
    status: number = 200
): NextResponse<ApiResponse<T>> {
    return NextResponse.json({
        success: true,
        data,
        message
    }, { status })
}

export function errorResponse(
    error: string,
    status: number = 400
): NextResponse<ApiResponse> {
    return NextResponse.json({
        success: false,
        error
    }, { status })
}

export function paginatedResponse<T>(
    data: T[],
    pagination: {
        page: number
        limit: number
        total: number
    },
    message?: string
): NextResponse<ApiResponse<T[]>> {
    return NextResponse.json({
        success: true,
        data,
        message,
        pagination: {
            ...pagination,
            totalPages: Math.ceil(pagination.total / pagination.limit)
        }
    })
}