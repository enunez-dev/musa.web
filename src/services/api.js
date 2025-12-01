import mockApi from './mockApi';

// Use mockApi instead of axios
const api = mockApi;

// Interceptors are not needed for mockApi as it's a simple object, 
// but if we wanted to simulate them we'd need a wrapper. 
// For now, we just export the mock object directly.
// The real axios code is commented out below for reference.

/*
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors (optional: logout user)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // useAuthStore.getState().logout(); // Optional: Auto logout on 401
    }
    return Promise.reject(error);
  }
);
*/

export default api;
