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

export interface PaginationParams {
    page: number
    limit: number
    total: number
}

export interface AuthUser {
    id: string
    email: string
    username: string
    fullName: string | null
    isAdmin: boolean
    neighborhood?: {
        id: string
        name: string
        city: string
    } | null
}