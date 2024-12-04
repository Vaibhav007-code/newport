const express = require('express');
const router = express.Router();
const { queries } = require('../db');

// Message routes
router.post('/messages', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    console.log('Received message:', { name, email, message });
    
    // Validate input
    if (!name || !email || !message) {
      console.log('Validation failed: Missing fields');
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Insert message into database
    console.log('Attempting to save message to database...');
    const messageId = await queries.insertMessage(name, email, message);
    console.log('Message saved with ID:', messageId);
    
    const newMessage = await queries.getMessage(messageId);
    console.log('Retrieved saved message:', newMessage);
    
    // Get the io instance
    const io = req.app.get('io');
    if (io) {
      // Emit the new message to all connected clients
      io.emit('new-message', newMessage);
    }
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to save message', details: error.message });
  }
});

// Admin routes
router.get('/admin/messages', async (req, res) => {
  console.log('Admin messages request received');
  try {
    console.log('Attempting to fetch messages from database...');
    const messages = await queries.getAllMessages();
    console.log('Messages fetched:', messages);
    
    if (!messages) {
      console.log('No messages found in database');
      return res.status(404).json({ error: 'No messages found' });
    }
    
    if (!Array.isArray(messages)) {
      console.log('Invalid messages format:', messages);
      return res.status(500).json({ error: 'Invalid messages format' });
    }
    
    console.log(`Successfully fetched ${messages.length} messages`);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ 
      error: 'Failed to fetch messages', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

module.exports = router;
