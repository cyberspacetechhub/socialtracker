import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/users/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      set({ user, token, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/users/register', { name, email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      set({ user, token, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.response?.data?.error || 'Registration failed' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  fetchProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      set({ user: response.data.user });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  },

  updateLimits: async (limits) => {
    try {
      const response = await api.put('/users/limits', { limits });
      set({ user: response.data.user });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  }
}));