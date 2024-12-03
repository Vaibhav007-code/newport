const Database = require('better-sqlite3');
const path = require('path');

// Initialize database
const db = new Database(path.join(__dirname, 'messages.db'), { verbose: console.log });

// Create messages table if it doesn't exist
const init = () => {
    const createTable = `
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            read BOOLEAN DEFAULT 0
        )
    `;
    db.exec(createTable);
};

// Initialize the database
init();

module.exports = db;
