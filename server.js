// server.js
// This is the main entry point for our Node.js + Express backend.
// It sets up the server, connects all the routes, and starts listening for requests.

const express = require('express');
const cors = require('cors');
const path = require('path');

// Import our route files
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const subjectRoutes = require('./routes/subjects');
const noteRoutes = require('./routes/notes');
const quizRoutes = require('./routes/quizzes');
const focusRoutes = require('./routes/focus');
const userRoutes = require('./routes/user');

// Import the database module (this sets up our db proxy)
const db = require('./db');

// Initialize the Express application
const app = express();

// Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing (allows frontend to talk to backend)
app.use(express.json()); // Automatically parses incoming JSON data into req.body
app.use(express.static(path.join(__dirname, 'public'))); // Serve frontend files from /public

// Register all API routes
// Any request to '/api/auth' will be handled by authRoutes, etc.
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/focus', focusRoutes);
app.use('/api/user', userRoutes);

// Basic route to check if server is running
app.get('/', (req, res) => {
    res.json({ success: true, message: 'StudyMate API is running!' });
});

// Error handling middleware (catches any unhandled errors)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Something went wrong on the server!' });
});

// Wait for the database to be ready, then start the server
const PORT = process.env.PORT || 3000;

db.dbReady.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});
