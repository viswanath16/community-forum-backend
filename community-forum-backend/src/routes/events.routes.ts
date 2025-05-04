// src/routes/events.routes.ts
import { Router } from 'express';
import * as eventsController from '../controllers/events.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createEventSchema, updateEventSchema } from '../validators/events.validator';

const router = Router();

// Public routes
router.get('/', eventsController.getEvents);
router.get('/:id', eventsController.getEventById);

// Protected routes
router.post('/', authenticate, authorize(['ADMIN', 'MODERATOR', 'SUPER_ADMIN']), validate(createEventSchema), eventsController.createEvent);
router.put('/:id', authenticate, validate(updateEventSchema), eventsController.updateEvent);
router.delete('/:id', authenticate, eventsController.deleteEvent);
router.post('/:id/register', authenticate, eventsController.registerForEvent);
router.delete('/:id/register', authenticate, eventsController.cancelEventRegistration);

export default router;