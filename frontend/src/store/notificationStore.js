import { create } from 'zustand';

const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  isConnected: false,
  
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadCount: state.unreadCount + 1,
  })),
  
  markAsRead: (notificationId) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === notificationId ? { ...n, is_read: true } : n
    ),
    unreadCount: Math.max(0, state.unreadCount - 1),
  })),
  
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, is_read: true })),
    unreadCount: 0,
  })),
  
  deleteNotification: (notificationId) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== notificationId),
  })),
  
  deleteAllNotifications: () => set({
    notifications: [],
  }),
  
  setUnreadCount: (count) => set({ unreadCount: count }),
  
  setConnected: (isConnected) => set({ isConnected }),
  
  setNotifications: (notifications) => set({ notifications }),
}));

export default useNotificationStore;
