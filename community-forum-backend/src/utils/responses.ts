// src/utils/responses.ts
import { Response } from 'express';

export enum StatusCode {
    SUCCESS = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER = 500,
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: any;
}

export const success = <T>(res: Response, message: string, data?: T, statusCode: StatusCode = StatusCode.SUCCESS): Response => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

export const error = <T>(res: Response, message: string, error?: any, statusCode: StatusCode = StatusCode.BAD_REQUEST): Response => {
    return res.status(statusCode).json({
        success: false,
        message,
        error,
    });
};