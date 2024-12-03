const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.VERCEL_URL 
      : 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  },
  path: '/socket.io/',
  transports: ['websocket', 'polling'],
  allowEIO3: true
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.VERCEL_URL 
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Cache configuration
const messageCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Enhanced rate limiting configuration
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 1000, // limit each IP to 1000 requests per hour
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || req.headers['x-forwarded-for'],
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests. Please wait before trying again.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// Memory usage monitoring
const monitorMemoryUsage = () => {
  const used = process.memoryUsage();
  console.log(`Memory usage - RSS: ${Math.round(used.rss / 1024 / 1024)}MB, Heap: ${Math.round(used.heapUsed / 1024 / 1024)}MB`);
};

setInterval(monitorMemoryUsage, 60000); // Monitor every minute

// Cache middleware
const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl;
  const cachedResponse = messageCache.get(key);

  if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_TTL) {
    return res.json(cachedResponse.data);
  }
  next();
};

// Apply rate limiting and caching
app.use('/api/', limiter);
app.use('/api/messages', cacheMiddleware);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Message Schema
const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Admin authentication middleware
const authenticateAdmin = async (req, res, next) => {
  const adminToken = req.headers.authorization?.split(' ')[1];
  
  if (adminToken !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};

// Routes with caching
app.get('/api/messages', authenticateAdmin, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    
    // Cache the response
    messageCache.set(req.originalUrl, {
      data: messages,
      timestamp: Date.now()
    });
    
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

// Clean up expired cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of messageCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      messageCache.delete(key);
    }
  }
}, CACHE_TTL);

// Socket connection with enhanced error handling and rate limiting
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  let messageCount = 0;
  let lastMessageTime = Date.now();

  // Handle new message with rate limiting
  socket.on('send-message', async (messageData) => {
    try {
      // Rate limiting per socket
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

      // Reset counter if time window has passed
      if (now - lastMessageTime >= timeWindow) {
        messageCount = 0;
      }

      const { name, email, message } = messageData;
      
      // Validate input
      if (!name?.trim() || !email?.trim() || !message?.trim()) {
        socket.emit('message-sent', {
          success: false,
          error: 'All fields are required'
        });
        return;
      }

      // Save message with error handling
      const newMessage = new Message({ name, email, message });
      await newMessage.save();
      
      // Update rate limiting data
      messageCount++;
      lastMessageTime = now;

      // Broadcast to admin clients
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

  // Handle admin reply
  socket.on('admin-reply', async ({ messageId, reply }) => {
    try {
      const message = await Message.findById(messageId);
      if (message) {
        // Here you could implement email sending logic for the reply
        socket.emit('reply-sent', { success: true });
      }
    } catch (error) {
      socket.emit('reply-sent', { 
        success: false, 
        error: 'Failed to send reply' 
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the server for Vercel
module.exports = server;
