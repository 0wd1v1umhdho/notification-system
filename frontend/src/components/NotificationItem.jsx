import React from 'react';
import useNotificationStore from '../store/notificationStore';

const NotificationItem = ({ notification }) => {
  const { markAsRead, deleteNotification } = useNotificationStore();
  
  const handleMarkAsRead = () => {
    if (!notification.is_read) {
      markAsRead(notification.id);
      // Отправить запрос на сервер
      // TODO: implement API call
    }
  };
  
  const handleDelete = () => {
    deleteNotification(notification.id);
    // Отправить запрос на сервер
    // TODO: implement API call
  };
  
  const getNotificationIcon = (eventType) => {
    const icons = {
      like: '👍',
      comment: '💬',
      mention: '@',
      friend_request: '👤',
      friend_accepted: '🤝',
      post: '📝',
      follow: '👁️',
      message: '✉️',
      other: '🔔',
    };
    return icons[eventType] || '🔔';
  };
  
  return (
    <div 
      className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}
      style={{
        padding: '12px',
        borderBottom: '1px solid #e1e8ed',
        display: 'flex',
        gap: '12px',
        cursor: 'pointer',
        backgroundColor: notification.is_read ? 'transparent' : '#f5f9fc',
        transition: 'background-color 0.2s',
      }}
      onClick={handleMarkAsRead}
    >
      <div style={{ fontSize: '20px' }}>
        {getNotificationIcon(notification.event_type)}
      </div>
      
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
          {notification.actor.username}
        </div>
        <div style={{ color: '#657786', fontSize: '13px', marginTop: '4px' }}>
          {notification.title}
        </div>
        {notification.description && (
          <div style={{ color: '#657786', fontSize: '12px', marginTop: '4px' }}>
            {notification.description}
          </div>
        )}
        <div style={{ color: '#999', fontSize: '11px', marginTop: '4px' }}>
          {new Date(notification.created_at).toLocaleString()}
        </div>
      </div>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          color: '#999',
          padding: '0 8px',
        }}
      >
        ✕
      </button>
    </div>
  );
};

export default NotificationItem;
