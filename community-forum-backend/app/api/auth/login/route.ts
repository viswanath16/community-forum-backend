import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { loginSchema } from '@/lib/validations/auth'
import { generateToken } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/utils/responses'
import { handleApiError } from '@/lib/utils/error-handler'

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const validatedData = loginSchema.parse(body)

        // Find user in database
        const user = await prisma.user.findUnique({
            where: { email: validatedData.email },
            include: {
                neighborhood: {
                    select: {
                        id: true,
                        name: true,
                        city: true
                    }
                }
            }
        })

        if (!user) {
            return errorResponse('Invalid email or password', 401)
        }

        // Demo password check (replace with Supabase Auth in production)
        const isValidPassword = validatedData.password === 'password123' ||
            (user.isAdmin && validatedData.password === (process.env.ADMIN_PASSWORD || 'admin123'))

        if (!isValidPassword) {
            return errorResponse('Invalid email or password', 401)
        }

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            username: user.username,
            isAdmin: user.isAdmin
        })

        return successResponse({
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                fullName: user.fullName,
                isAdmin: user.isAdmin,
                neighborhood: user.neighborhood
            },
            token
        }, 'Login successful')

    } catch (error) {
        return handleApiError(error)
    }
}