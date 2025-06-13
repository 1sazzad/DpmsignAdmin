import axios from 'axios';

// Use Vite environment variable for API Base URL
// Fallback to local dev URL if not set, though it's better to ensure it's set.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

if (!import.meta.env.VITE_API_BASE_URL) {
    console.warn('VITE_API_BASE_URL is not set. Falling back to http://localhost:3001/api/v1. Please set it in your .env file for proper configuration.');
}


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  // timeout: 10000,
  // headers: { 'Content-Type': 'application/json' }
});

// Request Interceptor: Add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminAuthToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global error handling (especially for 401)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Avoid redirect loop if already on login page or if the error is from login attempt
      if (!window.location.pathname.includes('/admin/login') && error.config.url !== '/auth/login') {
        console.error('Unauthorized! Redirecting to login from interceptor.');
        localStorage.removeItem('adminAuthToken');
        // localStorage.removeItem('adminUser'); // If you stored user details separately
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
