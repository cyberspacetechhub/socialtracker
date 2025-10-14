import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getNotifications, deleteNotification } from '../services/notificationService';
import toast from 'react-hot-toast';

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const shownNotifications = useRef(new Set());

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications().then(res => res.data.notifications),
    refetchInterval: 15000, // Check every 15 seconds
    refetchIntervalInBackground: true,
    enabled: !!localStorage.getItem('token')
  });

  useEffect(() => {
    notifications.forEach(notification => {
      if (!notification.read && !shownNotifications.current.has(notification._id)) {
        shownNotifications.current.add(notification._id);
        
        const platformName = notification.platform.charAt(0).toUpperCase() + notification.platform.slice(1);
        
        toast.error(
          `${platformName} Limit Exceeded: ${notification.usage}m used of ${notification.limit}m limit`,
          {
          {
            id: notification._id,
            duration: Infinity,
            icon: '⚠️',
            style: {
              background: '#fee2e2',
              color: '#dc2626',
              fontSize: '14px',
              maxWidth: '350px'
            },
            position: 'top-right',
            action: {
              label: '×',
              onClick: async () => {
                toast.dismiss(notification._id);
                try {
                  await deleteNotification(notification._id);
                  queryClient.invalidateQueries(['notifications']);
                } catch (error) {
                  console.error('Failed to delete notification:', error);
                }
              }
            }
          }
        );
      }
    });
    
    // Clean up shown notifications that are now read
    notifications.forEach(notification => {
      if (notification.read && shownNotifications.current.has(notification._id)) {
        shownNotifications.current.delete(notification._id);
        toast.dismiss(notification._id);
      }
    });
  }, [notifications, queryClient]);

  return { notifications };
};