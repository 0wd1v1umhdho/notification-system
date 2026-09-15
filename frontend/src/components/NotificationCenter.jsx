import React, { useEffect, useState } from 'react';
import useNotificationStore from '../store/notificationStore';
import { notificationAPI } from '../api/client';
import NotificationItem from './NotificationItem';

const NotificationCenter = () => {
  const { notifications, unreadCount, isConnected, markAllAsRead, deleteAllNotifications } = useNotificationStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    // Загрузить уведомления при монтировании
    loadNotifications();
  }, []);
  
  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await notificationAPI.getNotifications(0, 50);
      // TODO: setNotifications from API
      setError(null);
    } catch (err) {
      setError('Failed to load notifications');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      markAllAsRead();
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };
  
  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete all notifications?')) {
      try {
        await notificationAPI.deleteAllNotifications();
        deleteAllNotifications();
      } catch (err) {
        console.error('Error deleting notifications:', err);
      }
    }
  };
  
  return (
    <div style={{ position: 'relative' }}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          fontSize: '20px',
          cursor: 'pointer',
          padding: '8px',
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              backgroundColor: '#ff4458',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>
      
      {/* Notification Dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '0',
            backgroundColor: 'white',
            border: '1px solid #e1e8ed',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            width: '360px',
            maxHeight: '500px',
            overflowY: 'auto',
            zIndex: 1000,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #e1e8ed',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h3 style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>Notifications</h3>
              {!isConnected && (
                <small style={{ color: '#ff4458' }}>● Offline</small>
              )}
              {isConnected && (
                <small style={{ color: '#17bf63' }}>● Connected</small>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  title="Mark all as read"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: '#1da1f2',
                  }}
                >
                  ✓ Mark all
                </button>
              )}
              <button
                onClick={handleDeleteAll}
                title="Delete all"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  color: '#657786',
                }}
              >
                🗑️ Clear
              </button>
            </div>
          </div>
          
          {/* Content */}
          {isLoading && <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>}
          {error && <div style={{ padding: '20px', textAlign: 'center', color: '#ff4458' }}>{error}</div>}
          
          {!isLoading && !error && (
            <>
              {notifications.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#657786' }}>
                  No notifications
                </div>
              ) : (
                <div>
                  {notifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
