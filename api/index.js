const mongoose = require('mongoose');
const Message = require('./models/Message');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { name, email, message } = req.body;
      
      // Create new message
      const newMessage = new Message({
        name,
        email,
        message,
      });

      // Save to database
      await newMessage.save();

      res.status(200).json({ message: 'Message sent successfully!' });
    } catch (error) {
      res.status(500).json({ error: 'Error sending message.' });
    }
  } else if (req.method === 'GET') {
    try {
      // Get all messages
      const messages = await Message.find().sort({ createdAt: -1 });
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching messages.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
