const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Determine database path based on environment
const isDevelopment = process.env.NODE_ENV !== 'production';
const dbPath = isDevelopment 
  ? path.join(__dirname, 'messages.db')
  : path.join('/tmp', 'messages.db'); // Use /tmp for Render hosting

// Ensure directory exists
const dbDir = path.dirname(dbPath);
const fs = require('fs');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    createTables();
  }
});

function createTables() {
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Database queries
const queries = {
  insertMessage: (name, email, message) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)',
        [name, email, message],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  },

  getMessage: (id) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM messages WHERE id = ?',
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  },

  getAllMessages: () => {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM messages ORDER BY created_at DESC',
        [],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  },

  markAsRead: (id) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE messages SET read = 1 WHERE id = ?',
        [id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }
};

module.exports = { db, queries };
