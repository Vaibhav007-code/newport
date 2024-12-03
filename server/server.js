const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();
const path = require('path');

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

// Message routes
app.post('/api/messages', (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Insert message into database
    const stmt = db.prepare('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)');
    const result = stmt.run(name, email, message);
    
    // Notify through socket if connected
    io.emit('new-message', { id: result.lastInsertRowid });
    
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// Get all messages (you might want to add authentication here)
app.get('/api/messages', (req, res) => {
  try {
    const messages = db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Mark message as read
app.put('/api/messages/:id/read', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('UPDATE messages SET read = 1 WHERE id = ?');
    stmt.run(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

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

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
