import { useEffect } from 'react';
import { useProfile, useDailyUsage } from '../services/queries';
import { showLimitExceededNotification, showUsageWarningNotification, requestNotificationPermission } from '../utils/notifications';
import { PLATFORMS } from '../config/api';

export function useNotifications() {
  const { data: user } = useProfile();
  const today = new Date().toISOString().split('T')[0];
  const { data: dailyUsage = {} } = useDailyUsage(today);

  useEffect(() => {
    // Request notification permission on mount
    if (user?.notifications?.browser) {
      requestNotificationPermission();
    }
  }, [user?.notifications?.browser]);

  useEffect(() => {
    if (!user?.notifications?.browser || !dailyUsage) return;

    // Check for limit violations and send notifications
    Object.entries(PLATFORMS).forEach(([platform, platformData]) => {
      const usage = dailyUsage[platform];
      const limit = user.limits?.[platform] || 60;
      
      if (usage?.duration) {
        const percentage = (usage.duration / limit) * 100;
        
        // Send notification when limit is exceeded
        if (percentage >= 100) {
          showLimitExceededNotification(
            platformData.name,
            usage.duration,
            limit
          );
        }
        // Send warning at 80%
        else if (percentage >= 80) {
          showUsageWarningNotification(
            platformData.name,
            usage.duration,
            limit
          );
        }
      }
    });
  }, [dailyUsage, user]);

  return {
    requestPermission: requestNotificationPermission
  };
}