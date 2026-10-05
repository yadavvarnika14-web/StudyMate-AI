// routes/auth.js
// Handles user registration and login.

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'studymate-secret-key';

// POST /api/auth/signup - Register a new user
router.post('/signup', async (req, res) => {
    try {
        const { email, name, password } = req.body;

        // Basic validation
        if (!email || !name || !password) {
            return res.status(400).json({ success: false, error: 'Email, name, and password are required.' });
        }

        // Check if user already exists
        const checkUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (checkUser) {
            return res.status(400).json({ success: false, error: 'Email is already in use.' });
        }

        // Hash the password for security
        // The "10" is the salt rounds (higher = more secure but slower)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const insertUser = db.prepare(`
            INSERT INTO users (email, name, password) 
            VALUES (?, ?, ?)
        `);
        
        const info = insertUser.run(email, name, hashedPassword);
        const newUserId = info.lastInsertRowid;

        // Generate a JWT token for the new user
        const token = jwt.sign({ userId: newUserId }, SECRET, { expiresIn: '7d' });

        // Return the token and user data
        res.status(201).json({
            success: true,
            data: {
                token,
                user: { id: newUserId, email, name, xp: 0, daily_goal: 3, notifications: 1 }
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Error during sign up.' });
    }
});

// POST /api/auth/login - Authenticate an existing user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required.' });
        }

        // Find the user by email
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        
        // If user doesn't exist, return error
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid email or password.' });
        }

        // Compare the provided password with the hashed password in the DB
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid email or password.' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '7d' });

        // Remove the password from the user object before sending it to the client
        delete user.password;

        res.json({
            success: true,
            data: { token, user }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Error during login.' });
    }
});

module.exports = router;
