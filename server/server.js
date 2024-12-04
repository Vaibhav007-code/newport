const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Get allowed origins from environment variable or use default ones
const getAllowedOrigins = () => {
  if (process.env.NODE_ENV === 'production') {
    return true; // Allow request origin in production
  }
  return ['http://localhost:3000']; // In development, only allow localhost
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
  cors: corsOptions
});

// Store io instance on app for use in routes
app.set('io', io);

// Apply CORS middleware
app.use(cors(corsOptions));
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    headers: req.headers,
    body: req.body
  });
  next();
});

// API Routes
app.use('/api', require('./routes/api'));

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, '..', 'build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Static files served from:', path.join(__dirname, '..', 'build'));
});
