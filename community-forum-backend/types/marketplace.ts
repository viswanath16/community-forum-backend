import {
    MarketListing,
    MarketRequest,
    MarketReview,
    Category,
    Tag,
    User,
    Neighborhood,
    ItemCondition,
    ListingStatus,
    RequestStatus,
    ReviewType
} from '@prisma/client'

export interface MarketListingWithDetails extends MarketListing {
    seller: Pick<User, 'id' | 'username' | 'fullName' | 'avatarUrl' | 'reputationScore'>
    category: Pick<Category, 'id' | 'name' | 'description'>
    neighborhood?: Pick<Neighborhood, 'id' | 'name' | 'city' | 'postalCode'>
    tags: (Tag & { marketListings: { id: string }[] })[]
    requests: MarketRequest[]
    reviews: MarketReview[]
    _count: {
        requests: number
        reviews: number
    }
}

export interface MarketListingItem extends MarketListing {
    seller: Pick<User, 'id' | 'username' | 'fullName' | 'avatarUrl' | 'reputationScore'>
    category: Pick<Category, 'id' | 'name'>
    neighborhood?: Pick<Neighborhood, 'id' | 'name' | 'city'>
    _count: {
        requests: number
    }
}

export interface MarketRequestWithDetails extends MarketRequest {
    listing: Pick<MarketListing, 'id' | 'title' | 'price' | 'isFree' | 'status' | 'images'>
    buyer: Pick<User, 'id' | 'username' | 'fullName' | 'avatarUrl'>
}

export interface MarketReviewWithDetails extends MarketReview {
    listing: Pick<MarketListing, 'id' | 'title'>
    seller: Pick<User, 'id' | 'username' | 'fullName'>
    buyer: Pick<User, 'id' | 'username' | 'fullName'>
}

export interface CreateMarketListingPayload {
    title: string
    description: string
    price?: number
    isFree: boolean
    condition: ItemCondition
    images: string[]
    categoryId: string
    neighborhoodId?: string
    tagIds?: string[]
}

export interface UpdateMarketListingPayload {
    title?: string
    description?: string
    price?: number
    isFree?: boolean
    condition?: ItemCondition
    images?: string[]
    categoryId?: string
    neighborhoodId?: string
    tagIds?: string[]
}

export interface CreateMarketRequestPayload {
    message?: string
}

export interface UpdateRequestStatusPayload {
    status: RequestStatus
}

export interface UpdateListingStatusPayload {
    status: ListingStatus
}

export interface CreateReviewPayload {
    rating: number
    comment?: string
    type: ReviewType
}

export interface MarketplaceSearchParams {
    page?: number
    limit?: number
    categoryId?: string
    isFree?: boolean
    condition?: ItemCondition
    status?: ListingStatus
    sellerId?: string
    neighborhoodId?: string
    q?: string
    minPrice?: number
    maxPrice?: number
    sortBy?: 'createdAt' | 'price' | 'title' | 'views'
    sortOrder?: 'asc' | 'desc'
}

export interface UserMarketplaceActivity {
    listings: MarketListingItem[]
    buyRequests: MarketRequestWithDetails[]
}

export interface CategoryWithListingCount extends Category {
    _count: {
        marketListings: number
    }
}