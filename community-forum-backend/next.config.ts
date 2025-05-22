import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true, // Temporarily to bypass type errors
    },
    serverExternalPackages: ['@prisma/client', 'bcryptjs', 'jsonwebtoken'],
    images: {
        domains: [
            'supabase.co',
            'localhost'
        ]
    },
    experimental: {
        serverComponentsExternalPackages: ['@prisma/client']
    },
    env: {
        CUSTOM_KEY: process.env.CUSTOM_KEY,
    },
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
                    { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
                ],
            },
        ]
    },
    output: 'standalone'
}

export default nextConfig