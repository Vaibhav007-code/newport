const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'messages.db');
console.log('Database path:', dbPath);

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }
  console.log('Connected to database');
});

// Create messages table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating messages table:', err);
      process.exit(1);
    }
    console.log('Messages table ready');
  });
});

const queries = {
  // Insert a new message
  insertMessage: (name, email, message) => {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)';
      db.run(query, [name, email, message], function(err) {
        if (err) {
          console.error('Error inserting message:', err);
          reject(err);
        } else {
          console.log('Message inserted with ID:', this.lastID);
          resolve(this.lastID);
        }
      });
    });
  },

  // Get a specific message by ID
  getMessage: (id) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM messages WHERE id = ?';
      db.get(query, [id], (err, row) => {
        if (err) {
          console.error('Error getting message:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  // Get all messages
  getAllMessages: () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM messages ORDER BY created_at DESC';
      db.all(query, [], (err, rows) => {
        if (err) {
          console.error('Error getting all messages:', err);
          reject(err);
        } else {
          console.log(`Retrieved ${rows?.length || 0} messages`);
          resolve(rows || []);
        }
      });
    });
  }
};

// Handle process termination
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
      process.exit(1);
    }
    console.log('Database connection closed');
    process.exit(0);
  });
});

module.exports = {
  db,
  queries
};
