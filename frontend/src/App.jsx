import React, { useEffect } from 'react';
import NotificationCenter from './components/NotificationCenter';
import useWebSocket from './hooks/useWebSocket';
import useNotificationStore from './store/notificationStore';

function App() {
  const token = localStorage.getItem('token');
  
  // Инициализировать WebSocket
  useWebSocket(token);
  
  const { isConnected } = useNotificationStore();
  
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* Navigation Bar */}
      <nav style={{
        backgroundColor: 'white',
        padding: '12px 20px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
          📢 Notification System
        </h1>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {!token ? (
            <p style={{ margin: 0, color: '#ff4458' }}>⚠️ Not authenticated</p>
          ) : (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                backgroundColor: isConnected ? '#f0f9f7' : '#fff5f5',
                borderRadius: '4px',
                fontSize: '12px',
              }}>
                <span style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: isConnected ? '#17bf63' : '#ff4458',
                  animation: isConnected ? 'pulse 2s infinite' : 'none',
                }}></span>
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>
              <NotificationCenter />
            </>
          )}
        </div>
      </nav>
      
      {/* Main Content */}
      <main style={{
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}>
          <h2>Welcome to Notification System</h2>
          
          {!token ? (
            <div style={{
              padding: '20px',
              backgroundColor: '#fff5f5',
              borderLeft: '4px solid #ff4458',
              borderRadius: '4px',
            }}>
              <p><strong>⚠️ Authentication Required</strong></p>
              <p>To use the notification system, you need to:</p>
              <ol>
                <li>Register or login to your account</li>
                <li>Get your JWT token</li>
                <li>Store the token in localStorage: <code>localStorage.setItem('token', 'your_jwt_token')</code></li>
                <li>Refresh the page</li>
              </ol>
              <p><small>For development, you can manually set a token in the browser console.</small></p>
            </div>
          ) : (
            <div style={{
              padding: '20px',
              backgroundColor: '#f0f9f7',
              borderLeft: '4px solid #17bf63',
              borderRadius: '4px',
            }}>
              <p><strong>✅ You are authenticated!</strong></p>
              <p>The notification system is ready to use. Click the bell icon in the top-right to view your notifications.</p>
              <p>Notifications will appear in real-time as they are sent to you.</p>
            </div>
          )}
          
          <div style={{ marginTop: '20px' }}>
            <h3>Features</h3>
            <ul>
              <li>✅ Real-time notifications via WebSocket</li>
              <li>✅ Mark notifications as read</li>
              <li>✅ Delete individual notifications</li>
              <li>✅ Clear all notifications</li>
              <li>✅ Unread notification counter</li>
              <li>✅ Connection status indicator</li>
              <li>✅ Auto-reconnection</li>
            </ul>
          </div>
          
          <div style={{ marginTop: '20px', color: '#657786' }}>
            <small>
              Made with ❤️ using FastAPI, React, and MySQL<br/>
              Check the <a href="https://github.com" style={{ color: '#1da1f2' }}>GitHub repository</a> for more information
            </small>
          </div>
        </div>
      </main>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export default App;
