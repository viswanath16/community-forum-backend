// src/routes/marketplace.routes.ts (updated with validation)
import { Router } from 'express';
import * as marketplaceController from '../controllers/marketplace.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
    createListingSchema,
    updateListingSchema,
    changeStatusSchema,
    createRequestSchema,
    updateRequestStatusSchema
} from '../validators/marketplace.validator';

const router = Router();

// Public routes
router.get('/', marketplaceController.getListings);
router.get('/categories', marketplaceController.getCategories);
router.get('/search', marketplaceController.searchListings);
router.get('/:id', marketplaceController.getListingById);

// Protected routes
router.post('/', authenticate, validate(createListingSchema), marketplaceController.createListing);
router.put('/:id', authenticate, validate(updateListingSchema), marketplaceController.updateListing);
router.delete('/:id', authenticate, marketplaceController.deleteListing);
router.put('/:id/status', authenticate, validate(changeStatusSchema), marketplaceController.changeListingStatus);

// Requests
router.post('/:id/request', authenticate, validate(createRequestSchema), marketplaceController.createRequest);
router.get('/:id/requests', authenticate, marketplaceController.getRequestsForListing);
router.get('/requests', authenticate, marketplaceController.getUserRequests);
router.put('/:id/request/:requestId', authenticate, validate(updateRequestStatusSchema), marketplaceController.updateRequestStatus);
router.delete('/request/:requestId/cancel', authenticate, marketplaceController.cancelRequest);

// User activity
router.get('/activity', authenticate, marketplaceController.getUserMarketplaceActivity);

export default router;