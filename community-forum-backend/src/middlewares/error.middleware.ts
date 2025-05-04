// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { error, StatusCode } from '../utils/responses';
import logger from '../utils/logger';

interface AppError extends Error {
    statusCode?: number;
}

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || StatusCode.INTERNAL_SERVER;
    const message = err.message || 'Internal Server Error';

    logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    logger.error(err.stack);

    return error(res, message, err, statusCode);
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    const message = `Cannot ${req.method} ${req.originalUrl}`;
    logger.error(`404 - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return error(res, message, null, StatusCode.NOT_FOUND);
};