// routes/focus.js
// Handles the focus timer sessions.

const express = require('express');
const db = require('../db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken);

// GET /api/focus - Get all focus sessions
router.get('/', (req, res) => {
    try {
        const sessions = db.prepare('SELECT * FROM focus_sessions WHERE user_id = ? ORDER BY date ASC').all(req.userId);
        
        // The frontend expects focus object like { '2023-10-05': 45, '2023-10-06': 120 }
        const focusMap = {};
        sessions.forEach(s => {
            focusMap[s.date] = s.minutes;
        });

        res.json({ success: true, data: focusMap });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to fetch focus sessions.' });
    }
});

// POST /api/focus - Upsert focus session (add minutes to a specific date)
router.post('/', (req, res) => {
    try {
        const { date, minutes } = req.body;

        if (!date || minutes === undefined) {
            return res.status(400).json({ success: false, error: 'Date and minutes are required.' });
        }

        // UPSERT logic: If date doesn't exist for user, insert it. 
        // If it does, update by adding minutes.
        // We use ON CONFLICT because we set UNIQUE(user_id, date) in db.js
        const stmt = db.prepare(`
            INSERT INTO focus_sessions (user_id, date, minutes)
            VALUES (?, ?, ?)
            ON CONFLICT(user_id, date) 
            DO UPDATE SET minutes = minutes + excluded.minutes
        `);

        stmt.run(req.userId, date, minutes);

        // Fetch the updated total for that day to return
        const updatedSession = db.prepare('SELECT * FROM focus_sessions WHERE user_id = ? AND date = ?').get(req.userId, date);

        res.json({ success: true, data: updatedSession });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to save focus session.' });
    }
});

module.exports = router;
