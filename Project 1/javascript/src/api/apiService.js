const API_BASE_URL = 'http://localhost:5000/api';

/**
 * A generic function to make API calls to the backend.
 * @param {string} endpoint - The API endpoint (e.g., '/users', '/blogs/123').
 * @param {string} [method='GET'] - The HTTP method (GET, POST, PUT, DELETE).
 * @param {object|null} [data=null] - The request body data (for POST, PUT).
 * @param {string|null} [token=null] - An authentication token (e.g., JWT) for authorization.
 * @returns {Promise<object>} The JSON response from the API.
 * @throws {Error} If the API call fails or returns an error status.
 */
const apiCall = async (endpoint, method = 'GET', data = null, token = null) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const result = await response.json(); 
        
        if (!response.ok) {
            const error = new Error(result.message || 'Something went wrong with the API call.');
            error.statusCode = response.status;
            throw error;
        }
        return result;
    } catch (error) {
        console.error("API call error:", error);
        throw error;
    }
};

export default apiCall;
