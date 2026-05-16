const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

let serverTimeOffset = 0;

/**
 * Calculates the offset between client time and server time.
 * offset = serverTime - clientTime
 */
export const syncServerTime = async () => {
  try {
    const start = Date.now();
    const response = await fetch(`${SOCKET_URL}/time`);
    const end = Date.now();
    const { timestamp } = await response.json();
    
    const serverTime = new Date(timestamp).getTime();
    // Use average of start/end to account for network latency
    const clientTime = (start + end) / 2;
    
    serverTimeOffset = serverTime - clientTime;
    console.log(`[TimeSync] Server offset: ${serverTimeOffset}ms`);
  } catch (error) {
    console.error('[TimeSync] Failed to sync server time:', error);
  }
};

/**
 * Gets the current time adjusted by the server offset.
 */
export const getServerNow = () => {
  return Date.now() + serverTimeOffset;
};
