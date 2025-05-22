import { z } from 'zod'
import { EventCategory } from '@prisma/client'

export const createEventSchema = z.object({
    title: z.string()
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title must be less than 100 characters'),
    description: z.string()
        .min(10, 'Description must be at least 10 characters')
        .max(2000, 'Description must be less than 2000 characters'),
    category: z.nativeEnum(EventCategory),
    startDate: z.string().datetime('Invalid start date'),
    endDate: z.string().datetime('Invalid end date').optional(),
    location: z.string()
        .min(3, 'Location must be at least 3 characters')
        .max(200, 'Location must be less than 200 characters'),
    capacity: z.number().positive('Capacity must be positive').max(10000, 'Capacity too large').optional(),
    neighborhoodId: z.string().uuid('Invalid neighborhood ID'),
    isRecurring: z.boolean().default(false),
    recurrencePattern: z.object({
        frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
        interval: z.number().positive().optional(),
        endDate: z.string().datetime().optional()
    }).optional(),
    imageUrl: z.string().url('Invalid image URL').optional(),
    coordinates: z.object({
        lat: z.number(),
        lng: z.number()
    }).optional()
})

export const updateEventSchema = createEventSchema.partial()

export const eventRegistrationSchema = z.object({
    notes: z.string().max(500, 'Notes must be less than 500 characters').optional()
})

export const eventQuerySchema = z.object({
    page: z.coerce.number().positive().default(1),
    limit: z.coerce.number().positive().max(100).default(10),
    category: z.nativeEnum(EventCategory).optional(),
    neighborhoodId: z.string().uuid().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    search: z.string().optional()
})

export type CreateEventInput = z.infer<typeof createEventSchema>
export type UpdateEventInput = z.infer<typeof updateEventSchema>
export type EventRegistrationInput = z.infer<typeof eventRegistrationSchema>
export type EventQueryInput = z.infer<typeof eventQuerySchema>