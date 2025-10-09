import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth functions
export const login = (credentials) => api.post('/users/login', credentials);
export const register = (userData) => api.post('/users/register', userData);

// Profile functions
export const getProfile = () => api.get('/users/profile');
export const updateProfile = (data) => api.put('/users/profile', data);
export const changePassword = (data) => api.put('/users/password', data);

// Password reset functions
export const forgotPassword = (email) => api.post('/users/forgot-password', { email });
export const verifyResetCode = (email, code) => api.post('/users/verify-reset-code', { email, code });
export const resetPassword = (email, code, newPassword) => api.post('/users/reset-password', { email, code, newPassword });

// Activity functions
export const getDailyActivity = (date) => api.get(`/activity/daily/${date}`);
export const getWeeklyActivity = () => api.get('/activity/weekly');
export const updateLimits = (limits) => api.put('/users/limits', { limits });
export const updateNotifications = (notifications) => api.put('/users/notifications', { notifications });

export default api;