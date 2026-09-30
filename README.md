# 🎓 StudyMate AI

**Plan smarter. Focus deeper. Ace every exam.**

StudyMate AI is a fully client-side study companion that lives entirely in your browser. It auto-generates study timetables, creates quizzes from your own notes, tracks streaks and XP, and provides an AI-powered study assistant — all with zero server dependency.

---

## ✨ Features

### 📅 Smart Study Planner
- **Auto-generated timetables** based on your subjects, difficulty, exam dates, and preferred study time (morning / afternoon / evening / night).
- Prioritises weak topics and upcoming exams automatically.
- Tasks can be added manually or bulk-generated for up to 14 days.
- One-click clearing of upcoming unfinished tasks.

### 📚 Subject Management
- Add subjects with difficulty level (Easy / Medium / Hard) and optional exam date.
- Break each subject into topics and track completion percentage.
- Live **exam countdown** cards on the dashboard.

### 📝 Notes
- Create, search, and filter notes by subject.
- Built-in **AI summariser** that extracts the most important sentences using TF-based scoring.
- Notes feed directly into quiz generation.

### 🧠 AI Quiz Generator
- Generates fill-in-the-blank questions **from your own notes**.
- Falls back to study-skill questions when notes are sparse.
- Configurable subject, topic, difficulty, and question count (3–15).
- Instant scoring with per-question explanations.

### 🤖 AI Study Assistant
- Chat interface with suggested prompts.
- Can explain topics in simple language, generate practice questions, and build study plans.
- Conversation history is persisted across sessions.
- Designed with a clean swap point for a real AI backend (`askAI()` function).

### ⏱️ Focus Mode (Pomodoro)
- **25-minute focus / 5-minute break** timer.
- Select subject and topic to track what you're studying.
- Focus minutes are logged per day and contribute to streaks and XP.

### 📊 Progress & Analytics
- **Weekly and monthly** study-hour bar charts.
- Subject-wise completion progress bars.
- Quiz score history (latest 8 quizzes).
- Study streak counter.

### 🏅 Gamification
| Badge | Condition |
|---|---|
| 🔥 3 Day Streak | Study 3 days in a row |
| 🔥 7 Day Streak | Study 7 days in a row |
| 🏆 First Quiz Completed | Complete at least 1 quiz |
| 📚 10 Hours Studied | Accumulate 10 total study hours |
| 🎯 50 Tasks Completed | Mark 50 tasks as done |
| 📝 5 Notes Written | Create 5 notes |
| ⏱️ First Focus Session | Complete 1 focus session |
| ⭐ Reach Level 5 | Earn 800+ XP |

**XP rewards:**
- +20 XP per task completed
- +5 XP per new note
- +10 XP + 5 per correct answer on quizzes
- +30 XP per focus session
- Level up every 200 XP

### 🔐 Authentication
- Email + password sign-up / login with SHA-256 hashing.
- "Remember me" toggle (localStorage vs sessionStorage).
- Password reset flow (client-side).
- Multi-user support — each account has isolated data.

### ⚙️ Settings
- Edit display name and daily study-hour goal.
- Toggle dark mode 🌓 and notification reminders.
- **Export** all data as JSON.
- **Reset** all data with confirmation.
- Log out.

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────┐
│                   Browser                    │
│                                              │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐ │
│  │  HTML     │   │  CSS     │   │  app.js  │ │
│  │  (pages)  │◄──┤  theme   │◄──┤  (this   │ │
│  │          │   │  styles  │   │   file)  │ │
│  └──────────┘   └──────────┘   └──────────┘ │
│                                     │        │
│                              localStorage    │
│                              ┌──────────┐    │
│                              │ sm_users │    │
│                              │ sm_d_*   │    │
│                              │ sm_sess  │    │
│                              │ sm_theme │    │
│                              └──────────┘    │
└──────────────────────────────────────────────┘
```

### Dual-mode routing

The app supports two deployment modes controlled by `<body data-page="...">`:

| Mode | How it works |
|---|---|
| **Multi-file** | Each page is a separate `.html` file. Navigation uses full page loads. |
| **Single-file** | One HTML file with `<body data-single>`. Pages are swapped via `#hash` routing. |

### Data storage

| Key | Contents |
|---|---|
| `sm_users` | JSON map of `{ email: { name, pw } }` |
| `sm_d_<email>` | Full user data: subjects, tasks, notes, quizzes, focus log, XP, chat history, settings |
| `sm_sess` | Current session email (in `localStorage` or `sessionStorage` depending on "Remember me") |
| `sm_theme` | `"light"` or `"dark"` |

---

## 📄 Pages

| Route | Function | Description |
|---|---|---|
| `login` | `authPage()` | Login / sign-up / password reset |
| `dashboard` | `pDash()` | Overview: greeting, stats, smart recommendation, today's timetable, weekly chart, exam countdowns |
| `planner` | `pPlan()` | Generate and manage study timetable |
| `subjects` | `pSubjects()` | CRUD subjects and topics |
| `notes` | `pNotes()` | Create, search, summarise notes |
| `quiz` | `pQuiz()` | Generate and take quizzes |
| `assistant` | `pAssist()` | Chat with the AI study assistant |
| `progress` | `pProg()` | Analytics, charts, badges |
| `focus` | `pFocus()` | Pomodoro focus timer |
| `settings` | `pSet()` | Profile, preferences, data management |

---

## 🧠 Smart Recommendation Engine

The dashboard displays a personalised "what to study next" recommendation. The algorithm scores each subject by:

| Factor | Weight |
|---|---|
| Incomplete topics | 30% of remaining |
| Low quiz average | 30% of gap from 100 |
| Upcoming exam proximity | Up to 30 points (closer = higher) |
| Unfinished tasks | Up to 10 points |
| Subject difficulty | Hard +8, Medium +4, Easy +0 |

The highest-scoring subject is recommended, along with the next incomplete topic.

---

## 🔌 Extending with a Real AI

The codebase is designed for easy AI integration. Two functions serve as swap points:

### `askAI(text)` — Chat assistant
```js
// Replace the mock with a real API call:
async function askAI(text) {
  const r = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text, history: S.chat })
  });
  return (await r.json()).reply;
}
```

### `makeQuiz(subject, topic, difficulty, n)` — Quiz generation
Replace the local question builder with an API call to generate questions from a language model.

### `summarize(text)` — Note summarisation
Currently uses extractive summarisation (sentence scoring). Can be swapped for an LLM-based abstractive summary.

---

## 🚀 Getting Started

1. **Clone or download** the project files.
2. Open `index.html` in any modern browser (Chrome, Firefox, Safari, Edge).
3. Create an account and start studying.

> [!NOTE]
> No build step, no server, no dependencies. Everything runs client-side.

> [!IMPORTANT]
> Data is stored in `localStorage`. Clearing browser data will erase all accounts and progress. Use the **Export** feature in Settings to back up your data.

---

## 🛠️ Tech Stack

- **Vanilla JavaScript** — zero dependencies, single script file
- **LocalStorage** — persistent client-side data
- **Web Crypto API** — SHA-256 password hashing (with djb2 fallback)
- **CSS custom properties** — light/dark theming

---

## 📁 Project Structure

```
├── index.html          # Login page (or single-file host)
├── dashboard.html      # Dashboard page
├── planner.html        # Study planner page
├── subjects.html       # Subjects management page
├── notes.html          # Notes page
├── quiz.html           # Quiz page
├── assistant.html      # AI assistant page
├── progress.html       # Progress & analytics page
├── focus.html          # Focus mode page
├── settings.html       # Settings page
├── app.js              # All application logic (this file)
├── style.css           # Styles and theming
└── README.md           # This file
```

---

## 📜 License

This project is provided as-is for educational purposes.
