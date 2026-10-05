// routes/user.js
// Handles user profile and settings like XP, daily goals.

const express = require('express');
const db = require('../db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken);

// GET /api/user - Get current user's profile info
router.get('/', (req, res) => {
    try {
        const user = db.prepare('SELECT id, email, name, xp, daily_goal, notifications, created_at FROM users WHERE id = ?').get(req.userId);
        
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found.' });
        }

        res.json({ success: true, data: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to fetch user profile.' });
    }
});

// PUT /api/user - Update profile or settings
router.put('/', (req, res) => {
    try {
        const { name, daily_goal, notifications } = req.body;

        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);

        const stmt = db.prepare(`
            UPDATE users 
            SET name = ?, daily_goal = ?, notifications = ?
            WHERE id = ?
        `);

        stmt.run(
            name || user.name,
            daily_goal !== undefined ? daily_goal : user.daily_goal,
            notifications !== undefined ? (notifications ? 1 : 0) : user.notifications,
            req.userId
        );

        const updatedUser = db.prepare('SELECT id, email, name, xp, daily_goal, notifications FROM users WHERE id = ?').get(req.userId);
        res.json({ success: true, data: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to update user.' });
    }
});

// PUT /api/user/xp - Update User XP
router.put('/xp', (req, res) => {
    try {
        const { delta, xp } = req.body;

        const user = db.prepare('SELECT xp FROM users WHERE id = ?').get(req.userId);

        let newXp = user.xp;
        if (xp !== undefined) {
            // Set an exact amount
            newXp = xp;
        } else if (delta !== undefined) {
            // Add or subtract from current amount
            newXp += delta;
        }

        // Prevent negative XP
        if (newXp < 0) newXp = 0;

        const stmt = db.prepare('UPDATE users SET xp = ? WHERE id = ?');
        stmt.run(newXp, req.userId);

        res.json({ success: true, data: { xp: newXp } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to update XP.' });
    }
});

module.exports = router;
