import express from 'express';
import { userRouter } from './routes/user';
import { taskRouter } from './routes/task';
import cors from 'cors';
import dotenv from 'dotenv';
import { notifRouter } from './routes/notification';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app);
const connectedUsers: { [key: string]: string } = {};

// CORS configuration
const allowedOrigins = [
    'http://localhost:3001',
    'https://task-management-system-va30.onrender.com'
];

const corsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());

// Socket.IO configuration
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST", "OPTIONS"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"]
    },
    transports: ['polling', 'websocket'],
    path: '/socket.io/',
    pingTimeout: 60000,
    pingInterval: 25000,
    allowEIO3: true,
    allowUpgrades: true,
    cookie: false,
    connectTimeout: 45000,
    maxHttpBufferSize: 1e8
});

// Add error handling for the server
io.engine.on("connection_error", (err) => {
    console.log('Connection error:', err);
});

io.engine.on("initial_headers", (headers, req) => {
    console.log('Setting initial headers for:', req.headers.origin);
    headers["Access-Control-Allow-Origin"] = process.env.NODE_ENV === 'production' 
        ? "https://task-management-system-va30.onrender.com" 
        : "http://localhost:3001";
    headers["Access-Control-Allow-Credentials"] = "true";
});

io.engine.on("headers", (headers, req) => {
    console.log('Setting headers for:', req.headers.origin);
    headers["Access-Control-Allow-Origin"] = process.env.NODE_ENV === 'production' 
        ? "https://task-management-system-va30.onrender.com" 
        : "http://localhost:3001";
    headers["Access-Control-Allow-Credentials"] = "true";
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('register', (userId) => {
        console.log('User registered:', userId, 'with socket:', socket.id);
        connectedUsers[userId] = socket.id;
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        for (const id in connectedUsers) {
            if (connectedUsers[id] === socket.id) {
                delete connectedUsers[id];
                break;
            }
        }
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
});

// Routes
app.use('/api/user', userRouter);
app.use('/api/task', taskRouter);
app.use('/api/notif', notifRouter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Socket.IO endpoint check
app.get('/socket.io/', (req, res) => {
    res.status(200).json({ status: 'Socket.IO endpoint is available' });
});

export { io, connectedUsers };

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Socket.IO path: /socket.io/`);
    console.log('Allowed origins:', allowedOrigins);
});
