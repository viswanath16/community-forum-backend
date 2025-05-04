// src/validators/marketplace.validator.ts
import Joi from 'joi';

export const createListingSchema = Joi.object({
    title: Joi.string().required().min(3).max(100),
    description: Joi.string().required(),
    price: Joi.number().when('isFree', {
        is: false,
        then: Joi.required(),
        otherwise: Joi.allow(null),
    }),
    isFree: Joi.boolean().default(false),
    condition: Joi.string().valid('NEW', 'LIKE_NEW', 'GOOD', 'USED', 'WORN'),
    images: Joi.array().items(Joi.string().uri()).required(),
    categoryId: Joi.string().required(),
    neighborhoodId: Joi.string().allow(null),
    tagIds: Joi.array().items(Joi.string()),
});

export const updateListingSchema = Joi.object({
    title: Joi.string().min(3).max(100),
    description: Joi.string(),
    price: Joi.number(),
    isFree: Joi.boolean(),
    condition: Joi.string().valid('NEW', 'LIKE_NEW', 'GOOD', 'USED', 'WORN'),
    images: Joi.array().items(Joi.string().uri()),
    categoryId: Joi.string(),
    neighborhoodId: Joi.string().allow(null),
    tagIds: Joi.array().items(Joi.string()),
});

export const changeStatusSchema = Joi.object({
    status: Joi.string().valid('ACTIVE', 'RESERVED', 'SOLD', 'CLOSED').required(),
});

export const createRequestSchema = Joi.object({
    message: Joi.string().allow('', null),
});

export const updateRequestStatusSchema = Joi.object({
    status: Joi.string().valid('ACCEPTED', 'REJECTED', 'COMPLETED').required(),
});