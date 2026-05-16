import { useEffect, useCallback } from 'react';
import { useAuthStore } from '@store/useAuthStore';
import { useSocketStore } from '@store/useSocketStore';
import { socket, updateSocketAuth } from '@lib/socket';
import { toast } from 'sonner';

export const useSocketManager = () => {
  const { session, user } = useAuthStore();
  const { 
    setSocket, 
    setIsConnected, 
    setIsReconnecting 
  } = useSocketStore();

  const disconnect = useCallback(() => {
    if (socket.connected) {
      console.log('[Socket] Manually disconnecting...');
      socket.disconnect();
    }
    // Cleanup state
    setIsConnected(false);
    setIsReconnecting(false);
    setSocket(null);
  }, [setSocket, setIsConnected, setIsReconnecting]);

  const connect = useCallback(() => {
    if (socket.connected) return;

    console.log('[Socket] Connecting...');
    updateSocketAuth(session?.access_token);
    socket.connect();
  }, [session?.access_token]);

  useEffect(() => {
    // Shared event handlers
    const onConnect = () => {
      console.log('[Socket] Connected with ID:', socket.id);
      setIsConnected(true);
      setIsReconnecting(false);
      setSocket(socket);
    };

    const onDisconnect = (reason: string) => {
      console.log(`[Socket] Disconnected: ${reason}`);
      setIsConnected(false);
      if (reason === 'io server disconnect') {
        socket.connect();
      }
    };

    const onConnectError = (error: any) => {
      console.error('[Socket] Connection error:', error);
      setIsConnected(false);
      setIsReconnecting(false);

      if (error.message === 'Authentication error') {
        toast.error('Realtime Session Expired');
        disconnect();
      }
    };

    const onReconnectAttempt = (attempt: number) => {
      console.log(`[Socket] Reconnection attempt #${attempt}`);
      setIsReconnecting(true);
    };

    const onReconnect = () => {
      console.log('[Socket] Reconnected');
      setIsConnected(true);
      setIsReconnecting(false);
    };

    // Attach listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('reconnect_attempt', onReconnectAttempt);
    socket.on('reconnect', onReconnect);

    // Initial connection logic
    if (user && !socket.connected) {
      connect();
    } else if (!user && socket.connected) {
      disconnect();
    }

    // Cleanup listeners on unmount
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('reconnect_attempt', onReconnectAttempt);
      socket.off('reconnect', onReconnect);
    };
  }, [user, connect, disconnect, setIsConnected, setIsReconnecting, setSocket]);

  // Handle token refresh
  useEffect(() => {
    if (session?.access_token) {
      updateSocketAuth(session.access_token);
    }
  }, [session?.access_token]);

  return { connect, disconnect };
};
