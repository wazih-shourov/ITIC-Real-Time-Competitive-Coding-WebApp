import { useSocketStore } from '@store/useSocketStore';

/**
 * Custom hook to safely access the socket instance.
 * Returns the socket instance and connection states.
 */
export const useSocket = () => {
  const socket = useSocketStore((state) => state.socket);
  const isConnected = useSocketStore((state) => state.isConnected);
  const isReconnecting = useSocketStore((state) => state.isReconnecting);

  return {
    socket,
    isConnected,
    isReconnecting,
  };
};
