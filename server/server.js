const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { db, queries } = require('./db');
require('dotenv').config();
const path = require('path');

const app = express();
const server = http.createServer(app);

// Get allowed origins from environment variable or use default ones
const getAllowedOrigins = () => {
  const defaultOrigins = [
    'http://localhost:3000',
    'https://*.vercel.app',
    'https://*.render.com',
    'https://*.now.sh'
  ];
  
  if (process.env.ALLOWED_ORIGINS) {
    return [...defaultOrigins, ...process.env.ALLOWED_ORIGINS.split(',')];
  }
  return defaultOrigins;
};

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? getAllowedOrigins()
      : '*',
    methods: ['GET', 'POST'],
    credentials: true
  },
  path: '/socket.io/'
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? getAllowedOrigins()
    : '*',
  credentials: true
}));
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Message routes
app.post('/api/messages', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Insert message into database
    const messageId = await queries.insertMessage(name, email, message);
    const newMessage = await queries.getMessage(messageId);
    
    // Emit the new message to all connected clients
    io.emit('new-message', newMessage);
    
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// Get all messages
app.get('/api/messages', (req, res) => {
  try {
    const messages = queries.getAllMessages.all();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Mark message as read
app.put('/api/messages/:id', (req, res) => {
  try {
    const { id } = req.params;
    queries.markAsRead.run(id);
    const message = queries.getMessage.get(id);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.json(message);
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// Admin routes
app.get('/api/admin/messages', async (req, res) => {
  try {
    const messages = await queries.getAllMessages();
    if (!messages) {
      return res.status(404).json({ error: 'No messages found' });
    }
    console.log('Fetched messages:', messages); // Debug log
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages', details: error.message });
  }
});

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
