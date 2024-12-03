const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const Message = require('../api/models/Message');
require('dotenv').config();
const path = require('path');

const app = express();
const server = http.createServer(app);

// Connect to MongoDB with error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Successfully connected to MongoDB');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Handle MongoDB connection errors
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error during MongoDB shutdown:', err);
    process.exit(1);
  }
});

// Socket.IO setup with proper CORS
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? ['https://*.vercel.app', 'https://*.now.sh']
      : '*',
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
  console.log('Received message request:', req.body);
  
  try {
    const { name, email, message } = req.body;
    
    // Validate input
    if (!name || !email || !message) {
      console.log('Validation failed:', { name, email, message });
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Create new message
    const newMessage = new Message({
      name,
      email,
      message,
      read: false
    });

    console.log('Saving message:', newMessage);

    // Save message to MongoDB
    const savedMessage = await newMessage.save();
    console.log('Message saved successfully:', savedMessage);
    
    // Emit the new message to all connected clients
    io.emit('newMessage', savedMessage);
    
    res.status(201).json({ 
      message: 'Message sent successfully',
      data: savedMessage 
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
app.get('/api/messages', async (req, res) => {
  console.log('Fetching messages');
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    console.log(`Found ${messages.length} messages`);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Mark message as read
app.put('/api/messages/:id', async (req, res) => {
  console.log('Marking message as read:', req.params.id);
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!message) {
      console.log('Message not found:', req.params.id);
      return res.status(404).json({ error: 'Message not found' });
    }
    console.log('Message marked as read:', message);
    res.json(message);
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
}

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
