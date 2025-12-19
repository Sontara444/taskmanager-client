const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}`;

interface FetchOptions extends RequestInit {
    data?: any;
    params?: Record<string, string>;
}

interface AxiosLikeResponse<T> {
    data: T;
    status: number;
    statusText: string;
}

const request = async <T = any>(endpoint: string, options: FetchOptions = {}): Promise<AxiosLikeResponse<T>> => {
    const { data, params, ...customConfig } = options;
    const headers = {
        'Content-Type': 'application/json',
        ...customConfig.headers,
    };

    let url = `${BASE_URL}${endpoint}`;
    if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams.toString()}`;
    }

    const config: RequestInit = {
        ...customConfig,
        headers: headers as HeadersInit,
        credentials: 'include', // Same as withCredentials: true
    };

    // Add token to headers if it exists
    const token = localStorage.getItem('token');
    if (token) {
        (config.headers as any)['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, config);
        const responseData = await response.json().catch(() => ({})); // Handle empty or non-JSON responses

        if (!response.ok) {
            // mimic axios error object
            const error: any = new Error(responseData.message || response.statusText);
            error.response = {
                data: responseData,
                status: response.status,
                statusText: response.statusText,
            };
            throw error;
        }

        return {
            data: responseData,
            status: response.status,
            statusText: response.statusText,
        };
    } catch (error: any) {
        // If it's already our custom error, rethrow
        if (error.response) throw error;

        // Network errors or other fetch errors
        error.response = {
            data: { message: error.message || 'Network Error' },
            status: 500,
            statusText: 'Network Error',
        };
        throw error;
    }
};

const api = {
    get: <T = any>(url: string, config?: FetchOptions) => request<T>(url, { ...config, method: 'GET' }),
    post: <T = any>(url: string, data?: any, config?: FetchOptions) => request<T>(url, { ...config, method: 'POST', data }),
    put: <T = any>(url: string, data?: any, config?: FetchOptions) => request<T>(url, { ...config, method: 'PUT', data }),
    delete: <T = any>(url: string, config?: FetchOptions) => request<T>(url, { ...config, method: 'DELETE' }),
};

export default api;
