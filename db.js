// db.js
// This file sets up the SQLite database using sql.js (pure JavaScript, no native build needed).
// sql.js loads a WebAssembly build of SQLite — works on any system without Python or C++ tools.

const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'studymate.db');

// We'll store the database instance here once it's ready
let db = null;

// This promise resolves when the database is fully initialized
const dbReady = (async () => {
    // Initialize sql.js (loads the WASM binary)
    const SQL = await initSqlJs();

    // If a database file already exists, load it; otherwise create a new one
    if (fs.existsSync(DB_PATH)) {
        const fileBuffer = fs.readFileSync(DB_PATH);
        db = new SQL.Database(fileBuffer);
        console.log('Loaded existing database from', DB_PATH);
    } else {
        db = new SQL.Database();
        console.log('Created new database.');
    }

    // Enable foreign key constraints (important for ON DELETE CASCADE)
    db.run('PRAGMA foreign_keys = ON');

    // Create all tables if they don't exist yet.
    // "IF NOT EXISTS" means this is safe to run every time the server starts.
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            password TEXT NOT NULL,
            xp INTEGER DEFAULT 0,
            daily_goal INTEGER DEFAULT 3,
            notifications INTEGER DEFAULT 1,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS subjects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER REFERENCES users(id),
            name TEXT NOT NULL,
            difficulty TEXT DEFAULT 'Medium',
            exam_date TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS topics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            done INTEGER DEFAULT 0
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER REFERENCES users(id),
            subject TEXT NOT NULL,
            topic TEXT NOT NULL,
            date TEXT NOT NULL,
            start_time TEXT NOT NULL,
            end_time TEXT NOT NULL,
            priority TEXT DEFAULT 'Medium',
            done INTEGER DEFAULT 0,
            generated INTEGER DEFAULT 0
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER REFERENCES users(id),
            title TEXT DEFAULT '',
            subject TEXT DEFAULT 'General',
            body TEXT DEFAULT '',
            summary TEXT DEFAULT '',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS quizzes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER REFERENCES users(id),
            subject TEXT NOT NULL,
            topic TEXT DEFAULT '',
            score INTEGER NOT NULL,
            total INTEGER NOT NULL,
            pct INTEGER NOT NULL,
            date TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS focus_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER REFERENCES users(id),
            date TEXT NOT NULL,
            minutes INTEGER NOT NULL,
            UNIQUE(user_id, date)
        )
    `);

    // Save the database to disk after creating tables
    saveDb();
    console.log('Database initialized successfully.');

    return db;
})();

// Helper: save the in-memory database to disk
// sql.js works in-memory, so we need to periodically write to file
function saveDb() {
    if (db) {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(DB_PATH, buffer);
    }
}

// ============================================================
// Compatibility layer: make sql.js look like better-sqlite3
// This way, all our route files work without any changes!
// ============================================================

const dbProxy = {
    // better-sqlite3's .prepare(sql) returns a statement object with .get(), .all(), .run()
    prepare(sql) {
        return {
            // .get(...params) — returns one row as an object, or undefined
            get(...params) {
                const stmt = db.prepare(sql);
                stmt.bind(params);
                let result = undefined;
                if (stmt.step()) {
                    // Get column names and values, build an object
                    const cols = stmt.getColumnNames();
                    const vals = stmt.get();
                    result = {};
                    cols.forEach((col, i) => { result[col] = vals[i]; });
                }
                stmt.free();
                return result;
            },

            // .all(...params) — returns array of row objects
            all(...params) {
                const results = [];
                const stmt = db.prepare(sql);
                stmt.bind(params);
                while (stmt.step()) {
                    const cols = stmt.getColumnNames();
                    const vals = stmt.get();
                    const row = {};
                    cols.forEach((col, i) => { row[col] = vals[i]; });
                    results.push(row);
                }
                stmt.free();
                return results;
            },

            // .run(...params) — executes the statement, returns { changes, lastInsertRowid }
            run(...params) {
                const stmt = db.prepare(sql);
                stmt.bind(params);
                stmt.step();
                stmt.free();
                const info = {
                    changes: db.getRowsModified(),
                    lastInsertRowid: dbProxy._lastInsertRowId()
                };
                // Auto-save to disk after every write operation
                saveDb();
                return info;
            }
        };
    },

    // Helper to get last insert rowid
    _lastInsertRowId() {
        const stmt = db.prepare('SELECT last_insert_rowid() as id');
        stmt.step();
        const id = stmt.get()[0];
        stmt.free();
        return id;
    },

    // better-sqlite3's .pragma() — we handle the one we need
    pragma(pragmaStr) {
        db.run(`PRAGMA ${pragmaStr}`);
    }
};

// Export the proxy (looks like better-sqlite3 to all route files)
// Also export dbReady so server.js can wait for initialization
module.exports = dbProxy;
module.exports.dbReady = dbReady;
