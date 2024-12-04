const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Determine database path based on environment
const isDevelopment = process.env.NODE_ENV !== 'production';
const dbPath = isDevelopment 
  ? path.join(__dirname, 'messages.db')
  : path.join('/tmp', 'messages.db'); // Use /tmp for Render hosting

// Ensure directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database
let db;
try {
  db = new Database(dbPath, { verbose: console.log });
  console.log('SQLite Database connected at:', dbPath);
  
  // Create messages table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      read BOOLEAN DEFAULT 0
    )
  `);
} catch (error) {
  console.error('Database initialization error:', error);
  // Fallback to in-memory database if file system is not writable
  if (error.code === 'SQLITE_CANTOPEN') {
    console.log('Falling back to in-memory database');
    db = new Database(':memory:', { verbose: console.log });
    db.exec(`
      CREATE TABLE messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        read BOOLEAN DEFAULT 0
      )
    `);
  } else {
    throw error;
  }
}

// Prepare common queries
const queries = {
  insertMessage: db.prepare('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)'),
  getAllMessages: db.prepare(`
    SELECT * FROM messages 
    ORDER BY created_at DESC
  `),
  markAsRead: db.prepare('UPDATE messages SET read = 1 WHERE id = ?'),
  getMessage: db.prepare('SELECT * FROM messages WHERE id = ?')
};

module.exports = { db, queries };
