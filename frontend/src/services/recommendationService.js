import api from './api';

export const getRecommendations = () => api.get('/recommendations');

export const markRecommendationAsRead = (recommendationId) => api.put(`/recommendations/${recommendationId}/read`);

export const generateRecommendations = () => api.post('/recommendations/generate');