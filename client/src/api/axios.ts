import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env.MODE === 'development') {
    return import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  }
  
  const prodBaseURL = import.meta.env.VITE_API_BASE_URL;
  if (!prodBaseURL) {
    console.error('VITE_API_BASE_URL is not set for production environment');
    throw new Error('VITE_API_BASE_URL is required in production');
  }
  
  return prodBaseURL;
};

const api = axios.create({
    baseURL: getBaseURL()
})

export default api;