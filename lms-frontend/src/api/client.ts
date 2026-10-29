import axios from 'axios';

// Dynamically use the remote backend URL if provided in production, otherwise default to local '/api'
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

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
