// routes/tasks.js
// Handles all task-related operations (CRUD).
// Protected by JWT authentication.

const express = require('express');
const db = require('../db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Apply the authentication middleware to all routes in this file
router.use(authenticateToken);

// GET /api/tasks - Get all tasks for logged-in user, optionally filtered by date
router.get('/', (req, res) => {
    try {
        const { date } = req.query; // Check if ?date=YYYY-MM-DD was provided

        let tasks;
        if (date) {
            // Get tasks for a specific date
            const stmt = db.prepare('SELECT * FROM tasks WHERE user_id = ? AND date = ?');
            tasks = stmt.all(req.userId, date);
        } else {
            // Get all tasks for the user
            const stmt = db.prepare('SELECT * FROM tasks WHERE user_id = ?');
            tasks = stmt.all(req.userId);
        }

        // Ensure boolean/integer representation is consistent with frontend expectations
        // SQLite stores booleans as 0 or 1, we map them for the frontend
        const mappedTasks = tasks.map(task => ({
            ...task,
            done: task.done === 1,
            generated: task.generated === 1
        }));

        res.json({ success: true, data: mappedTasks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to fetch tasks.' });
    }
});

// POST /api/tasks - Create a new task
router.post('/', (req, res) => {
    try {
        const { subject, topic, date, start_time, end_time, priority, generated } = req.body;

        if (!subject || !topic || !date || !start_time || !end_time) {
            return res.status(400).json({ success: false, error: 'Missing required fields.' });
        }

        const stmt = db.prepare(`
            INSERT INTO tasks (user_id, subject, topic, date, start_time, end_time, priority, generated)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        // Convert boolean 'generated' to 1 or 0 for SQLite
        const isGenerated = generated ? 1 : 0;
        
        const info = stmt.run(req.userId, subject, topic, date, start_time, end_time, priority || 'Medium', isGenerated);

        // Fetch the newly created task to return it
        const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(info.lastInsertRowid);
        
        res.status(201).json({
            success: true,
            data: {
                ...newTask,
                done: newTask.done === 1,
                generated: newTask.generated === 1
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to create task.' });
    }
});

// PUT /api/tasks/:id - Update an existing task (e.g., toggle done, edit details)
router.put('/:id', (req, res) => {
    try {
        const taskId = req.params.id;
        const { subject, topic, date, start_time, end_time, priority, done } = req.body;

        // First, check if the task belongs to the user
        const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(taskId, req.userId);
        
        if (!existingTask) {
            return res.status(404).json({ success: false, error: 'Task not found.' });
        }

        // Prepare update data, falling back to existing values if not provided
        const updatedDone = done !== undefined ? (done ? 1 : 0) : existingTask.done;
        
        const stmt = db.prepare(`
            UPDATE tasks 
            SET subject = ?, topic = ?, date = ?, start_time = ?, end_time = ?, priority = ?, done = ?
            WHERE id = ? AND user_id = ?
        `);

        stmt.run(
            subject || existingTask.subject,
            topic || existingTask.topic,
            date || existingTask.date,
            start_time || existingTask.start_time,
            end_time || existingTask.end_time,
            priority || existingTask.priority,
            updatedDone,
            taskId,
            req.userId
        );

        // Return updated task
        const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);

        res.json({
            success: true,
            data: {
                ...updatedTask,
                done: updatedTask.done === 1,
                generated: updatedTask.generated === 1
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to update task.' });
    }
});

// DELETE /api/tasks - Delete tasks (can handle ?upcoming=true)
router.delete('/', (req, res) => {
    try {
        const { upcoming } = req.query;

        if (upcoming === 'true') {
            // Delete all upcoming undone tasks
            // We compare dates string-wise since they are stored as YYYY-MM-DD
            const today = new Date().toISOString().split('T')[0];
            
            const stmt = db.prepare('DELETE FROM tasks WHERE user_id = ? AND done = 0 AND date >= ?');
            const info = stmt.run(req.userId, today);
            
            return res.json({ success: true, data: { deleted_count: info.changes } });
        }
        
        return res.status(400).json({ success: false, error: 'Specify ?upcoming=true to delete multiple, or use /:id for a single task.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to delete tasks.' });
    }
});

// DELETE /api/tasks/:id - Delete a single task
router.delete('/:id', (req, res) => {
    try {
        const taskId = req.params.id;

        const stmt = db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?');
        const info = stmt.run(taskId, req.userId);

        if (info.changes === 0) {
            return res.status(404).json({ success: false, error: 'Task not found or not owned by user.' });
        }

        res.json({ success: true, data: { deleted_id: taskId } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to delete task.' });
    }
});

module.exports = router;
