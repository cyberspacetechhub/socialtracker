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
        
        toast.error(
          (t) => (
            <div className="flex items-start justify-between w-full">
              <div className="flex-1 pr-3">
                <div className="font-medium text-sm">
                  {notification.platform.charAt(0).toUpperCase() + notification.platform.slice(1)} Limit Exceeded
                </div>
                <div className="text-xs mt-1 text-gray-600">
                  {notification.usage}m used of {notification.limit}m limit
                </div>
              </div>
              <button
                onClick={async () => {
                  toast.dismiss(t.id);
                  try {
                    await deleteNotification(notification._id);
                    queryClient.invalidateQueries(['notifications']);
                  } catch (error) {
                    console.error('Failed to delete notification:', error);
                  }
                }}
                className="text-gray-400 hover:text-gray-600 ml-2 text-lg leading-none"
              >
                ×
              </button>
            </div>
          ),
          {
            id: notification._id, // Use notification ID as toast ID
            duration: Infinity,
            icon: '⚠️',
            style: {
              background: '#fee2e2',
              color: '#dc2626',
              fontSize: '14px',
              maxWidth: '350px',
              padding: '12px'
            },
            position: 'top-right'
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