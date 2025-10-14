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
    refetchInterval: 15000,
    refetchIntervalInBackground: true,
    enabled: !!localStorage.getItem('token')
  });

  useEffect(() => {
    notifications.forEach(notification => {
      if (!notification.read && !shownNotifications.current.has(notification._id)) {
        shownNotifications.current.add(notification._id);
        
        const platformName = notification.platform.charAt(0).toUpperCase() + notification.platform.slice(1);
        const message = `${platformName} Limit Exceeded: ${notification.usage}m used of ${notification.limit}m limit`;
        
        toast.error(message, {
          id: notification._id,
          duration: Infinity,
          icon: '⚠️',
          style: {
            background: '#fee2e2',
            color: '#dc2626',
            fontSize: '14px',
            maxWidth: '350px'
          },
          position: 'top-right'
        });
        
        // Add close button functionality
        setTimeout(() => {
          const toastElement = document.querySelector(`[data-toast-id="${notification._id}"]`);
          if (toastElement) {
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '×';
            closeBtn.style.cssText = 'position: absolute; top: 8px; right: 8px; background: none; border: none; color: #dc2626; font-size: 18px; cursor: pointer;';
            closeBtn.onclick = async () => {
              toast.dismiss(notification._id);
              try {
                await deleteNotification(notification._id);
                queryClient.invalidateQueries(['notifications']);
              } catch (error) {
                console.error('Failed to delete notification:', error);
              }
            };
            toastElement.style.position = 'relative';
            toastElement.appendChild(closeBtn);
          }
        }, 100);
      }
    });
    
    notifications.forEach(notification => {
      if (notification.read && shownNotifications.current.has(notification._id)) {
        shownNotifications.current.delete(notification._id);
        toast.dismiss(notification._id);
      }
    });
  }, [notifications, queryClient]);

  return { notifications };
};