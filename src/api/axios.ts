import axios from 'axios';
import { toast } from 'react-hot-toast';

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
// 🚪 Response interceptor (auto logout if token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Token expired → logging out");

      // Remove token
      localStorage.removeItem("token");

      // Redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

//global response interceptor to handle success and error messages using react-hot-toast
api.interceptors.response.use(
  (response)=>{
    const message = response.data?.message;
    if(message){
      toast.success(message);
    }
    return response;
  },
  (error)=>{
    const message = error.response?.data?.message || "Something went wrong";
    toast.error(message);
    return Promise.reject(error);
  }
)

export default api;