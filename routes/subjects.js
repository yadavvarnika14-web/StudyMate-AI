// routes/subjects.js
// Handles subjects and their nested topics.

const express = require('express');
const db = require('../db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken); // Protect all routes

// GET /api/subjects - Get all subjects with their topics nested
router.get('/', (req, res) => {
    try {
        // First, get all subjects for the user
        const subjects = db.prepare('SELECT * FROM subjects WHERE user_id = ?').all(req.userId);
        
        // Then, get all topics for these subjects
        // In a more complex app we might use a JOIN, but this is simple and clear
        const mappedSubjects = subjects.map(subject => {
            const topics = db.prepare('SELECT * FROM topics WHERE subject_id = ?').all(subject.id);
            
            // Map topics to have boolean 'done'
            const mappedTopics = topics.map(t => ({
                id: t.id,
                name: t.name,
                done: t.done === 1
            }));
            
            return {
                ...subject,
                topics: mappedTopics
            };
        });

        res.json({ success: true, data: mappedSubjects });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to fetch subjects.' });
    }
});

// POST /api/subjects - Create a new subject
router.post('/', (req, res) => {
    try {
        const { name, difficulty, exam_date } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, error: 'Subject name is required.' });
        }

        const stmt = db.prepare(`
            INSERT INTO subjects (user_id, name, difficulty, exam_date)
            VALUES (?, ?, ?, ?)
        `);

        const info = stmt.run(req.userId, name, difficulty || 'Medium', exam_date || null);
        const newSubjectId = info.lastInsertRowid;

        res.status(201).json({
            success: true,
            data: {
                id: newSubjectId,
                name,
                difficulty: difficulty || 'Medium',
                exam_date: exam_date || null,
                topics: [] // Starts empty
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to create subject.' });
    }
});

// PUT /api/subjects/:id - Update subject details
router.put('/:id', (req, res) => {
    try {
        const subjectId = req.params.id;
        const { name, difficulty, exam_date } = req.body;

        const subject = db.prepare('SELECT * FROM subjects WHERE id = ? AND user_id = ?').get(subjectId, req.userId);
        
        if (!subject) {
            return res.status(404).json({ success: false, error: 'Subject not found.' });
        }

        const stmt = db.prepare(`
            UPDATE subjects 
            SET name = ?, difficulty = ?, exam_date = ?
            WHERE id = ? AND user_id = ?
        `);

        stmt.run(
            name || subject.name,
            difficulty || subject.difficulty,
            exam_date !== undefined ? exam_date : subject.exam_date,
            subjectId,
            req.userId
        );

        res.json({ success: true, data: { id: subjectId } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to update subject.' });
    }
});

// DELETE /api/subjects/:id - Delete subject (and cascade topics)
router.delete('/:id', (req, res) => {
    try {
        const subjectId = req.params.id;
        
        // Thanks to 'ON DELETE CASCADE' in our db schema, deleting the subject
        // will automatically delete its associated topics.
        const stmt = db.prepare('DELETE FROM subjects WHERE id = ? AND user_id = ?');
        const info = stmt.run(subjectId, req.userId);

        if (info.changes === 0) {
            return res.status(404).json({ success: false, error: 'Subject not found.' });
        }

        res.json({ success: true, data: { deleted_id: subjectId } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to delete subject.' });
    }
});

// POST /api/subjects/:id/topics - Add a topic to a subject
router.post('/:id/topics', (req, res) => {
    try {
        const subjectId = req.params.id;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, error: 'Topic name is required.' });
        }

        // Verify subject belongs to user
        const subject = db.prepare('SELECT id FROM subjects WHERE id = ? AND user_id = ?').get(subjectId, req.userId);
        if (!subject) return res.status(404).json({ success: false, error: 'Subject not found.' });

        const stmt = db.prepare('INSERT INTO topics (subject_id, name, done) VALUES (?, ?, 0)');
        const info = stmt.run(subjectId, name);

        res.status(201).json({
            success: true,
            data: { id: info.lastInsertRowid, name, done: false }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to add topic.' });
    }
});

// PUT /api/subjects/:subjectId/topics/:topicId - Update a topic (e.g. toggle done)
router.put('/:subjectId/topics/:topicId', (req, res) => {
    try {
        const { subjectId, topicId } = req.params;
        const { done } = req.body;

        // Verify subject ownership
        const subject = db.prepare('SELECT id FROM subjects WHERE id = ? AND user_id = ?').get(subjectId, req.userId);
        if (!subject) return res.status(404).json({ success: false, error: 'Subject not found.' });

        const stmt = db.prepare('UPDATE topics SET done = ? WHERE id = ? AND subject_id = ?');
        stmt.run(done ? 1 : 0, topicId, subjectId);

        res.json({ success: true, message: 'Topic updated.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to update topic.' });
    }
});

// DELETE /api/subjects/:subjectId/topics/:topicId - Delete a topic
router.delete('/:subjectId/topics/:topicId', (req, res) => {
    try {
        const { subjectId, topicId } = req.params;

        const subject = db.prepare('SELECT id FROM subjects WHERE id = ? AND user_id = ?').get(subjectId, req.userId);
        if (!subject) return res.status(404).json({ success: false, error: 'Subject not found.' });

        const stmt = db.prepare('DELETE FROM topics WHERE id = ? AND subject_id = ?');
        stmt.run(topicId, subjectId);

        res.json({ success: true, message: 'Topic deleted.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to delete topic.' });
    }
});

module.exports = router;
