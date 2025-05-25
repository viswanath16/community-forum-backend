/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: false,
    },
    experimental: {
        serverComponentsExternalPackages: ['@prisma/client'],
        // Add this to fix the export-detail.json issue
        esmExternals: 'loose'
    },
    images: {
        domains: [
            'supabase.co',
            'localhost'
        ]
    },
    env: {
        CUSTOM_KEY: process.env.CUSTOM_KEY,
    },
    // Add output configuration to prevent static export issues
    output: undefined, // Remove any static export configuration

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
}

module.exports = nextConfig