import { useEffect, useRef } from 'react';
import useNotificationStore from '../store/notificationStore';

const useWebSocket = (token) => {
  const ws = useRef(null);
  const { addNotification, setConnected } = useNotificationStore();
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  
  useEffect(() => {
    if (!token) return;
    
    const connectWebSocket = () => {
      try {
        const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:8000'}/api/ws?token=${token}`;
        ws.current = new WebSocket(wsUrl);
        
        ws.current.onopen = () => {
          console.log('WebSocket connected');
          setConnected(true);
          reconnectAttempts.current = 0;
        };
        
        ws.current.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            
            if (message.type === 'notification') {
              addNotification(message.data);
            } else if (message.type === 'connected') {
              console.log('Connected to notification system:', message.data);
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
        
        ws.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          setConnected(false);
        };
        
        ws.current.onclose = () => {
          console.log('WebSocket disconnected');
          setConnected(false);
          
          // Попытка переподключиться
          if (reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current += 1;
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
            console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current})`);
            setTimeout(connectWebSocket, delay);
          }
        };
      } catch (error) {
        console.error('Error establishing WebSocket connection:', error);
      }
    };
    
    connectWebSocket();
    
    // Отправлять heartbeat каждые 30 секунд
    const heartbeatInterval = setInterval(() => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);
    
    return () => {
      clearInterval(heartbeatInterval);
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [token, addNotification, setConnected]);
  
  return ws.current;
};

export default useWebSocket;
