import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'
import { prisma } from './prisma'

export interface JWTPayload {
    userId: string
    email: string
    isAdmin: boolean
    username: string
}

export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    })
}

export function verifyToken(token: string): JWTPayload {
    return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
}

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
}

export async function getAuthUser(request: NextRequest) {
    try {
        const token = request.headers.get('authorization')?.replace('Bearer ', '')
        if (!token) return null

        const payload = verifyToken(token)
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            include: {
                neighborhood: true
            }
        })

        return user
    } catch (error) {
        console.error('Auth error:', error)
        return null
    }
}

export function requireAuth(user: any) {
    if (!user) {
        throw new Error('Authentication required')
    }
    return user
}

export function requireAdmin(user: any) {
    requireAuth(user)
    if (!user.isAdmin) {
        throw new Error('Admin access required')
    }
    return user
}