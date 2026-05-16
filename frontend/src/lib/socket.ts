import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

// Create a singleton instance
export const socket: Socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  autoConnect: false, // We'll manage connection manually
});

// Helper to update auth token
export const updateSocketAuth = (token?: string) => {
  // Only update and reconnect if the token actually changed
  if (socket.auth && (socket.auth as any).token === token) return;
  
  console.log('[Socket] Updating auth token...');
  socket.auth = { token };
  
  if (socket.connected) {
    // Force a reconnect to apply the new token to the server-side middleware
    socket.disconnect().connect();
    console.log('[Socket] Reconnecting with new auth token');
  }
};
