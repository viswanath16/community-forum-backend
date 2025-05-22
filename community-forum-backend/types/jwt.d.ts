declare module 'jsonwebtoken' {
    export function sign(
        payload: string | object | Buffer,
        secretOrPrivateKey: string | Buffer,
        options?: {
            algorithm?: string;
            expiresIn?: string | number;
            notBefore?: string | number;
            audience?: string | string[];
            issuer?: string;
            jwtid?: string;
            subject?: string;
            noTimestamp?: boolean;
            header?: object;
            keyid?: string;
        }
    ): string;

    export function verify(
        token: string,
        secretOrPublicKey: string | Buffer,
        options?: any
    ): any;

    export class JsonWebTokenError extends Error {
        inner: Error;
    }

    export class TokenExpiredError extends JsonWebTokenError {
        expiredAt: Date;
    }

    export class NotBeforeError extends JsonWebTokenError {
        date: Date;
    }
}