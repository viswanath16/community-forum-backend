// src/routes/index.ts (updated)
import { Router } from 'express';
import authRoutes from './auth.routes';
import eventsRoutes from './events.routes';
import marketplaceRoutes from './marketplace.routes';
import postsRoutes from './posts.routes';
// Import other route files here

const router = Router();

router.use('/auth', authRoutes);
router.use('/events', eventsRoutes);
router.use('/marketplace', marketplaceRoutes);
router.use('/posts', postsRoutes);
// Add other routes here

export default router;