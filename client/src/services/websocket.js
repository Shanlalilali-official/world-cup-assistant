import { io } from 'socket.io-client';

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL?.trim() ||
  (import.meta.env.DEV ? import.meta.env.VITE_API_URL?.trim() || 'http://localhost:3001' : '');

let socket = null;

export function connectSocket() {
  if (!SOCKET_URL) return null;
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 5000,
  });

  socket.on('connect', () => {
    console.log('[WS] Connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('[WS] Disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.warn('[WS] Connection error:', err.message);
  });

  return socket;
}

export function subscribeToLiveScores(callback) {
  const s = connectSocket();
  if (!s) return () => {};

  s.emit('subscribe', 'live-scores');
  s.on('scoreUpdate', callback);

  return () => {
    s.off('scoreUpdate', callback);
    s.emit('unsubscribe', 'live-scores');
  };
}

export function getSocket() {
  return socket;
}
