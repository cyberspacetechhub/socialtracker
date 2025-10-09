import { create } from 'zustand';
import api from '../services/api';

export const useActivityStore = create((set, get) => ({
  dailyUsage: {},
  weeklyUsage: [],
  activityHistory: [],
  isLoading: false,

  fetchDailyUsage: async (date) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/activity/daily/${date}`);
      set({ dailyUsage: response.data.usage, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch daily usage:', error);
    }
  },

  fetchWeeklyUsage: async (startDate, endDate) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/activity/weekly?startDate=${startDate}&endDate=${endDate}`);
      set({ weeklyUsage: response.data.usage, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch weekly usage:', error);
    }
  },

  fetchActivityHistory: async (page = 1, platform = null) => {
    set({ isLoading: true });
    try {
      const params = new URLSearchParams({ page });
      if (platform) params.append('platform', platform);
      
      const response = await api.get(`/activity/history?${params}`);
      set({ activityHistory: response.data.activities, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch activity history:', error);
    }
  }
}));