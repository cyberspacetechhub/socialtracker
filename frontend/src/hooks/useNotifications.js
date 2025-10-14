import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getNotifications } from '../services/notificationService';

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications().then(res => res.data.notifications),
    refetchInterval: 15000,
    refetchIntervalInBackground: true,
    enabled: !!localStorage.getItem('token')
  });

  const unreadNotifications = notifications.filter(n => !n.read);

  return { 
    notifications: unreadNotifications,
    refetch: () => queryClient.invalidateQueries(['notifications'])
  };
};