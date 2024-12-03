const Database = require('better-sqlite3');
const path = require('path');

// Log environment information
console.log('Environment:', {
  VERCEL: process.env.VERCEL,
  NODE_ENV: process.env.NODE_ENV,
  PWD: process.env.PWD,
  VERCEL_ENV: process.env.VERCEL_ENV
});

// Set the database path to /tmp in production (Vercel) or local path in development
const dbPath = process.env.VERCEL 
  ? '/tmp/messages.db'
  : path.join(__dirname, 'messages.db');

console.log('Database path:', dbPath);

try {
  // Create a new database connection
  const db = new Database(dbPath, { 
    verbose: console.log,
    fileMustExist: false
  });

  console.log('Database connection established');

  // Create messages table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Messages table created/verified');

  module.exports = db;
} catch (error) {
  console.error('Database initialization error:', {
    error: error.message,
    stack: error.stack,
    code: error.code
  });
  throw error;
}
