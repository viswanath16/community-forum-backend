// src/controllers/marketplace.controller.ts
import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { success, error, StatusCode } from '../utils/responses';
import * as marketplaceService from '../services/marketplace.service';

/**
 * Get marketplace listings with optional filters
 */
export const getListings = async (req: Request, res: Response) => {
    try {
        const filters: marketplaceService.MarketListingFilters = {
            categoryId: req.query.categoryId as string | undefined,
            isFree: req.query.isFree === 'true',
            condition: req.query.condition as any,
            status: req.query.status as any || 'ACTIVE',
            sellerId: req.query.sellerId as string | undefined,
            neighborhoodId: req.query.neighborhoodId as string | undefined,
            query: req.query.q as string | undefined,
        };

        const listings = await marketplaceService.getListings(filters);
        return success(res, 'Listings retrieved successfully', listings);
    } catch (err) {
        return error(res, 'Failed to retrieve listings', err);
    }
};

/**
 * Get a specific marketplace listing by ID
 */
export const getListingById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const listing = await marketplaceService.getListingById(id);
        return success(res, 'Listing retrieved successfully', listing);
    } catch (err) {
        if (err instanceof Error && err.message === 'Listing not found') {
            return error(res, 'Listing not found', null, StatusCode.NOT_FOUND);
        }
        return error(res, 'Failed to retrieve listing', err);
    }
};

/**
 * Create a new marketplace listing
 */
export const createListing = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return error(res, 'Unauthorized', null, StatusCode.UNAUTHORIZED);
        }

        const listingData: marketplaceService.CreateMarketListingInput = req.body;
        const listing = await marketplaceService.createListing(listingData, req.user.id);
        return success(res, 'Listing created successfully', listing, StatusCode.CREATED);
    } catch (err) {
        return error(res, 'Failed to create listing', err);
    }
};

/**
 * Update an existing marketplace listing
 */
export const updateListing = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return error(res, 'Unauthorized', null, StatusCode.UNAUTHORIZED);
        }

        const { id } = req.params;
        const listingData = req.body;

        // Check if listing exists and if user has permission
        const existingListing = await marketplaceService.getListingById(id);

        // Only the seller or admin/moderator can update the listing
        if (existingListing.seller.id !== req.user.id && !['ADMIN', 'MODERATOR', 'SUPER_ADMIN'].includes(req.user.role)) {
            return error(res, 'You do not have permission to update this listing', null, StatusCode.FORBIDDEN);
        }

        const updatedListing = await marketplaceService.updateListing(id, listingData);
        return success(res, 'Listing updated successfully', updatedListing);
    } catch (err) {
        if (err instanceof Error && err.message === 'Listing not found') {
            return error(res, 'Listing not found', null, StatusCode.NOT_FOUND);
        }
        return error(res, 'Failed to update listing', err);
    }
};

/**
 * Delete a marketplace listing
 */
export const deleteListing = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return error(res, 'Unauthorized', null, StatusCode.UNAUTHORIZED);
        }

        const { id } = req.params;

        // Check if listing exists and if user has permission
        const existingListing = await marketplaceService.getListingById(id);

        // Only the seller or admin/moderator can delete the listing
        if (existingListing.seller.id !== req.user.id && !['ADMIN', 'MODERATOR', 'SUPER_ADMIN'].includes(req.user.role)) {
            return error(res, 'You do not have permission to delete this listing', null, StatusCode.FORBIDDEN);
        }

        await marketplaceService.deleteListing(id);
        return success(res, 'Listing deleted successfully');
    } catch (err) {
        if (err instanceof Error && err.message === 'Listing not found') {
            return error(res, 'Listing not found', null, StatusCode.NOT_FOUND);
        }
        return error(res, 'Failed to delete listing', err);
    }
};

/**
 * Change the status of a listing (e.g., mark as sold or reserved)
 */
export const changeListingStatus = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return error(res, 'Unauthorized', null, StatusCode.UNAUTHORIZED);
        }

        const { id } = req.params;
        const { status } = req.body;

        // Check if listing exists and if user has permission
        const existingListing = await marketplaceService.getListingById(id);

        // Only the seller or admin/moderator can change the listing status
        if (existingListing.seller.id !== req.user.id && !['ADMIN', 'MODERATOR', 'SUPER_ADMIN'].includes(req.user.role)) {
            return error(res, 'You do not have permission to update this listing', null, StatusCode.FORBIDDEN);
        }

        const updatedListing = await marketplaceService.updateListingStatus(id, status);
        return success(res, `Listing marked as ${status.toLowerCase()} successfully`, updatedListing);
    } catch (err) {
        if (err instanceof Error && err.message === 'Listing not found') {
            return error(res, 'Listing not found', null, StatusCode.NOT_FOUND);
        }
        if (err instanceof Error && err.message === 'Invalid status') {
            return error(res, 'Invalid status provided', null, StatusCode.BAD_REQUEST);
        }
        return error(res, 'Failed to update listing status', err);
    }
};

/**
 * Create a request to purchase/reserve an item
 */
export const createRequest = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return error(res, 'Unauthorized', null, StatusCode.UNAUTHORIZED);
        }

        const { id } = req.params;
        const { message } = req.body;

        // Check if listing exists
        const listing = await marketplaceService.getListingById(id);

        // Can't request your own listing
        if (listing.seller.id === req.user.id) {
            return error(res, 'You cannot request your own listing', null, StatusCode.BAD_REQUEST);
        }

        // Listing must be active
        if (listing.status !== 'ACTIVE') {
            return error(res, `This item is currently ${listing.status.toLowerCase()} and not available`, null, StatusCode.BAD_REQUEST);
        }

        const request = await marketplaceService.createRequest(id, req.user.id, message);
        return success(res, 'Request created successfully', request, StatusCode.CREATED);
    } catch (err) {
        if (err instanceof Error && err.message === 'Listing not found') {
            return error(res, 'Listing not found', null, StatusCode.NOT_FOUND);
        }
        return error(res, 'Failed to create request', err);
    }
};

/**
 * Get all requests for a listing (for sellers)
 */
export const getRequestsForListing = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return error(res, 'Unauthorized', null, StatusCode.UNAUTHORIZED);
        }

        const { id } = req.params;

        // Check if listing exists and if user is the seller
        const listing = await marketplaceService.getListingById(id);

        // Only the seller or admin/moderator can view requests
        if (listing.seller.id !== req.user.id && !['ADMIN', 'MODERATOR', 'SUPER_ADMIN'].includes(req.user.role)) {
            return error(res, 'You do not have permission to view these requests', null, StatusCode.FORBIDDEN);
        }

        const requests = await marketplaceService.getRequestsForListing(id);
        return success(res, 'Requests retrieved successfully', requests);
    } catch (err) {
        if (err instanceof Error && err.message === 'Listing not found') {
            return error(res, 'Listing not found', null, StatusCode.NOT_FOUND);
        }
        return error(res, 'Failed to retrieve requests', err);
    }
};

/**
 * Get all requests made by the current user
 */
export const getUserRequests = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return error(res, 'Unauthorized', null, StatusCode.UNAUTHORIZED);
        }

        const requests = await marketplaceService.getUserRequests(req.user.id);
        return success(res, 'Requests retrieved successfully', requests);
    } catch (err) {
        return error(res, 'Failed to retrieve requests', err);
    }
};

/**
 * Update a request status (accept/reject)
 */
export const updateRequestStatus = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return error(res, 'Unauthorized', null, StatusCode.UNAUTHORIZED);
        }

        const { id, requestId } = req.params;
        const { status } = req.body;

        // Check if listing exists and if user is the seller
        const listing = await marketplaceService.getListingById(id);

        // Only the seller can update request status
        if (listing.seller.id !== req.user.id) {
            return error(res, 'You do not have permission to update this request', null, StatusCode.FORBIDDEN);
        }

        // Validate status
        if (!['ACCEPTED', 'REJECTED', 'COMPLETED'].includes(status)) {
            return error(res, 'Invalid status. Status must be ACCEPTED, REJECTED, or COMPLETED', null, StatusCode.BAD_REQUEST);
        }

        const updatedRequest = await marketplaceService.updateRequestStatus(requestId, status);

        // If request is accepted, update listing status to RESERVED
        if (status === 'ACCEPTED') {
            await marketplaceService.updateListingStatus(id, 'RESERVED');
        }

        // If request is completed, update listing status to SOLD
        if (status === 'COMPLETED') {
            await marketplaceService.updateListingStatus(id, 'SOLD');
        }

        return success(res, `Request ${status.toLowerCase()} successfully`, updatedRequest);
    } catch (err) {
        if (err instanceof Error && err.message === 'Listing not found') {
            return error(res, 'Listing not found', null, StatusCode.NOT_FOUND);
        }
        if (err instanceof Error && err.message === 'Request not found') {
            return error(res, 'Request not found', null, StatusCode.NOT_FOUND);
        }
        return error(res, 'Failed to update request status', err);
    }
};

/**
 * Cancel a request (for buyers only)
 */
export const cancelRequest = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return error(res, 'Unauthorized', null, StatusCode.UNAUTHORIZED);
        }

        const { requestId } = req.params;

        // Check if request exists and if user is the buyer
        const request = await marketplaceService.getRequestById(requestId);

        if (!request) {
            return error(res, 'Request not found', null, StatusCode.NOT_FOUND);
        }

        // Only the buyer can cancel their request
        if (request.buyerId !== req.user.id) {
            return error(res, 'You do not have permission to cancel this request', null, StatusCode.FORBIDDEN);
        }

        await marketplaceService.deleteRequest(requestId);
        return success(res, 'Request canceled successfully');
    } catch (err) {
        return error(res, 'Failed to cancel request', err);
    }
};

/**
 * Get marketplace categories
 */
export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await marketplaceService.getCategories();
        return success(res, 'Categories retrieved successfully', categories);
    } catch (err) {
        return error(res, 'Failed to retrieve categories', err);
    }
};

/**
 * Get recent marketplace activity for the current user (their listings and requests)
 */
export const getUserMarketplaceActivity = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return error(res, 'Unauthorized', null, StatusCode.UNAUTHORIZED);
        }

        const activity = await marketplaceService.getUserMarketplaceActivity(req.user.id);
        return success(res, 'User marketplace activity retrieved successfully', activity);
    } catch (err) {
        return error(res, 'Failed to retrieve user marketplace activity', err);
    }
};

/**
 * Search marketplace listings
 */
export const searchListings = async (req: Request, res: Response) => {
    try {
        const { query, category, minPrice, maxPrice, condition, neighborhood } = req.query;

        const searchParams = {
            query: query as string,
            categoryId: category as string,
            minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
            condition: condition as string,
            neighborhoodId: neighborhood as string,
        };

        const results = await marketplaceService.searchListings(searchParams);
        return success(res, 'Search results retrieved successfully', results);
    } catch (err) {
        return error(res, 'Failed to search listings', err);
    }
};