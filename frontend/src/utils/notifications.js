// Browser notification utilities
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const showNotification = (title, options = {}) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      body: options.body,
      tag: options.tag,
      requireInteraction: options.requireInteraction,
      silent: options.silent
      // Remove actions as they're not supported in basic notifications
    });

    // Auto close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    return notification;
  }
};

export const showLimitExceededNotification = (platform, usage, limit) => {
  const title = `Time limit exceeded on ${platform}`;
  const body = `You've used ${usage} minutes out of your ${limit} minute daily limit.`;
  
  return showNotification(title, {
    body,
    tag: `limit-${platform}`,
    requireInteraction: true
  });
};

export const showUsageWarningNotification = (platform, usage, limit) => {
  const percentage = Math.round((usage / limit) * 100);
  const title = `${percentage}% of daily limit used on ${platform}`;
  const body = `You've used ${usage} minutes out of your ${limit} minute daily limit.`;
  
  return showNotification(title, {
    body,
    tag: `warning-${platform}`,
    silent: true
  });
};

// Import toast dynamically to avoid issues if react-hot-toast is not available
let toast;
try {
  toast = require('react-hot-toast').default;
} catch (e) {
  // Fallback to console if toast library is not available
  toast = {
    success: (msg) => console.log('Success:', msg),
    error: (msg) => console.error('Error:', msg),
    info: (msg) => console.info('Info:', msg)
  };
}

export const showToast = (message, type = 'info') => {
  if (type === 'error') {
    toast.error(message);
  } else if (type === 'success') {
    toast.success(message);
  } else {
    toast(message);
  }
};