import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getNotifications, markAsRead } from '../services/notificationService';
import toast from 'react-hot-toast';

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications().then(res => res.data.notifications),
    refetchInterval: 15000, // Check every 15 seconds
    refetchIntervalInBackground: true,
    enabled: !!localStorage.getItem('token')
  });

  useEffect(() => {
    notifications.forEach(notification => {
      if (!notification.read) {
        const toastId = toast.error(notification.message, {
          duration: 10000,
          icon: '⚠️',
          style: {
            background: '#fee2e2',
            color: '#dc2626',
            fontSize: '14px'
          },
          onClose: async () => {
            try {
              await markAsRead(notification._id);
              queryClient.invalidateQueries(['notifications']);
            } catch (error) {
              console.error('Failed to mark notification as read:', error);
            }
          }
        });
      }
    });
  }, [notifications, queryClient]);

  return { notifications };
};