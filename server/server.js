const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// In-memory message store for development
const messages = [];

// Socket.IO setup with proper CORS
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? ['https://*.vercel.app', 'https://*.now.sh']
      : 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  },
  path: '/socket.io/',
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://*.vercel.app', 'https://*.now.sh']
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Socket connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  let messageCount = 0;
  let lastMessageTime = Date.now();

  socket.on('send-message', async (messageData) => {
    try {
      const now = Date.now();
      const timeWindow = 60000; // 1 minute
      if (now - lastMessageTime < timeWindow && messageCount >= 5) {
        socket.emit('message-sent', {
          success: false,
          error: 'Please wait a moment before sending more messages.',
          retryAfter: Math.ceil((lastMessageTime + timeWindow - now) / 1000)
        });
        return;
      }

      const { name, email, message } = messageData;
      
      if (!name?.trim() || !email?.trim() || !message?.trim()) {
        socket.emit('message-sent', {
          success: false,
          error: 'All fields are required'
        });
        return;
      }

      // Store message
      const newMessage = {
        id: Date.now(),
        name,
        email,
        message,
        createdAt: new Date().toISOString()
      };
      messages.push(newMessage);
      
      messageCount++;
      lastMessageTime = now;

      socket.broadcast.emit('new-message', newMessage);
      
      socket.emit('message-sent', {
        success: true,
        message: 'Message sent successfully'
      });
    } catch (error) {
      console.error('Error processing message:', error);
      socket.emit('message-sent', {
        success: false,
        error: 'An error occurred. Please try again later.'
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
