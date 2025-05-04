// src/validators/events.validator.ts
import Joi from 'joi';

export const createEventSchema = Joi.object({
    title: Joi.string().required().min(3).max(100),
    description: Joi.string().required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().required(),
    location: Joi.string().allow(null, ''),
    address: Joi.string().allow(null, ''),
    isOnline: Joi.boolean().default(false),
    meetingUrl: Joi.string().uri().allow(null, ''),
    capacity: Joi.number().integer().min(1).allow(null),
    isFree: Joi.boolean().default(true),
    price: Joi.number().when('isFree', {
        is: false,
        then: Joi.required(),
        otherwise: Joi.allow(null),
    }),
    image: Joi.string().allow(null, ''),
    categoryId: Joi.string().required(),
    neighborhoodId: Joi.string().allow(null),
    interestIds: Joi.array().items(Joi.string()),
});

export const updateEventSchema = Joi.object({
    title: Joi.string().min(3).max(100),
    description: Joi.string(),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso(),
    location: Joi.string().allow(null, ''),
    address: Joi.string().allow(null, ''),
    isOnline: Joi.boolean(),
    meetingUrl: Joi.string().uri().allow(null, ''),
    capacity: Joi.number().integer().min(1).allow(null),
    isFree: Joi.boolean(),
    price: Joi.number(),
    image: Joi.string().allow(null, ''),
    categoryId: Joi.string(),
    neighborhoodId: Joi.string().allow(null),
    interestIds: Joi.array().items(Joi.string()),
    isPublished: Joi.boolean(),
});