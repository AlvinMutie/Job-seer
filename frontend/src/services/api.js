import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

/**
 * Extracts a clean, human-readable error message from an API error response, network failure, or exception.
 * Supports P2-01 standardized error objects ({ error: { code, message, details } }), 
 * legacy FastAPI detail strings ({ detail: "..." }), status code fallbacks, and network offline errors.
 */
export const getApiErrorMessage = (error) => {
    if (!error) return "An unknown error occurred.";

    // Network / Server Offline Error
    if (error.code === 'ERR_NETWORK' || !error.response) {
        return "Unable to connect to the server. Please check your connection and try again.";
    }

    const res = error.response;
    const status = res.status;
    const data = res.data;

    // 1. P2-01 Standardized error object structure
    if (data?.error?.message) {
        return data.error.message;
    }

    // 2. Structured field-level validation errors
    if (data?.error?.details && Array.isArray(data.error.details) && data.error.details.length > 0) {
        return data.error.details.map(d => `${d.field ? d.field + ': ' : ''}${d.message}`).join(', ');
    }

    // 3. FastAPI detail string fallback
    if (typeof data?.detail === 'string') {
        return data.detail;
    }

    if (Array.isArray(data?.detail) && data.detail.length > 0) {
        return data.detail.map(d => d.msg || d.message || JSON.stringify(d)).join(', ');
    }

    // 4. HTTP Status Code Fallbacks
    switch (status) {
        case 400: return "Bad request. Please verify your input.";
        case 401: return "Authentication required. Please log in again.";
        case 403: return "Access forbidden.";
        case 404: return "Requested resource was not found.";
        case 413: return "File size exceeds maximum allowed limit of 10MB.";
        case 422: return "Validation error. Please check form fields.";
        case 500: return "An unexpected server error occurred.";
        default: return `Request failed with status code ${status}`;
    }
};

// Request Interceptor: Dynamically attach Bearer token if present
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        delete config.headers.Authorization;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor: Handle 401 unauthenticated errors & attach standardized userMessage
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const userMsg = getApiErrorMessage(error);
        if (error) {
            error.userMessage = userMsg;
        }

        // Handle 401 Unauthorized globally (exclude /login endpoint to allow login error feedback)
        const isLoginRequest = error.config && error.config.url && error.config.url.includes('/login');
        if (error.response && error.response.status === 401 && !isLoginRequest) {
            console.warn("Authentication session expired or invalid. Clearing token.");
            localStorage.removeItem('token');
        }

        return Promise.reject(error);
    }
);

export const authService = {
    register: (data) => api.post('/register', data).then(res => res.data),
    login: (formData) => api.post('/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(res => res.data),
    getMe: () => api.get(`/me?t=${Date.now()}`).then(res => res.data),
    updateProfile: (data) => api.post('/profile', data).then(res => res.data),
    uploadResume: (formData) => api.post('/upload-resume', formData).then(res => res.data),
    getResumeHealth: () => api.get(`/resume/health?t=${Date.now()}`).then(res => res.data),
};

export const jobService = {
    getJobs: (params) => api.get('/jobs', { params: { ...params, t: Date.now() } }).then(res => res.data),
    matchResume: (formData) => api.post('/match', formData).then(res => res.data),
    tailorResume: (formData) => api.post('/tailor-resume', formData).then(res => res.data),
    generateCoverLetter: (formData) => api.post('/generate-cover-letter', formData).then(res => res.data),
};

export const tailoredResumeService = {
    generate: (job_id) => {
        const params = new URLSearchParams();
        params.append('job_id', job_id);
        return api.post('/resume/tailor', params).then(res => res.data);
    },
    list: () => api.get(`/resume/tailored?t=${Date.now()}`).then(res => res.data),
    get: (id) => api.get(`/resume/tailored/${id}?t=${Date.now()}`).then(res => res.data),
    compare: (id) => api.get(`/resume/tailored/${id}/compare?t=${Date.now()}`).then(res => res.data),
    delete: (id) => api.delete(`/resume/tailored/${id}`).then(res => res.data),
};

export const coverLetterService = {
    generate: (job_id, tone = "Professional", tailored_resume_id = null) => {
        const params = new URLSearchParams();
        params.append('job_id', job_id);
        params.append('tone', tone);
        if (tailored_resume_id) {
            params.append('tailored_resume_id', tailored_resume_id);
        }
        return api.post('/cover-letters', params).then(res => res.data);
    },
    list: (params = {}) => api.get('/cover-letters', { params: { ...params, t: Date.now() } }).then(res => res.data),
    get: (id) => api.get(`/cover-letters/${id}?t=${Date.now()}`).then(res => res.data),
    delete: (id) => api.delete(`/cover-letters/${id}`).then(res => res.data),
};

export const trackerService = {
    getApplications: (params = {}) => api.get('/applications', { params: { ...params, t: Date.now() } }).then(res => res.data),
    getApplication: (id) => api.get(`/applications/${id}?t=${Date.now()}`).then(res => res.data),
    addApplication: (data) => api.post('/applications', data).then(res => res.data),
    updateApplication: (id, data) => api.patch(`/applications/${id}`, data).then(res => res.data),
    deleteApplication: (id) => api.delete(`/applications/${id}`).then(res => res.data),
};

export default api;
