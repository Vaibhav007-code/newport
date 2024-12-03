const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

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

// Routes
app.get('/api/messages', authenticateAdmin, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

app.post('/api/messages/read/:id', authenticateAdmin, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Error updating message' });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle new message
  socket.on('send-message', async (messageData) => {
    try {
      const { name, email, message } = messageData;
      
      // Save message to database
      const newMessage = new Message({ name, email, message });
      await newMessage.save();
      
      // Emit to admin clients only
      socket.broadcast.emit('new-message', newMessage);
      
      // Acknowledge successful save
      socket.emit('message-sent', { success: true });
    } catch (error) {
      console.error('Error saving message:', error);
      socket.emit('message-sent', { 
        success: false, 
        error: 'Failed to send message' 
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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
