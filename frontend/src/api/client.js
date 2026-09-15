import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавить токен к каждому запросу
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const notificationAPI = {
  // Получить уведомления
  getNotifications: (skip = 0, limit = 20, unreadOnly = false) =>
    apiClient.get('/notifications/', { params: { skip, limit, unread_only: unreadOnly } }),
  
  // Получить количество непрочитанных уведомлений
  getUnreadCount: () => apiClient.get('/notifications/unread-count'),
  
  // Отметить уведомление как прочитанное
  markAsRead: (notificationId) => apiClient.post(`/notifications/${notificationId}/read`),
  
  // Отметить все уведомления как прочитанные
  markAllAsRead: () => apiClient.post('/notifications/read-all'),
  
  // Удалить уведомление
  deleteNotification: (notificationId) => apiClient.delete(`/notifications/${notificationId}`),
  
  // Удалить все уведомления
  deleteAllNotifications: () => apiClient.delete('/notifications/'),
};

export const eventAPI = {
  // Создать событие
  createEvent: (eventData) => apiClient.post('/events/', eventData),
  
  // Получить событие
  getEvent: (eventId) => apiClient.get(`/events/${eventId}`),
};

export const preferenceAPI = {
  // Получить настройки
  getPreferences: () => apiClient.get('/preferences/'),
  
  // Обновить настройки
  updatePreferences: (preferences) => apiClient.put('/preferences/', preferences),
};

export default apiClient;
