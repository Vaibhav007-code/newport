const Database = require('better-sqlite3');
const path = require('path');

// Set the database path to /tmp in production (Vercel) or local path in development
const dbPath = process.env.VERCEL 
  ? path.join('/tmp', 'messages.db')
  : path.join(__dirname, 'messages.db');

// Create a new database connection
const db = new Database(dbPath, { verbose: console.log });

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

module.exports = db;
