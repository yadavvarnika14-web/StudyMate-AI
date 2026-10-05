# StudyMate AI - Backend & Full-Stack Deployment

## Project Overview
StudyMate AI is an intelligent study management application featuring timetables, notes, quizzes, focus sessions, and AI assistant capabilities.
- **Frontend:** HTML, CSS, JavaScript (served statically)
- **Backend:** Node.js, Express, REST API
- **Database:** SQLite (`studymate.db`)
- **Authentication:** JWT with bcrypt password hashing

---

## Deployment Architectures: Important Note on GitHub Pages vs. Node.js

GitHub Pages (`https://yadavvarnika14-web.github.io/StudyMate-AI/`) is a **static web host**. It can only host static assets (`.html`, `.css`, `.js`, images). It **cannot run a Node.js server or an active SQLite database backend**.

To run StudyMate AI with real server-side users and tasks:

### Option 1: Full-Stack Cloud Host (Recommended - Free Tier)
Deploy the `studymate-backend` folder to a service that executes Node.js applications:
- **Render** (render.com)
- **Railway** (railway.app)
- **Fly.io** (fly.io)

**Steps on Render:**
1. Push this repository to GitHub.
2. Log into [Render](https://render.com) and create a **New Web Service**.
3. Connect your repository.
4. Set Build Command: `npm install`
5. Set Start Command: `npm start`
6. Render will provide a live URL (e.g. `https://studymate-ai.onrender.com`) where the entire application (both frontend and backend API) runs live.

---

## Local Setup & Execution

1. Clone or download the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Access the application in your browser:
   ```
   http://localhost:3000/
   ```

---

## Repository Structure

```
├── server.js              # Express app, middleware, routes, static asset hosting
├── db.js                  # SQLite database connection & schema tables
├── middleware/
│   └── auth.js            # JWT verification middleware
├── routes/
│   ├── auth.js            # /api/auth/signup & /api/auth/login
│   ├── tasks.js           # /api/tasks (CRUD)
│   ├── subjects.js        # /api/subjects (CRUD + topics)
│   ├── notes.js           # /api/notes (CRUD + search)
│   ├── quizzes.js         # /api/quizzes (history & saving)
│   ├── focus.js           # /api/focus (session tracking)
│   └── user.js            # /api/user (profile, XP, settings)
├── public/                # Complete frontend application
│   ├── index.html         # Login / signup view
│   ├── dashboard.html     # Main dashboard
│   ├── planner.html       # Study planner & timetable
│   ├── subjects.html      # Subject & topic tracker
│   ├── notes.html         # Notes editor & AI summarizer
│   ├── quiz.html          # Quiz generator
│   ├── focus.html         # Focus timer
│   ├── progress.html      # Progress analytics & badges
│   ├── assistant.html     # AI study assistant
│   ├── settings.html      # Settings & profile management
│   ├── script.js          # API client & UI rendering
│   └── style.css          # Design system & dark theme
├── package.json
└── README.md
```
