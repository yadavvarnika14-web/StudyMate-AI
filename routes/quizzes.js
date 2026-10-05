// routes/quizzes.js
// Handles quiz results.

const express = require('express');
const db = require('../db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken);

// GET /api/quizzes - Get all quiz results for user
router.get('/', (req, res) => {
    try {
        const quizzes = db.prepare('SELECT * FROM quizzes WHERE user_id = ? ORDER BY date DESC').all(req.userId);
        res.json({ success: true, data: quizzes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to fetch quizzes.' });
    }
});

// POST /api/quizzes - Save a new quiz result
router.post('/', (req, res) => {
    try {
        const { subject, topic, score, total, pct, date } = req.body;

        if (!subject || score === undefined || !total || pct === undefined || !date) {
            return res.status(400).json({ success: false, error: 'Missing required fields for quiz result.' });
        }

        const stmt = db.prepare(`
            INSERT INTO quizzes (user_id, subject, topic, score, total, pct, date)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        const info = stmt.run(req.userId, subject, topic || '', score, total, pct, date);
        const newQuiz = db.prepare('SELECT * FROM quizzes WHERE id = ?').get(info.lastInsertRowid);
        
        res.status(201).json({ success: true, data: newQuiz });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to save quiz result.' });
    }
});

module.exports = router;
