// src/routes/index.ts
import { Router } from 'express';
import eventsRoutes from './events.routes';
// Import other route files here

const router = Router();

router.use('/events', eventsRoutes);
// Add other routes here

export default router;