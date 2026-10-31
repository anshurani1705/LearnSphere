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

// Response interceptor to unwrap data and handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error.response?.data || { message: error.message });
  }
);