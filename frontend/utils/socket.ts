import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const socket = io(SOCKET_URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    transports: ['polling', 'websocket'],
    path: '/socket.io/',
    withCredentials: true,
    timeout: 20000,
    forceNew: true,
    upgrade: true,
    rememberUpgrade: true,
    rejectUnauthorized: false
});

// Add connection error handling
socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
    // Try to reconnect with polling only if websocket fails
    if (socket.io.opts?.transports?.[0] === 'websocket') {
        console.log('Falling back to polling transport');
        socket.io.opts.transports = ['polling'];
    }
});

socket.on('connect', () => {
    console.log('Socket connected successfully');
    // Reset transports after successful connection
    if (socket.io.opts?.transports) {
        socket.io.opts.transports = ['polling', 'websocket'];
    }
});

socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
    if (reason === 'io server disconnect') {
        // Server initiated disconnect, try to reconnect
        socket.connect();
    }
});

socket.on('error', (error) => {
    console.error('Socket error:', error);
});

// Register the socket connection when user logs in
export const registerSocket = (userId: string) => {
    if (socket.connected) {
        console.log('Registering socket for user:', userId);
        socket.emit('register', userId);
    } else {
        console.log('Socket not connected, waiting for connection...');
        socket.on('connect', () => {
            console.log('Socket connected, registering user:', userId);
            socket.emit('register', userId);
        });
    }
};

// Listen for task assignment notifications
export const onTaskAssigned = (callback: (data: { message: string; taskId: string }) => void) => {
    socket.on('taskAssigned', callback);
};

// Clean up socket listeners
export const cleanupSocket = () => {
    socket.off('taskAssigned');
    socket.off('connect');
    socket.off('connect_error');
    socket.off('disconnect');
    socket.off('error');
};

export default socket;


