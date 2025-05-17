import type { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import the external API service function
// Using a separate import to avoid circular dependencies
import { fetchExternalData } from './external';

export default async function handler(
    request: VercelRequest,
    response: VercelResponse
) {
    try {
        // Process query parameters if needed
        const { query = '' } = request.query;

        // Call the external API service
        const data = await fetchExternalData(query as string);

        // Return the data
        return response.status(200).json({
            success: true,
            timestamp: new Date().toISOString(),
            data
        });
    } catch (error) {
        console.error('API Error:', error);

        // Return error response
        return response.status(500).json({
            success: false,
            message: 'An error occurred while processing your request',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
}