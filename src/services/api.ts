
import { API_URL } from "@/constants/api";

const API_BASE_URL = API_URL;
// Default headers
const defaultHeaders = {
    'Content-Type': 'application/json',
};

// Helper for adding auth token
const getAuthHeaders = (token: string) => ({
    ...defaultHeaders,
    Authorization: `Bearer ${token}`,
});

/**
 * Make a GET request
 */
export const apiGet = async <T>(endpoint: string, token?: string): Promise<T> => {
    const headers = token ? getAuthHeaders(token) : defaultHeaders;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
};

/**
 * Make a POST request
 */
export const apiPost = async <T>(endpoint: string, data: any, token?: string): Promise<T> => {
    const headers = token ? getAuthHeaders(token) : defaultHeaders;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
};

/**
 * Make a PUT request
 */
export const apiPut = async <T>(endpoint: string, data: any, token?: string): Promise<T> => {
    const headers = token ? getAuthHeaders(token) : defaultHeaders;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
};

/**
 * Make a DELETE request
 */
export const apiDelete = async <T>(endpoint: string, token?: string): Promise<T> => {
    const headers = token ? getAuthHeaders(token) : defaultHeaders;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers,
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
};
