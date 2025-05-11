// src/types/jwt.d.ts
// Custom type definitions for JWT to ensure proper typing

declare module 'jsonwebtoken' {
    interface JwtPayload {
        id: string;
        role: string;
    }
}

export {};