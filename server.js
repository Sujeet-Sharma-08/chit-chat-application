import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connection from './config/connection.js';
import authRoutes from './routes/authRoute.js';
import messageRoutes from './routes/messageRoutes.js';
import getUserForSidebar from './routes/getUserForSidebarRoute.js';
import { app,server } from './socket/socketIO.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(cors({
  origin: '*',  // frontend url
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/message', messageRoutes);
app.use('/api/v1/users', getUserForSidebar);

app.options('*', cors());


// Start the server
server.listen(PORT, () => {
  connection();
  console.log(`App is listening on port: ${PORT}`);
});
