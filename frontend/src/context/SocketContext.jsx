import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    let newSocket = null;
    try {
      const socketServerUrl =
        import.meta.env.VITE_SOCKET_URL ||
        import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') ||
        window.location.origin;

      newSocket = io(socketServerUrl, {
        transports: ['websocket', 'polling'],
        timeout: 5000,
      });

      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('⚡ Connected to real-time Socket.io server');
        if (user?.id) {
          newSocket.emit('joinRoom', user.id);
        }
      });

      newSocket.on('connect_error', () => {
        // Silent connection fallback when backend server is offline
      });
    } catch (err) {
      console.warn('Socket initialization fallback:', err);
    }

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, [user]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
