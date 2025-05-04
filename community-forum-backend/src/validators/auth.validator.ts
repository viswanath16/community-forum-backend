// src/validators/auth.validator.ts
import Joi from 'joi';

export const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    displayName: Joi.string().min(3).max(50).required(),
    firstName: Joi.string().allow(null, ''),
    lastName: Joi.string().allow(null, ''),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const updateProfileSchema = Joi.object({
    firstName: Joi.string().allow(null, ''),
    lastName: Joi.string().allow(null, ''),
    displayName: Joi.string().min(3).max(50),
    bio: Joi.string().allow(null, ''),
    neighborhood: Joi.string().allow(null, ''),
    postalCode: Joi.string().allow(null, ''),
    city: Joi.string().allow(null, ''),
    avatar: Joi.string().uri().allow(null, ''),
});

export const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).required(),
});

export const requestPasswordResetSchema = Joi.object({
    email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(8).required(),
});