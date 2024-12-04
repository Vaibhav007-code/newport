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
  if (process.env.NODE_ENV === 'production') {
    // In production, allow the request origin
    return true; // This will reflect the request origin
  }
  return 'http://localhost:3000'; // In development, only allow localhost
};

// CORS configuration
const corsOptions = {
  origin: getAllowedOrigins(),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Socket.IO setup
const io = new Server(server, {
  cors: corsOptions,
  path: '/socket.io/'
});

// Apply CORS middleware
app.use(cors(corsOptions));
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    origin: req.headers.origin,
    host: req.headers.host,
    referer: req.headers.referer
  });
  next();
});

// API Routes
app.use('/api', require('./routes/api'));

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Static files served from:', path.join(__dirname, 'build'));
});
