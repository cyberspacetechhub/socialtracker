import api from './api';

export const getNotifications = () => api.get('/notifications');

export const markAsRead = (notificationId) => api.put(`/notifications/${notificationId}/read`);

export const deleteNotification = (notificationId) => api.delete(`/notifications/${notificationId}`);

export const markAllAsRead = () => api.put('/notifications/mark-all-read');