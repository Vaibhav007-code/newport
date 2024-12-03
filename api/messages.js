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
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  }

  try {
    // Log the raw request body for debugging
    console.log('Raw request body:', req.body);

    // Ensure request body is properly parsed
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      console.log('Parsed body:', body);
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return res.status(400).json({ 
        success: false,
        message: 'Invalid request body format'
      });
    }

    const { name, email, message } = body;

    // Log received data
    console.log('Received data:', { name, email, message: message?.substring(0, 50) + '...' });

    // Validate input
    if (!name || !email || !message) {
      console.log('Missing required fields:', { name: !!name, email: !!email, message: !!message });
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required',
        received: { name: !!name, email: !!email, message: !!message }
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email format'
      });
    }

    try {
      console.log('Attempting to save to database...');
      // Prepare and execute the insert statement
      const stmt = db.prepare('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)');
      const result = stmt.run(name, email, message);

      console.log('Message saved successfully:', result.lastInsertRowid);

      res.status(200).json({ 
        success: true,
        message: 'Message sent successfully',
        id: result.lastInsertRowid
      });
    } catch (dbError) {
      console.error('Database error details:', {
        error: dbError.message,
        stack: dbError.stack,
        code: dbError.code
      });
      res.status(500).json({ 
        success: false,
        message: 'Failed to save message to database',
        error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }
  } catch (error) {
    console.error('Error processing request details:', {
      error: error.message,
      stack: error.stack,
      code: error.code
    });
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = handler;
