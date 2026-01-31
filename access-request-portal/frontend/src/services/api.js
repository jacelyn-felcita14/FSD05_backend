import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Authentication APIs
export const authAPI = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    }
};

// Access Request APIs
export const requestAPI = {
    createRequest: async (requestData) => {
        const response = await api.post('/requests', requestData);
        return response.data;
    },

    getMyRequests: async () => {
        const response = await api.get('/requests/my-requests');
        return response.data;
    },

    getAllRequests: async (status = '') => {
        const response = await api.get('/requests/all', {
            params: status ? { status } : {}
        });
        return response.data;
    },

    approveRequest: async (requestId) => {
        const response = await api.put(`/requests/${requestId}/approve`);
        return response.data;
    },

    rejectRequest: async (requestId) => {
        const response = await api.put(`/requests/${requestId}/reject`);
        return response.data;
    }
};

export default api;
