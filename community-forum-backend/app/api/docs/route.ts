import { NextRequest, NextResponse } from 'next/server'
import { getApiDocs } from '@/lib/swagger'

export async function GET(request: NextRequest) {
    try {
        const spec = await getApiDocs()
        return NextResponse.json(spec)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to generate API documentation' },
            { status: 500 }
        )
    }
}