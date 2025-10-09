import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from './api';

// Auth queries
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get('/users/profile');
      return response.data.user;
    },
    retry: false
  });
};

// Activity queries
export const useDailyUsage = (date) => {
  return useQuery({
    queryKey: ['dailyUsage', date],
    queryFn: async () => {
      const response = await api.get(`/activity/daily/${date}`);
      return response.data.usage;
    },
    enabled: !!date
  });
};

export const useWeeklyUsage = (startDate, endDate) => {
  return useQuery({
    queryKey: ['weeklyUsage', startDate, endDate],
    queryFn: async () => {
      const response = await api.get(`/activity/weekly?startDate=${startDate}&endDate=${endDate}`);
      return response.data.usage;
    },
    enabled: !!(startDate && endDate)
  });
};

export const useActivityHistory = (page = 1, platform = null) => {
  return useQuery({
    queryKey: ['activityHistory', page, platform],
    queryFn: async () => {
      const params = new URLSearchParams({ page });
      if (platform) params.append('platform', platform);
      const response = await api.get(`/activity/history?${params}`);
      return response.data;
    }
  });
};

// Mutations
export const useUpdateLimits = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (limits) => {
      const response = await api.put('/users/limits', { limits });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['profile']);
    }
  });
};

export const useUpdateNotifications = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notifications) => {
      const response = await api.put('/users/notifications', { notifications });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['profile']);
    }
  });
};