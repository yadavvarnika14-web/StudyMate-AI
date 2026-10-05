// routes/notes.js
// Handles saving and retrieving notes.

const express = require('express');
const db = require('../db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken);

// GET /api/notes - Get all notes for the user (with optional filters)
router.get('/', (req, res) => {
    try {
        const { subject, search } = req.query;
        
        let query = 'SELECT * FROM notes WHERE user_id = ?';
        const params = [req.userId];

        // If filtering by subject
        if (subject) {
            query += ' AND subject = ?';
            params.push(subject);
        }

        // If searching title or body
        if (search) {
            query += ' AND (title LIKE ? OR body LIKE ?)';
            // Adding % for SQL LIKE wildcard search
            params.push(`%${search}%`, `%${search}%`);
        }

        // Sort newest first
        query += ' ORDER BY created_at DESC';

        const notes = db.prepare(query).all(...params);
        res.json({ success: true, data: notes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to fetch notes.' });
    }
});

// POST /api/notes - Create a new note
router.post('/', (req, res) => {
    try {
        const { title, subject, body, summary } = req.body;

        const stmt = db.prepare(`
            INSERT INTO notes (user_id, title, subject, body, summary)
            VALUES (?, ?, ?, ?, ?)
        `);

        const info = stmt.run(
            req.userId, 
            title || 'Untitled Note', 
            subject || 'General', 
            body || '', 
            summary || ''
        );
        
        const newNote = db.prepare('SELECT * FROM notes WHERE id = ?').get(info.lastInsertRowid);
        
        res.status(201).json({ success: true, data: newNote });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to create note.' });
    }
});

// PUT /api/notes/:id - Update an existing note
router.put('/:id', (req, res) => {
    try {
        const noteId = req.params.id;
        const { title, subject, body, summary } = req.body;

        const existingNote = db.prepare('SELECT * FROM notes WHERE id = ? AND user_id = ?').get(noteId, req.userId);
        
        if (!existingNote) {
            return res.status(404).json({ success: false, error: 'Note not found.' });
        }

        const stmt = db.prepare(`
            UPDATE notes 
            SET title = ?, subject = ?, body = ?, summary = ?
            WHERE id = ? AND user_id = ?
        `);

        stmt.run(
            title !== undefined ? title : existingNote.title,
            subject !== undefined ? subject : existingNote.subject,
            body !== undefined ? body : existingNote.body,
            summary !== undefined ? summary : existingNote.summary,
            noteId,
            req.userId
        );

        const updatedNote = db.prepare('SELECT * FROM notes WHERE id = ?').get(noteId);
        res.json({ success: true, data: updatedNote });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to update note.' });
    }
});

// DELETE /api/notes/:id - Delete a note
router.delete('/:id', (req, res) => {
    try {
        const noteId = req.params.id;
        
        const stmt = db.prepare('DELETE FROM notes WHERE id = ? AND user_id = ?');
        const info = stmt.run(noteId, req.userId);

        if (info.changes === 0) {
            return res.status(404).json({ success: false, error: 'Note not found.' });
        }

        res.json({ success: true, data: { deleted_id: noteId } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to delete note.' });
    }
});

module.exports = router;
