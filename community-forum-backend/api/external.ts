import axios from 'axios';

// Configure API base URL from environment variable
const API_BASE_URL = process.env.EXTERNAL_API_URL || 'https://jsonplaceholder.typicode.com';

/**
 * Fetches data from an external API
 * @param query Optional query parameter
 * @returns Promise with the API response data
 */
export async function fetchExternalData(query: string = '') {
    try {
        // Example: fetch posts from JSONPlaceholder API
        // In a real app, you might use the query parameter to customize the request
        const endpoint = query ? `/posts?q=${encodeURIComponent(query)}` : '/posts';

        const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                // Add any required API keys or auth tokens here
                // 'Authorization': `Bearer ${process.env.API_KEY}`
            },
            // Timeout after 10 seconds
            timeout: 10000
        });

        return response.data;
    } catch (error) {
        // Handle and rethrow the error with more context
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`External API error: ${error.response.status} - ${error.response.statusText}`);
        }
        throw error;
    }
}