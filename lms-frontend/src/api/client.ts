import axios from 'axios';

// In production, fallback directly to your live Render backend URL so Vercel never returns 404
const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? 'https://learnsphere-1-jj07.onrender.com/api'
    : '/api');

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to unwrap data and handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error.response?.data || { message: error.message });
  }
);
