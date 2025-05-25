// lib/validations/marketplace.ts

export interface CreateMarketListingInput {
    title: string
    description: string
    price?: number
    isFree: boolean
    condition: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'USED' | 'WORN'
    images: string[]
    categoryId: string
    neighborhoodId?: string
    tagIds?: string[]
}

export interface UpdateMarketListingInput {
    title?: string
    description?: string
    price?: number
    isFree?: boolean
    condition?: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'USED' | 'WORN'
    images?: string[]
    categoryId?: string
    neighborhoodId?: string
    tagIds?: string[]
}

export interface UpdateListingStatusInput {
    status: 'ACTIVE' | 'RESERVED' | 'SOLD' | 'CLOSED'
}

export interface CreateMarketRequestInput {
    message?: string
}

export interface UpdateRequestStatusInput {
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED'
}

export interface MarketplaceSearchInput {
    page?: number
    limit?: number
    categoryId?: string
    isFree?: boolean
    condition?: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'USED' | 'WORN'
    status?: 'ACTIVE' | 'RESERVED' | 'SOLD' | 'CLOSED'
    sellerId?: string
    neighborhoodId?: string
    q?: string
    minPrice?: number
    maxPrice?: number
    sortBy?: 'createdAt' | 'price' | 'title' | 'views'
    sortOrder?: 'asc' | 'desc'
}

// Simple validation functions
export function validateCreateMarketListing(data: any): { isValid: boolean; errors: string[]; data?: CreateMarketListingInput } {
    const errors: string[] = []

    if (!data.title || typeof data.title !== 'string' || data.title.length < 3) {
        errors.push('Title must be at least 3 characters')
    }
    if (data.title && data.title.length > 100) {
        errors.push('Title must be less than 100 characters')
    }

    if (!data.description || typeof data.description !== 'string' || data.description.length < 10) {
        errors.push('Description must be at least 10 characters')
    }
    if (data.description && data.description.length > 2000) {
        errors.push('Description must be less than 2000 characters')
    }

    if (typeof data.isFree !== 'boolean') {
        errors.push('isFree must be a boolean')
    }

    // Price validation
    if (!data.isFree && (!data.price || data.price <= 0)) {
        errors.push('Price is required for non-free items')
    }
    if (data.isFree && data.price && data.price > 0) {
        errors.push('Price should not be set for free items')
    }

    const validConditions = ['NEW', 'LIKE_NEW', 'GOOD', 'USED', 'WORN']
    if (!data.condition || !validConditions.includes(data.condition)) {
        errors.push('Valid condition is required')
    }

    if (!Array.isArray(data.images) || data.images.length === 0) {
        errors.push('At least one image is required')
    }
    if (data.images && data.images.length > 10) {
        errors.push('Maximum 10 images allowed')
    }

    if (!data.categoryId || typeof data.categoryId !== 'string') {
        errors.push('Category ID is required')
    }

    if (errors.length > 0) {
        return { isValid: false, errors }
    }

    return {
        isValid: true,
        errors: [],
        data: {
            title: data.title.trim(),
            description: data.description.trim(),
            price: data.isFree ? undefined : Number(data.price),
            isFree: data.isFree,
            condition: data.condition,
            images: data.images,
            categoryId: data.categoryId,
            neighborhoodId: data.neighborhoodId || undefined,
            tagIds: data.tagIds || []
        }
    }
}

export function validateUpdateMarketListing(data: any): { isValid: boolean; errors: string[]; data?: UpdateMarketListingInput } {
    const errors: string[] = []

    if (data.title !== undefined) {
        if (typeof data.title !== 'string' || data.title.length < 3 || data.title.length > 100) {
            errors.push('Title must be between 3 and 100 characters')
        }
    }

    if (data.description !== undefined) {
        if (typeof data.description !== 'string' || data.description.length < 10 || data.description.length > 2000) {
            errors.push('Description must be between 10 and 2000 characters')
        }
    }

    if (data.condition !== undefined) {
        const validConditions = ['NEW', 'LIKE_NEW', 'GOOD', 'USED', 'WORN']
        if (!validConditions.includes(data.condition)) {
            errors.push('Invalid condition')
        }
    }

    if (data.images !== undefined) {
        if (!Array.isArray(data.images) || data.images.length === 0 || data.images.length > 10) {
            errors.push('Images must be an array with 1-10 items')
        }
    }

    if (errors.length > 0) {
        return { isValid: false, errors }
    }

    const cleanData: UpdateMarketListingInput = {}
    if (data.title !== undefined) cleanData.title = data.title.trim()
    if (data.description !== undefined) cleanData.description = data.description.trim()
    if (data.price !== undefined) cleanData.price = Number(data.price)
    if (data.isFree !== undefined) cleanData.isFree = data.isFree
    if (data.condition !== undefined) cleanData.condition = data.condition
    if (data.images !== undefined) cleanData.images = data.images
    if (data.categoryId !== undefined) cleanData.categoryId = data.categoryId
    if (data.neighborhoodId !== undefined) cleanData.neighborhoodId = data.neighborhoodId
    if (data.tagIds !== undefined) cleanData.tagIds = data.tagIds

    return { isValid: true, errors: [], data: cleanData }
}

export function validateUpdateListingStatus(data: any): { isValid: boolean; errors: string[]; data?: UpdateListingStatusInput } {
    const validStatuses = ['ACTIVE', 'RESERVED', 'SOLD', 'CLOSED']

    if (!data.status || !validStatuses.includes(data.status)) {
        return { isValid: false, errors: ['Valid status is required'] }
    }

    return { isValid: true, errors: [], data: { status: data.status } }
}

export function validateCreateMarketRequest(data: any): { isValid: boolean; errors: string[]; data?: CreateMarketRequestInput } {
    const errors: string[] = []

    if (data.message !== undefined && (typeof data.message !== 'string' || data.message.length > 500)) {
        errors.push('Message must be less than 500 characters')
    }

    if (errors.length > 0) {
        return { isValid: false, errors }
    }

    return {
        isValid: true,
        errors: [],
        data: {
            message: data.message?.trim()
        }
    }
}

export function validateUpdateRequestStatus(data: any): { isValid: boolean; errors: string[]; data?: UpdateRequestStatusInput } {
    const validStatuses = ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED']

    if (!data.status || !validStatuses.includes(data.status)) {
        return { isValid: false, errors: ['Valid status is required'] }
    }

    return { isValid: true, errors: [], data: { status: data.status } }
}

export function parseMarketplaceSearch(searchParams: URLSearchParams): MarketplaceSearchInput {
    return {
        page: Math.max(1, parseInt(searchParams.get('page') || '1', 10)),
        limit: Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10))),
        categoryId: searchParams.get('categoryId') || undefined,
        isFree: searchParams.get('isFree') ? searchParams.get('isFree') === 'true' : undefined,
        condition: searchParams.get('condition') as any || undefined,
        status: (searchParams.get('status') as any) || 'ACTIVE',
        sellerId: searchParams.get('sellerId') || undefined,
        neighborhoodId: searchParams.get('neighborhoodId') || undefined,
        q: searchParams.get('q') || undefined,
        minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
        maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
        sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
        sortOrder: (searchParams.get('sortOrder') as any) || 'desc'
    }
}