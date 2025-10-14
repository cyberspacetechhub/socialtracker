import { XMarkIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '../hooks/useNotifications';
import { deleteNotification } from '../services/notificationService';
import { useQueryClient } from '@tanstack/react-query';

export default function NotificationStack() {
  const { notifications } = useNotifications();
  const queryClient = useQueryClient();

  const handleDismiss = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      queryClient.invalidateQueries(['notifications']);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => {
        const platformName = notification.platform.charAt(0).toUpperCase() + notification.platform.slice(1);
        
        return (
          <div
            key={notification._id}
            className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg animate-slide-in"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-red-600 mr-2">⚠️</span>
                  <h4 className="text-sm font-medium text-red-800">
                    {platformName} Limit Exceeded
                  </h4>
                </div>
                <p className="text-xs text-red-600 mt-1">
                  {notification.usage}m used of {notification.limit}m limit
                </p>
              </div>
              <button
                onClick={() => handleDismiss(notification._id)}
                className="ml-2 text-red-400 hover:text-red-600 transition-colors"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}