// src/services/events.service.ts
import prisma from '../prisma/client';
import { Prisma } from '@prisma/client';

export interface EventFilters {
    categoryId?: string;
    neighborhoodId?: string;
    isPublished?: boolean;
    startAfter?: Date;
    startBefore?: Date;
    creatorId?: string;
}

export interface CreateEventInput {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    location?: string | null;
    address?: string | null;
    isOnline: boolean;
    meetingUrl?: string | null;
    capacity?: number | null;
    isFree: boolean;
    price?: number | null;
    image?: string | null;
    categoryId: string;
    neighborhoodId?: string | null;
    interestIds?: string[];
}

export const getEvents = async (filters: EventFilters = {}) => {
    const where: Prisma.EventWhereInput = {};

    // Apply filters
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.neighborhoodId) where.neighborhoodId = filters.neighborhoodId;
    if (filters.isPublished !== undefined) where.isPublished = filters.isPublished;
    if (filters.creatorId) where.creatorId = filters.creatorId;

    if (filters.startAfter || filters.startBefore) {
        where.startDate = {};
        if (filters.startAfter) where.startDate.gte = filters.startAfter;
        if (filters.startBefore) where.startDate.lte = filters.startBefore;
    }

    const events = await prisma.event.findMany({
        where,
        include: {
            creator: {
                select: {
                    id: true,
                    email: true,
                    profile: {
                        select: {
                            displayName: true,
                            avatar: true,
                        },
                    },
                },
            },
            category: true,
            neighborhood: true,
            interests: true,
            _count: {
                select: {
                    attendees: true,
                },
            },
        },
        orderBy: {
            startDate: 'asc',
        },
    });

    return events;
};

export const getEventById = async (id: string) => {
    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            creator: {
                select: {
                    id: true,
                    email: true,
                    profile: {
                        select: {
                            displayName: true,
                            avatar: true,
                        },
                    },
                },
            },
            category: true,
            neighborhood: true,
            interests: true,
            attendees: {
                include: {
                    user: {
                        select: {
                            id: true,
                            profile: {
                                select: {
                                    displayName: true,
                                    avatar: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!event) {
        throw new Error('Event not found');
    }

    return event;
};

export const createEvent = async (data: CreateEventInput, creatorId: string) => {
    const { interestIds, ...eventData } = data;

    return prisma.event.create({
        data: {
            ...eventData,
            creator: {
                connect: { id: creatorId },
            },
            ...(interestIds && interestIds.length > 0
                ? {
                    interests: {
                        connect: interestIds.map((id) => ({ id })),
                    },
                }
                : {}),
        },
        include: {
            creator: {
                select: {
                    id: true,
                    email: true,
                    profile: {
                        select: {
                            displayName: true,
                            avatar: true,
                        },
                    },
                },
            },
            category: true,
            neighborhood: true,
            interests: true,
        },
    });
};

export const updateEvent = async (id: string, data: Partial<CreateEventInput>) => {
    const { interestIds, ...eventData } = data;

    return prisma.event.update({
        where: { id },
        data: {
            ...eventData,
            ...(interestIds
                ? {
                    interests: {
                        set: interestIds.map((id) => ({ id })),
                    },
                }
                : {}),
        },
        include: {
            creator: {
                select: {
                    id: true,
                    email: true,
                    profile: {
                        select: {
                            displayName: true,
                            avatar: true,
                        },
                    },
                },
            },
            category: true,
            neighborhood: true,
            interests: true,
        },
    });
};

export const deleteEvent = async (id: string) => {
    return prisma.event.delete({
        where: { id },
    });
};

export const registerForEvent = async (eventId: string, userId: string) => {
    return prisma.eventAttendee.create({
        data: {
            event: {
                connect: { id: eventId },
            },
            user: {
                connect: { id: userId },
            },
        },
    });
};

export const cancelEventRegistration = async (eventId: string, userId: string) => {
    return prisma.eventAttendee.deleteMany({
        where: {
            eventId,
            userId,
        },
    });
};