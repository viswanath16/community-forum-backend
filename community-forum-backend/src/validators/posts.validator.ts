// src/validators/posts.validator.ts
import Joi from 'joi';

export const createPostSchema = Joi.object({
    title: Joi.string().required().min(3).max(100),
    content: Joi.string().required(),
    isAnonymous: Joi.boolean().default(false),
    categoryId: Joi.string().required(),
    tagIds: Joi.array().items(Joi.string()),
    media: Joi.array().items(
        Joi.object({
            url: Joi.string().required(),
            type: Joi.string().valid('IMAGE', 'VIDEO', 'DOCUMENT', 'AUDIO').required(),
            title: Joi.string().allow(null, ''),
            description: Joi.string().allow(null, ''),
        })
    ),
});

export const updatePostSchema = Joi.object({
    title: Joi.string().min(3).max(100),
    content: Joi.string(),
    isAnonymous: Joi.boolean(),
    categoryId: Joi.string(),
    tagIds: Joi.array().items(Joi.string()),
    media: Joi.array().items(
        Joi.object({
            url: Joi.string().required(),
            type: Joi.string().valid('IMAGE', 'VIDEO', 'DOCUMENT', 'AUDIO').required(),
            title: Joi.string().allow(null, ''),
            description: Joi.string().allow(null, ''),
        })
    ),
});

export const commentSchema = Joi.object({
    content: Joi.string().required(),
    isAnonymous: Joi.boolean().default(false),
    parentId: Joi.string().allow(null),
});

export const reactionSchema = Joi.object({
    type: Joi.string().valid('LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY', 'USEFUL').required(),
});

export const reportSchema = Joi.object({
    reason: Joi.string().required(),
    description: Joi.string().allow(null, ''),
});