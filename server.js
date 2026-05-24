import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import router from './routes/auth.js';
import projectRouter from './routes/projectRoute.js';
import statsrouter from './routes/stats.js';
import notificationRouter from './routes/notificationRoute.js';
import discussionRouter from './routes/discussions.js';
import communityRouter from './routes/community.js';
import meetingRouter from './routes/meetings.js';
import eventsRouter from './routes/events.js';
import githubRouter from './routes/github.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
dotenv.config();

const app = express();
// Security middleware\napp.use(helmet());\n\nconst limiter = rateLimit({\n  windowMs: 15 * 60 * 1000, // 15 minutes\n  max: 100, // limit each IP to 100 requests per windowMs\n  message: { message: 'Too many requests from this IP, please try again later.' },\n  standardHeaders: true,\n  legacyHeaders: false,\n});\napp.use('/api/', limiter);
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', router);
app.use('/api/projects', projectRouter);
app.use('/api/stats', statsrouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/discussions', discussionRouter);
app.use('/api/community', communityRouter);
app.use('/api/meetings', meetingRouter);
app.use('/api/events', eventsRouter);
app.use('/api/github', githubRouter);


// Socket.IO connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user room
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible in routes
app.set('io', io);

//connect to mongo
connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
