const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In production, these should be environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // Change this in production!

// Hash the admin password on startup
let hashedPassword;
bcrypt.hash(ADMIN_PASSWORD, 10).then(hash => {
    hashedPassword = hash;
});

const auth = {
    // Login function
    async login(username, password) {
        // Check username
        if (username !== ADMIN_USERNAME) {
            throw new Error('Invalid credentials');
        }

        // Check password
        const isValid = await bcrypt.compare(password, hashedPassword);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }

        // Generate JWT token
        const token = jwt.sign(
            { username, role: 'admin' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return token;
    },

    // Middleware to verify JWT token
    verifyToken(req, res, next) {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ error: 'Invalid token' });
        }
    }
};

module.exports = auth;
