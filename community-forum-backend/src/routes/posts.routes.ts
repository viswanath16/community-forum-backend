// src/routes/posts.routes.ts (updated with validation)
import { Router } from 'express';
import * as postsController from '../controllers/posts.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
    createPostSchema,
    updatePostSchema,
    commentSchema,
    reactionSchema,
    reportSchema
} from '../validators/posts.validator';

const router = Router();

// Public routes
router.get('/', postsController.getPosts);
router.get('/categories', postsController.getCategories);
router.get('/search', postsController.searchPosts);
router.get('/:id', postsController.getPostById);
router.get('/:id/comments', postsController.getComments);

// Protected routes
router.post('/', authenticate, validate(createPostSchema), postsController.createPost);
router.put('/:id', authenticate, validate(updatePostSchema), postsController.updatePost);
router.delete('/:id', authenticate, postsController.deletePost);
router.post('/:id/comments', authenticate, validate(commentSchema), postsController.addComment);
router.put('/comments/:commentId', authenticate, validate(commentSchema), postsController.updateComment);
router.delete('/comments/:commentId', authenticate, postsController.deleteComment);
router.post('/:id/reaction', authenticate, validate(reactionSchema), postsController.addReaction);
router.delete('/:id/reaction', authenticate, validate(reactionSchema), postsController.removeReaction);
router.put('/:id/pin', authenticate, authorize(['ADMIN', 'MODERATOR', 'SUPER_ADMIN']), postsController.togglePinPost);
router.post('/:id/report', authenticate, validate(reportSchema), postsController.reportPost);

export default router;