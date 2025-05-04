// src/controllers/posts.controller.ts
import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { success, error, StatusCode } from '../utils/responses';
import * as postService from '../services/posts.service';

/**
 * Get community posts with optional filters
 */
export const getPosts = async (req: Request, res: Response) => {
    try {
        const filters: postService.PostFilters = {
            categoryId: req.query.categoryId as string | undefined,
            authorId: req.query.authorId as string | undefined,
            isPinned: req.query.isPinned === 'true',
            query: req.query.q as string | undefined,
            status: 'PUBLISHED', // Only show published posts by default
        };

        const page = parseInt(req.query.page as string || '1', 10);
        const limit = parseInt(req.query.limit as string || '10', 10);

        const posts = await postService.getPosts(filters, page, limit);
        return success(res, 'Posts retrieved successfully', posts);
    } catch (err) {
        return error(res, 'Failed to retrieve posts', err);
    }
};

/**
 * Get a specific post by ID
 */
export const getPostById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const post = await postService.getPostById(id);
        return success(res, 'Post retrieved successfully', post);
    } catch (err) {
        if (err instanceof Error && err.message === 'Post not found') {
            return error(res, 'Post not found', null, StatusCode.NOT_FOUND);
        }
        return error(res, 'Failed to retrieve post', err);
    }
};

/**
 * Create a new community post
 */
export const createPost = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return error(res, 'Unauthorized', null, StatusCode.UNAUTHORIZED);
        }

        const postData: postService.CreatePostInput = req.body;
        const post = await postService.createPost(postData, req.user.id);
        return success(res, 'Post created successfully', post, StatusCode.CREATED);
    } catch (err) {
        return error(res, 'Failed to create post', err);
    }
};

/**
 * Update an existing post
 */
export const updatePost = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return error(res, 'Unauthorized', null, StatusCode.UNAUTHORIZED);
        }

        const { id } = req.params;
        const postData = req.body;

        // Check if post exists and if user has permission
        const existingPost = await postService.getPostById(id);

        // Only the author or admin/moderator can update the post
        if (existingPost.authorId !== req.user.id && !['ADMIN', 'MODERATOR', 'SUPER_ADMIN'].includes(req.user.role)) {
            return error(res, 'You do not have permission to update this post', null, StatusCode.FORBIDDEN);
        }

        const updatedPost = await postService.updatePost(id, postData);
        return success(res, 'Post updated successfully', updatedPost);
    } catch (err) {
        if (err instanceof Error && err.message === 'Post not found') {
            return error(res, 'Post not found', null, StatusCode.NOT_FOUND);
        }
        return error(res, 'Failed to update post', err);
    }
};

/**
 * Delete a post
 */
export const deletePost = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return error(res, 'Unauthorized', null, StatusCode.UNAUTHORIZED);
        }

        const { id } = req.params;

        // Check if post exists and if user has permission
        const existingPost = await postService.getPostById(id);

        // Only the author or admin/moderator can delete the post
        if (existingPost.authorId !== req.user.id && !['ADMIN', 'MODERATOR', 'SUPER_ADMIN'].includes(req.user.role)) {
            return error(res, 'You do not have permission to delete this post', null, StatusCode.FORBIDDEN);
        }

        await postService.deletePost(id);
        return success(res, 'Post deleted successfully');
    } catch (err) {
        if (err instanceof Error && err.message === 'Post not found') {
            return error(res, 'Post not found', null, StatusCode.NOT_FOUND);
        }
        return error(res, 'Failed to delete post', err);
    }
};

/**
 * Toggle pin status of a post (admin/moderator only)
 */
export const togglePinPost = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return error(res, 'Unauthorized', null, StatusCode.UNAUTHORIZED);
        }

        // Only admin/moderator can pin posts
        if (!['ADMIN', 'MODERATOR', 'SUPER_ADMIN'].includes(req.user.role)) {
            return error(res, 'You do not have permission to pin/unpin posts', null, StatusCode.FORBIDDEN);
        }

        const { id } = req.params;
        const { isPinned } = req.body;

        const updatedPost = await postService.togglePinPost(id, isPinned);
        const message = isPinned ? 'Post pinned successfully' : 'Post unpinned successfully';

        return success(res, message, updatedPost);
    } catch (err) {
        if (err instanceof Error && err.message === 'Post not found') {
            return error(res, 'Post not found', null, StatusCode.NOT_FOUND);
        }
        return error(res, 'Failed to update pin status', err);
    }
};

/**
 * Add a comment to a post
 */
export const addComment = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return error(res, 'Unauthorized', null, StatusCode.UNAUTHORIZED);
        }

        const { id } = req.params;
        const { content, isAnonymous, parentId } = req.body;

        // Check if post exists
        await postService.getPostById(id);

        const comment = await postService.addComment({
            postId: id,
            authorId: req.user.id,
            content,
            isAnonymous: isAnonymous || false,
            parentId: parentId || null,
        });

        return success(res, 'Comment added successfully', comment, StatusCode.CREATED);
    } catch (err) {
        if (err instanceof Error && err.message === 'Post not found') {
            return error(res, 'Post not found', null, StatusCode.NOT_FOUND);
        }
        if (err instanceof Error && err.message === 'Parent comment not found') {
            return error(res, 'Parent comment not found', null, StatusCode.NOT_FOUND);
        }
        return error(res, 'Failed to add comment', err);
    }
};

/**
 * Get comments for a post
 */
export const getComments = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Check if post exists
        await postService.getPostById(id);

        const comments = await postService.getComments(id);
        return success(res, 'Comments retrieved successfully', comments);
    } catch (err) {
        if (err instanceof Error && err.message === 'Post not found') {
            return error(res, 'Post not found', null, StatusCode.NOT_FOUND);
        }
        return error(res, 'Failed to retrieve comments', err);
    }
};

/**
 * Update a comment
 */
export const updateComment = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return error(res, 'Unauthorized', null, StatusCode.UNAUTHORIZED);
        }

        const { commentId } = req.params;
        const { content } = req.body;

        // Check if comment exists and if user has permission
        const comment = await postService.getCommentById(commentId);

        if (!comment) {
            return error(res, 'Comment not found', null, StatusCode.NOT_FOUND);
        }

        // Only the author or admin/moderator can update the comment
        if (comment.authorId !== req.user.id && !['ADMIN', 'MODERATOR', 'SUPER_ADMIN'].includes(req.user.role)) {
            return error(res, 'You do not have permission to update this comment', null, StatusCode.FORBIDDEN);
        }

        const updatedComment = await postService.updateComment(commentId, content);
        return success(res, 'Comment updated successfully', updatedComment);
    } catch (err) {
        return error(res, 'Failed to update comment', err);
    }
};

/**
 * Delete a comment
 */
export const deleteComment = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return error(res, 'Unauthorized', null, StatusCode.UNAUTHORIZED);
        }

        const { commentId } = req.params;

        // Check if comment exists and if user has permission
        const comment = await postService.getCommentById(commentId);

        if (!comment) {
            return error(res, 'Comment not found', null, StatusCode.NOT_FOUND);
        }

        // Only the author or admin/moderator can delete the comment
        if (comment.authorId !== req.user.id && !['ADMIN', 'MODERATOR', 'SUPER_ADMIN'].includes(req.user.role)) {
            return error(res, 'You do not have permission to delete this comment', null, StatusCode.FORBIDDEN);
        }

        await postService.deleteComment(commentId);
        return success(res, 'Comment deleted successfully');
    } catch (err) {
        return error(res, 'Failed to delete comment', err);
    }
};

/**
 * Add a reaction to a post
 */
export const addReaction = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return error(res, 'Unauthorized', null, StatusCode.UNAUTHORIZED);
        }

        const { id } = req.params;
        const { type } = req.body;

        // Validate reaction type
        const validTypes = ['LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY', 'USEFUL'];
        if (!validTypes.includes(type)) {
            return error(res, `Invalid reaction type. Must be one of: ${validTypes.join(', ')}`, null, StatusCode.BAD_REQUEST);
        }

        const reaction = await postService.addReaction({
            postId: id,
            userId: req.user.id,
            type,
        });

        return success(res, 'Reaction added successfully', reaction, StatusCode.CREATED);
    } catch (err) {
        if (err instanceof Error && err.message === 'Post not found') {
            return error(res, 'Post not found', null, StatusCode.NOT_FOUND);
        }
        if (err instanceof Error && err.message.includes('already reacted')) {
            return error(res, err.message, null, StatusCode.CONFLICT);
        }
        return error(res, 'Failed to add reaction', err);
    }
};

/**
 * Remove a reaction from a post
 */
export const removeReaction = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return error(res, 'Unauthorized', null, StatusCode.UNAUTHORIZED);
        }

        const { id } = req.params;
        const { type } = req.body;

        await postService.removeReaction(id, req.user.id, type);
        return success(res, 'Reaction removed successfully');
    } catch (err) {
        if (err instanceof Error && err.message === 'Post not found') {
            return error(res, 'Post not found', null, StatusCode.NOT_FOUND);
        }
        if (err instanceof Error && err.message === 'Reaction not found') {
            return error(res, 'Reaction not found', null, StatusCode.NOT_FOUND);
        }
        return error(res, 'Failed to remove reaction', err);
    }
};

/**
 * Get post categories
 */
export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await postService.getCategories();
        return success(res, 'Categories retrieved successfully', categories);
    } catch (err) {
        return error(res, 'Failed to retrieve categories', err);
    }
};

/**
 * Search posts
 */
export const searchPosts = async (req: Request, res: Response) => {
    try {
        const { query, category } = req.query;

        const searchParams = {
            query: query as string,
            categoryId: category as string,
        };

        const page = parseInt(req.query.page as string || '1', 10);
        const limit = parseInt(req.query.limit as string || '10', 10);

        const results = await postService.searchPosts(searchParams, page, limit);
        return success(res, 'Search results retrieved successfully', results);
    } catch (err) {
        return error(res, 'Failed to search posts', err);
    }
};

/**
 * Report a post for moderation
 */
export const reportPost = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return error(res, 'Unauthorized', null, StatusCode.UNAUTHORIZED);
        }

        const { id } = req.params;
        const { reason, description } = req.body;

        // Check if post exists
        await postService.getPostById(id);

        const report = await postService.reportPost({
            postId: id,
            reporterId: req.user.id,
            reason,
            description,
        });

        return success(res, 'Post reported successfully', report, StatusCode.CREATED);
    } catch (err) {
        if (err instanceof Error && err.message === 'Post not found') {
            return error(res, 'Post not found', null, StatusCode.NOT_FOUND);
        }
        return error(res, 'Failed to report post', err);
    }
};