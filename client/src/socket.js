import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL;
console.log(SOCKET_URL);

export const socket = io(import.meta.env.VITE_API_URL, {
  autoConnect: false,
  transports: ['websocket'],
  path: '/socket.io',
});
