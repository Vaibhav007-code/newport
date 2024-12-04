const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'messages.db');
console.log('Database path:', dbPath);

// Initialize database
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1); // Exit if we can't open the database
  } else {
    console.log('Connected to SQLite database');
    createTables();
  }
});

function createTables() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  db.run(createTableSQL, (err) => {
    if (err) {
      console.error('Error creating messages table:', err);
      process.exit(1);
    } else {
      console.log('Messages table ready');
    }
  });
}

// Database queries with proper error handling
const queries = {
  insertMessage: (name, email, message) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)';
      db.run(sql, [name, email, message], function(err) {
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

  getMessage: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM messages WHERE id = ?';
      db.get(sql, [id], (err, row) => {
        if (err) {
          console.error('Error getting message:', err);
          reject(err);
        } else {
          console.log('Retrieved message:', row);
          resolve(row);
        }
      });
    });
  },

  getAllMessages: () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM messages ORDER BY created_at DESC';
      db.all(sql, [], (err, rows) => {
        if (err) {
          console.error('Error getting all messages:', err);
          reject(err);
        } else {
          console.log(`Retrieved ${rows ? rows.length : 0} messages`);
          resolve(rows || []);
        }
      });
    });
  },

  markAsRead: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE messages SET read = 1 WHERE id = ?';
      db.run(sql, [id], (err) => {
        if (err) {
          console.error('Error marking message as read:', err);
          reject(err);
        } else {
          console.log('Message marked as read:', id);
          resolve();
        }
      });
    });
  }
};

// Handle database errors
db.on('error', (err) => {
  console.error('Database error:', err);
});

process.on('exit', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
  });
});

module.exports = { db, queries };
