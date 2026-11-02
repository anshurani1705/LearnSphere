import axios from 'axios';

// Resolve backend URL safely across development and production
const metaEnv = (import.meta as any).env || {};
const baseURL =
  metaEnv.VITE_API_BASE_URL ||
  (metaEnv.PROD
    ? 'https://learnsphere-1-jj07.onrender.com/api'
    : '/api');

export const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 45000, // 45 seconds to accommodate Render free-tier cold starts
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token from localStorage as Bearer header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

// Response interceptor to unwrap data, handle 401, and auto-retry on Render cold starts
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Detect network failure or timeout during Render cold-start spinup
    const isNetworkError =
      !error.response ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      error.message === 'Network Error';

    // Auto-retry once after 2.5s if it was a network error during server wakeup
    if (isNetworkError && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await new Promise((resolve) => setTimeout(resolve, 2500));
        return await api(originalRequest);
      } catch (retryErr: any) {
        return Promise.reject(
          retryErr.response?.data || {
            message:
              'The server is waking up from idle on Render. Please wait 10 seconds and try again.',
          }
        );
      }
    }

    const message =
      error.response?.data?.message ||
      (isNetworkError
        ? 'The backend server is currently starting up. Please try again in a few seconds.'
        : error.message || 'An unexpected error occurred.');

    return Promise.reject(error.response?.data || { message });
  }
);
