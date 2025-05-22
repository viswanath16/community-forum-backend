import { Event, EventRegistration, User, Neighborhood, EventCategory, EventStatus, RegistrationStatus } from '@prisma/client'

export interface EventWithDetails extends Event {
    creator: Pick<User, 'id' | 'username' | 'fullName' | 'avatarUrl'>
    neighborhood: Pick<Neighborhood, 'id' | 'name' | 'city' | 'postalCode'>
    registrations: (EventRegistration & {
        user: Pick<User, 'id' | 'username' | 'fullName' | 'avatarUrl'>
    })[]
    _count: {
        registrations: number
    }
}

export interface EventListItem extends Event {
    creator: Pick<User, 'id' | 'username' | 'fullName' | 'avatarUrl'>
    neighborhood: Pick<Neighborhood, 'id' | 'name' | 'city'>
    _count: {
        registrations: number
    }
}

export interface CreateEventPayload {
    title: string
    description: string
    category: EventCategory
    startDate: string
    endDate?: string
    location: string
    capacity?: number
    neighborhoodId: string
    isRecurring?: boolean
    recurrencePattern?: {
        frequency?: 'daily' | 'weekly' | 'monthly'
        interval?: number
        endDate?: string
    }
    imageUrl?: string
    coordinates?: {
        lat: number
        lng: number
    }
}