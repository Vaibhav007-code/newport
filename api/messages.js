const db = require('./db');

const handler = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    try {
      // Prepare and execute the insert statement
      const stmt = db.prepare('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)');
      const result = stmt.run(name, email, message);

      res.status(200).json({ 
        success: true,
        message: 'Message sent successfully',
        id: result.lastInsertRowid
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      res.status(500).json({ 
        success: false,
        message: 'Failed to save message to database'
      });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = handler;
