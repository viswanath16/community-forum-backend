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

// Ensure JWT_SECRET exists and is a string
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key-change-in-production'

export function generateToken(payload: JWTPayload): string {
    // Use a number for expiresIn to avoid type issues
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: 60 * 60 * 24 * 7 // 7 days in seconds
    })
}

export function verifyToken(token: string): JWTPayload {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
}

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
}

export async function getAuthUser(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization')
        if (!authHeader) return null

        const token = authHeader.replace('Bearer ', '')
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

export function requireAuth(user: any): any {
    if (!user) {
        throw new Error('Authentication required')
    }
    return user
}

export function requireAdmin(user: any): any {
    requireAuth(user)
    if (!user.isAdmin) {
        throw new Error('Admin access required')
    }
    return user
}