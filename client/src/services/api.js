import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hostelhub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      const currentPath = window.location.pathname;
      if (currentPath.includes('/student/') && currentPath !== '/student/login') {
        localStorage.removeItem('hostelhub_token');
        localStorage.removeItem('hostelhub_user');
        window.location.href = '/student/login';
      } else if (currentPath.includes('/owner/') && currentPath !== '/owner/login') {
        localStorage.removeItem('hostelhub_token');
        localStorage.removeItem('hostelhub_user');
        window.location.href = '/owner/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
