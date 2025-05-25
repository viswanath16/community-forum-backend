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

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    })
}

export function verifyToken(token: string): JWTPayload {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload
    } catch (error) {
        console.error('Token verification failed:', error)
        throw new Error('Invalid or expired token')
    }
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
        console.log('Auth header:', authHeader) // Debug log

        if (!authHeader) {
            console.log('No auth header found')
            return null
        }

        const token = authHeader.replace('Bearer ', '')
        if (!token) {
            console.log('No token found after Bearer')
            return null
        }

        console.log('Token:', token.substring(0, 20) + '...') // Debug log (partial token)

        const payload = verifyToken(token)
        console.log('Token payload:', payload) // Debug log

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            include: {
                neighborhood: true
            }
        })

        console.log('User found:', user ? 'Yes' : 'No') // Debug log
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