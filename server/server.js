const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { db, queries } = require('./db');
require('dotenv').config();
const path = require('path');

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? ['https://*.vercel.app', 'https://*.now.sh']
      : '*',
    methods: ['GET', 'POST'],
    credentials: true
  },
  path: '/socket.io/'
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://*.vercel.app', 'https://*.now.sh']
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
app.post('/api/messages', (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Insert message into database
    const result = queries.insertMessage.run(name, email, message);
    const newMessage = queries.getMessage.get(result.lastInsertRowid);
    
    // Emit new message to all connected clients
    io.emit('newMessage', newMessage);
    
    res.status(201).json({ 
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ 
      error: 'Failed to save message',
      details: error.message 
    });
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
app.get('/api/admin/messages', (req, res) => {
  try {
    const messages = queries.getAllMessages.all();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
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
