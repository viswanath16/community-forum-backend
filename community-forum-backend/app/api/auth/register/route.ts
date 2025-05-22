import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations/auth'
import { hashPassword, generateToken } from '@/lib/auth'
import { successResponse, handleApiError } from '@/lib/utils/responses'
import { handleApiError as errorHandler } from '@/lib/utils/error-handler'

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - username
 *               - fullName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               username:
 *                 type: string
 *                 minLength: 3
 *               fullName:
 *                 type: string
 *                 minLength: 2
 *               neighborhoodId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or user already exists
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const validatedData = registerSchema.parse(body)

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: validatedData.email },
                    { username: validatedData.username }
                ]
            }
        })

        if (existingUser) {
            return errorResponse('User with this email or username already exists', 409)
        }

        // Hash password
        const hashedPassword = await hashPassword(validatedData.password)

        // Create user
        const user = await prisma.user.create({
            data: {
                email: validatedData.email,
                username: validatedData.username,
                fullName: validatedData.fullName,
                neighborhoodId: validatedData.neighborhoodId,
                // In real implementation, store hashed password
                // For demo purposes, we're not storing it since we use Supabase Auth
            },
            select: {
                id: true,
                email: true,
                username: true,
                fullName: true,
                isAdmin: true,
                neighborhood: {
                    select: {
                        id: true,
                        name: true,
                        city: true
                    }
                }
            }
        })

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            username: user.username,
            isAdmin: user.isAdmin
        })

        return successResponse({
            user,
            token
        }, 'User registered successfully', 201)

    } catch (error) {
        return errorHandler(error)
    }
}