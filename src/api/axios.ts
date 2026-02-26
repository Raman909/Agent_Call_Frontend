import axios from 'axios';

// Create base instance
const api = axios.create({
  
  // Use VITE_API_URL if it exists in .env, otherwise default to local backend
baseURL: (import.meta as any).env.VITE_API_URL ?? "http://localhost:5000/api",
});

// Request interceptor to inject the JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;