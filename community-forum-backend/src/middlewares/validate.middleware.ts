// src/middlewares/validate.middleware.ts
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { error } from '../utils/responses';

export const validate = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error: validationError } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (validationError) {
            const errorMessages = validationError.details.map((detail) => detail.message);
            return error(res, 'Validation error', errorMessages);
        }

        next();
    };
};