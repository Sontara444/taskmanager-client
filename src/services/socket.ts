import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_BACKEND_URL, {
    withCredentials: true,
    autoConnect: false, // Connect manually when authenticated
});

export default socket;
