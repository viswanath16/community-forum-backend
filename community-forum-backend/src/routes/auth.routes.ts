// src/routes/auth.routes.ts (updated with validation)
import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
    registerSchema,
    loginSchema,
    updateProfileSchema,
    changePasswordSchema,
    requestPasswordResetSchema,
    resetPasswordSchema
} from '../validators/auth.validator';

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/password/reset-request', validate(requestPasswordResetSchema), authController.requestPasswordReset);
router.post('/password/reset', validate(resetPasswordSchema), authController.resetPassword);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, validate(updateProfileSchema), authController.updateProfile);
router.put('/password', authenticate, validate(changePasswordSchema), authController.changePassword);
router.post('/token/refresh', authenticate, authController.refreshToken);
router.get('/me', authenticate, authController.getCurrentUser);

export default router;