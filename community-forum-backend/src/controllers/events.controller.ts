// src/controllers/events.controller.ts
import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { success, error, StatusCode } from '../utils/responses';
import * as eventService from '../services/events.service';

export const getEvents = async (req: Request, res: Response) => {
    try {
        const filters: eventService.EventFilters = {
            categoryId: req.query.categoryId as string | undefined,
            neighborhoodId: req.query.neighborhoodId as string | undefined,
            isPublished: req.query.isPublished === 'true',
        };

        if (req.query.startAfter) {
            filters.startAfter = new Date(req.query.startAfter as string);
        }

        if (req.query.startBefore) {
            filters.startBefore = new Date(req.query.startBefore as string);
        }

        const events = await eventService.getEvents(filters);
        return success(res, 'Events retrieved successfully', events);
    } catch (err) {
        return error(res, 'Failed to retrieve events', err);
    }
};

export const getEventById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const event = await eventService.getEventById(id);
        return success(res, 'Event retrieved successfully', event);
    } catch (err) {
        if (err instanceof Error && err.message === 'Event not found') {
            return error(res, 'Event not found', null, StatusCode.NOT_FOUND);
        }
        return error(res, 'Failed to retrieve event', err);
    }
};

export const createEvent = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return error(res, 'Unauthorized', null, StatusCode.UNAUTHORIZED);
        }

        const eventData: eventService.CreateEventInput = req.body;
        const event = await eventService.createEvent(eventData, req.user.id);
        return success(res, 'Event created successfully', event, StatusCode.CREATED);
    } catch (err) {
        return error(res, 'Failed to create event', err);
    }
};

export const updateEvent = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const eventData = req.body;

        // Check if event exists and if user has permission
        const existingEvent = await eventService.getEventById(id);

        if (!req.user) {
            return error(res, 'Unauthorized', null, StatusCode.UNAUTHORIZED);
        }

        // Only the creator or admin/moderator can update the event
        if (existingEvent.creator.id !== req.user.id && !['ADMIN', 'MODERATOR', 'SUPER_ADMIN'].includes(req.user.role)) {
            return error(res, 'Forbidden', null, StatusCode.FORBIDDEN);
        }

        const updatedEvent = await eventService.updateEvent(id, eventData);
        return success(res, 'Event updated successfully', updatedEvent);
    } catch (err) {
        if (err instanceof Error && err.message === 'Event not found') {
            return error(res, 'Event not found', null, StatusCode.NOT_FOUND);
        }
        return error(res, 'Failed to update event', err);
    }
};

export const deleteEvent = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // Check if event exists and if user has permission
        const existingEvent = await eventService.getEventById(id);

        if (!req.user) {
            return error(res, 'Unauthorized', null, StatusCode.UNAUTHORIZED);
        }

        // Only the creator or admin/moderator can delete the event
        if (existingEvent.creator.id !== req.user.id && !['ADMIN', 'MODERATOR', 'SUPER_ADMIN'].includes(req.user.role)) {
            return error(res, 'Forbidden', null, StatusCode.FORBIDDEN);
        }

        await eventService.deleteEvent(id);
        return success(res, 'Event deleted successfully');
    } catch (err) {
        if (err instanceof Error && err.message === 'Event not found') {
            return error(res, 'Event not found', null, StatusCode.NOT_FOUND);
        }
        return error(res, 'Failed to delete event', err);
    }
};

export const registerForEvent = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        if (!req.user) {
            return error(res, 'Unauthorized', null, StatusCode.UNAUTHORIZED);
        }

        // Check if event exists
        await eventService.getEventById(id);

        const registration = await eventService.registerForEvent(id, req.user.id);
        return success(res, 'Registered for event successfully', registration, StatusCode.CREATED);
    } catch (err) {
        if (err instanceof Error && err.message === 'Event not found') {
            return error(res, 'Event not found', null, StatusCode.NOT_FOUND);
        }
        return error(res, 'Failed to register for event', err);
    }
};

export const cancelEventRegistration = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        if (!req.user) {
            return error(res, 'Unauthorized', null, StatusCode.UNAUTHORIZED);
        }

        // Check if event exists
        await eventService.getEventById(id);

        await eventService.cancelEventRegistration(id, req.user.id);
        return success(res, 'Event registration canceled successfully');
    } catch (err) {
        if (err instanceof Error && err.message === 'Event not found') {
            return error(res, 'Event not found', null, StatusCode.NOT_FOUND);
        }
        return error(res, 'Failed to cancel event registration', err);
    }
};
