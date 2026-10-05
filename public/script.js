/* StudyMate AI - one script shared by every page.
   Each HTML file sets <body data-page="..."> and this file draws that page. */

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const P = document.body.dataset.page;
const ymd = d => { d = d || new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const addD = (s, n) => { const d = new Date(s + 'T00:00'); d.setDate(d.getDate() + n); return ymd(d); };
const daysTo = s => Math.round((new Date(s + 'T00:00') - new Date(ymd() + 'T00:00')) / 864e5);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
const mins = t => { const [a, b] = t.split(':'); return +a * 60 + +b; };
const hm = m => String(Math.floor(m / 60) % 24).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
const nowMin = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };
const shuf = a => a.map(x => [Math.random(), x]).sort((x, y) => x[0] - y[0]).map(x => x[1]);

async function api(path, method = 'GET', body = null) {
    const opts = { method, headers: {} };
    const token = localStorage.getItem('sm_token') || sessionStorage.getItem('sm_token');
    if (token) opts.headers['Authorization'] = 'Bearer ' + token;
    if (body) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
    const res = await fetch('/api' + path, opts);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'API error');
    return data.data;
}

function toast(m) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = m; document.body.append(t); setTimeout(() => t.remove(), 2600); }
function setTheme(t) { document.documentElement.dataset.theme = t; localStorage.setItem('sm_theme', t); }
setTheme(localStorage.getItem('sm_theme') || 'light');
function modal(html, mount) { const m = document.createElement('div'); m.className = 'modal'; m.innerHTML = '<div class="mbox">' + html + '</div>'; m.onclick = e => { if (e.target === m) m.remove(); }; document.body.append(m); mount(m); }

/* ---------- state ---------- */
let email, S, users, userId;
const NAV = [['dashboard', '🏠', 'Dashboard'], ['planner', '📅', 'Study Planner'], ['subjects', '📚', 'Subjects'], ['notes', '📝', 'Notes'], ['quiz', '🧠', 'AI Quiz'], ['assistant', '🤖', 'AI Assistant'], ['progress', '📊', 'Progress'], ['focus', '⏱️', 'Focus Mode'], ['settings', '⚙️', 'Settings']];
const fresh = () => ({ subjects: [], tasks: [], notes: [], quizzes: [], focus: {}, xp: 0, chat: [], set: { goal: 3, notif: true } });
const save = () => {};

const lvl = () => Math.floor(S.xp / 200) + 1;
async function addXP(n, why) {
  if (n === 0) return;
  try {
    const res = await api('/user/xp', 'PUT', { delta: n });
    S.xp = res.xp;
    if (n > 0) toast('+' + n + ' XP ' + (why || ''));
  } catch (e) {
    console.error(e);
  }
}
const dur = t => (mins(t.end) - mins(t.start)) / 60;
const hrs = d => S.tasks.filter(t => t.date === d && t.done).reduce((a, t) => a + dur(t), 0) + (S.focus[d] || 0) / 60;
const allHrs = () => S.tasks.filter(t => t.done).reduce((a, t) => a + dur(t), 0) + Object.values(S.focus).reduce((a, b) => a + b, 0) / 60;
const active = d => hrs(d) > 0 || S.quizzes.some(q => q.date === d);
function streak() { let n = 0, d = ymd(); if (!active(d)) d = addD(d, -1); while (active(d)) { n++; d = addD(d, -1); } return n; }
const back = n => Array.from({ length: n }, (_, i) => addD(ymd(), i - n + 1));
const pct = s => s.topics.length ? Math.round(s.topics.filter(t => t.done).length / s.topics.length * 100) : 0;
const quizAvg = name => { const q = S.quizzes.filter(x => x.subject === name); return q.length ? Math.round(q.reduce((a, b) => a + b.pct, 0) / q.length) : null; };
const subOpts = sel => ['General', ...S.subjects.map(s => s.name)].map(n => `<option ${n === sel ? 'selected' : ''}>${esc(n)}</option>`).join('');
const BADGES = [['🔥', '3 Day Streak', () => streak() >= 3], ['🔥', '7 Day Streak', () => streak() >= 7], ['🏆', 'First Quiz Completed', () => S.quizzes.length >= 1], ['📚', '10 Hours Studied', () => allHrs() >= 10], ['🎯', '50 Tasks Completed', () => S.tasks.filter(t => t.done).length >= 50], ['📝', '5 Notes Written', () => S.notes.length >= 5], ['⏱️', 'First Focus Session', () => Object.keys(S.focus).length > 0], ['⭐', 'Reach Level 5', () => lvl() >= 5]];
const QUOTES = ['Small steps every day beat big pushes once a week.', 'You do not have to be perfect. You just have to show up.', 'Future you is cheering for the you who studies today.', 'Focus on progress, not perfection.', 'Hard now, easy later.', 'Discipline is choosing what you want most over what you want now.', 'One focused hour is worth three distracted ones.', 'Mistakes are proof that you are trying.', 'Start where you are. Use what you have.', 'Consistency turns effort into results.'];

function alerts() {
  const a = [], t = ymd();
  if (!S.set.notif) return a;
  S.tasks.filter(x => x.date === t && !x.done).forEach(x => a.push(`⏰ Today ${x.start}: ${x.subject} - ${x.topic}`));
  S.tasks.filter(x => x.date < t && !x.done).slice(0, 3).forEach(x => a.push(`⚠️ Unfinished (${x.date}): ${x.subject} - ${x.topic}`));
  S.subjects.filter(s => s.exam && daysTo(s.exam) >= 0 && daysTo(s.exam) <= 7).forEach(s => a.push(`🎯 ${s.name} exam in ${daysTo(s.exam)} day(s)`));
  if (!active(t)) a.push('🔥 Study today to keep your streak alive');
  return a;
}

/* Smart recommendation: exams + weak subjects + unfinished tasks + quiz scores */
function recommend() {
  if (!S.subjects.length) return 'Add a subject to get personalised recommendations.';
  const r = S.subjects.map(s => {
    const q = quizAvg(s.name), inc = S.tasks.filter(t => t.subject === s.name && !t.done).length, d = s.exam ? daysTo(s.exam) : null;
    const w = (100 - pct(s)) * .3 + (q == null ? 10 : (100 - q) * .3) + (d != null && d >= 0 ? Math.max(0, 30 - d) : 0) + Math.min(inc, 10) + ({ Hard: 8, Medium: 4, Easy: 0 }[s.diff] || 0);
    return { s, w, q, inc, d };
  }).sort((a, b) => b.w - a.w)[0];
  const nt = r.s.topics.find(t => !t.done), why = [];
  if (r.d != null && r.d >= 0 && r.d <= 30) why.push(`exam in ${r.d} days`);
  if (r.q != null && r.q < 70) why.push(`last quiz average ${r.q}%`);
  if (r.inc) why.push(`${r.inc} unfinished task(s)`);
  if (pct(r.s) < 50) why.push('under half the topics done');
  return `Study <b>${esc(r.s.name)}</b>${nt ? ' next, starting with <b>' + esc(nt.n) + '</b>' : ''}.${why.length ? ' Why: ' + why.join(', ') + '.' : ''}`;
}

/* ---------- login / sign up ---------- */
function authPage() {
  let mode = 'login';
  const draw = () => {
    const L = mode === 'login';
    $('#app').innerHTML = `<div class="auth"><div class="ahero"><h1>🎓 StudyMate <b>AI</b></h1><p>Plan smarter. Focus deeper. Ace every exam.</p><ul><li>📅 Auto-built study timetables</li><li>🧠 Quizzes made from your own notes</li><li>🔥 Streaks, XP and badges</li></ul></div>
    <form class="acard" id="af"><h2>${L ? 'Welcome back' : 'Create your account'}</h2>${L ? '' : '<label>Name<input id="an" required></label>'}<label>Email<input id="ae" type="email" required autocomplete="email"></label><label>Password<input id="ap" type="password" minlength="6" required autocomplete="${L ? 'current-password' : 'new-password'}"></label>
    <div class="row"><label class="chk"><input type="checkbox" id="ar"> Remember me</label>${L ? '<a href="#" id="fp">Forgot password?</a>' : ''}</div>
    <button class="btn big">${L ? 'Log in' : 'Create account'}</button><p class="mut">${L ? 'New here?' : 'Have an account?'} <a href="#" id="sw">${L ? 'Create account' : 'Log in'}</a></p><button type="button" class="btn ghost" id="th">🌓 Light / dark</button></form></div>`;
    $('#sw').onclick = e => { e.preventDefault(); mode = L ? 'signup' : 'login'; draw(); };
    $('#th').onclick = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
    if (L) $('#fp').onclick = e => {
      e.preventDefault(); 
      toast('Please contact support to reset your password');
    };
    $('#af').onsubmit = async e => {
      e.preventDefault(); 
      const email = $('#ae').value.trim().toLowerCase(), password = $('#ap').value;
      try {
        let res;
        if (L) {
          res = await api('/auth/login', 'POST', { email, password });
        } else {
          const name = $('#an').value.trim();
          res = await api('/auth/signup', 'POST', { email, name, password });
        }
        sessionStorage.removeItem('sm_token'); localStorage.removeItem('sm_token');
        if ($('#ar').checked) localStorage.setItem('sm_token', res.token);
        else sessionStorage.setItem('sm_token', res.token);
        location.href = 'dashboard.html';
      } catch (err) {
        toast('Error: ' + err.message);
      }
    };
  };
  draw();
}

/* ---------- app shell ---------- */
async function boot() {
  const token = localStorage.getItem('sm_token') || sessionStorage.getItem('sm_token');
  if (P === 'login') { 
    if (token) {
      try {
        await api('/user');
        return location.replace('dashboard.html');
      } catch(e) {}
    }
    return authPage(); 
  }
  if (!token) return location.replace('index.html');
  
  try {
    const [userData, subjects, tasks, notes, quizzes, focus] = await Promise.all([
        api('/user'), api('/subjects'), api('/tasks'), api('/notes'), api('/quizzes'), api('/focus')
    ]);
    
    userId = userData.id;
    email = userData.email;
    users = { [email]: { name: userData.name } };
    
    S = fresh();
    S.xp = userData.xp;
    S.set = { goal: userData.daily_goal, notif: userData.notifications === 1 };
    
    let storedChat = localStorage.getItem('sm_chat_' + userId);
    S.chat = storedChat ? JSON.parse(storedChat) : [];
    
    S.subjects = subjects.map(s => ({
      id: s.id,
      name: s.name,
      diff: s.difficulty,
      exam: s.exam_date || '',
      topics: (s.topics || []).map(t => ({ id: t.id, n: t.name, done: t.done }))
    }));
    
    S.tasks = tasks.map(t => ({
      id: t.id,
      subject: t.subject,
      topic: t.topic,
      date: t.date,
      start: t.start_time,
      end: t.end_time,
      pri: t.priority,
      done: t.done,
      gen: t.generated
    }));
    
    S.notes = notes;
    S.quizzes = quizzes;
    S.focus = focus;
    
    render();
  } catch(err) {
    console.error(err);
    toast('Error loading data: ' + err.message);
    localStorage.removeItem('sm_token');
    sessionStorage.removeItem('sm_token');
    location.replace('index.html');
  }
}

function render() {
  const nav = NAV.find(n => n[0] === P), al = alerts();
  document.title = nav[2] + ' · StudyMate AI';
  $('#app').innerHTML = `<aside class="side" id="side"><div class="logo">🎓 StudyMate <b>AI</b></div>${NAV.map(n => `<a href="${n[0]}.html" class="${n[0] === P ? 'on' : ''}"><span>${n[1]}</span>${n[2]}</a>`).join('')}<div class="lvl">Level ${lvl()} · ${S.xp} XP<div class="pb"><i style="width:${S.xp % 200 / 2}%"></i></div></div></aside>
  <div class="main"><header class="top"><button class="ic burger" id="bg" aria-label="Menu">☰</button><div class="tt"><h1>${nav[1]} ${nav[2]}</h1><small>${new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</small></div>
  <div class="tr"><button class="ic" id="bell" aria-label="Notifications">🔔${al.length ? `<i id="bc">${al.length}</i>` : ''}</button><button class="ic" id="th" aria-label="Toggle dark mode">🌓</button><div class="av">${esc((users[email].name[0] || '?').toUpperCase())}</div></div></header>
  <div class="nd" id="nd" hidden>${al.length ? al.map(a => `<p>${esc(a)}</p>`).join('') : '<p class="mut">You are all caught up 🎉</p>'}</div><section class="view" id="view"></section></div>`;
  $('#bg').onclick = () => $('#side').classList.toggle('open');
  $('#bell').onclick = () => { $('#nd').hidden = !$('#nd').hidden; };
  $('#th').onclick = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  PAGES[P]($('#view'));
}

/* ---------- shared UI pieces ---------- */
const taskRow = (x, showDate) => `<label class="tr2"><input type="checkbox" data-id="${x.id}" ${x.done ? 'checked' : ''}><div><b>${esc(x.subject)}</b> · ${esc(x.topic)}<small>${showDate ? x.date + ' · ' : ''}${x.start} - ${x.end}</small></div><span class="pill ${x.pri}">${x.pri}</span></label>`;
function bindChecks(v) {
  $$('input[data-id]', v).forEach(c => c.onchange = async () => {
    const t = S.tasks.find(x => x.id == c.dataset.id);
    if (!t) return;
    try {
      await api('/tasks/' + t.id, 'PUT', { done: c.checked });
      t.done = c.checked; 
      await addXP(c.checked ? 20 : -20, c.checked ? 'task done' : ''); 
      render();
    } catch(e) { toast('Error: ' + e.message); c.checked = !c.checked; }
  });
}
const bars = (vals, labels, max) => `<div class="bars">${vals.map((v, i) => `<div class="bc"><i style="height:${Math.max(3, v / max * 100)}%"><span>${v.toFixed(1)}</span></i><small>${labels[i]}</small></div>`).join('')}</div>`;
const dow = d => new Date(d + 'T00:00').toLocaleDateString(undefined, { weekday: 'short' });
function addTask() {
  modal(`<h3>Add task</h3><form id="tf"><label>Subject<select name="subject">${S.subjects.map(s => `<option>${esc(s.name)}</option>`).join('') || '<option>General</option>'}</select></label><label>Topic<input name="topic" required></label><label>Date<input type="date" name="date" value="${ymd()}" required></label><div class="two"><label>Start<input type="time" name="start" value="18:00" required></label><label>End<input type="time" name="end" value="19:00" required></label></div><label>Priority<select name="pri"><option>High</option><option selected>Medium</option><option>Low</option></select></label><div class="row"><button type="button" class="btn ghost" data-x>Cancel</button><button class="btn">Add task</button></div></form>`, m => {
    $('[data-x]', m).onclick = () => m.remove();
    $('#tf', m).onsubmit = async e => {
      e.preventDefault(); const f = Object.fromEntries(new FormData(e.target));
      if (mins(f.end) <= mins(f.start)) return toast('End time must be after start time');
      try {
          const res = await api('/tasks', 'POST', { subject: f.subject, topic: f.topic, date: f.date, start_time: f.start, end_time: f.end, priority: f.pri });
          S.tasks.push({ id: res.id, subject: res.subject, topic: res.topic, date: res.date, start: res.start_time, end: res.end_time, pri: res.priority, done: res.done, gen: res.generated });
          m.remove(); toast('Task added'); render();
      } catch (err) { toast('Error: ' + err.message); }
    };
  });
}

/* ---------- pages ---------- */
function pDash(v) {
  const t = ymd(), td = S.tasks.filter(x => x.date === t).sort((a, b) => a.start.localeCompare(b.start)), done = S.tasks.filter(x => x.done).length, h = new Date().getHours();
  const up = S.tasks.filter(x => !x.done && (x.date > t || (x.date === t && mins(x.end) >= nowMin()))).sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start)).slice(0, 4);
  const ex = S.subjects.filter(s => s.exam && daysTo(s.exam) >= 0).sort((a, b) => a.exam.localeCompare(b.exam));
  const days = back(7), hv = days.map(hrs), doy = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 864e5);
  v.innerHTML = `<div class="card hero g"><div><h2>Good ${h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening'}, ${esc(users[email].name.split(' ')[0])} 👋</h2><p class="quote">“${QUOTES[doy % QUOTES.length]}”</p></div><div class="row"><button class="btn amb" id="at">＋ Add Task</button><button class="btn" id="fs">▶ Start Focus Session</button></div></div>
  <div class="g g4"><div class="card stat"><span>Today's study hours</span><b>${hrs(t).toFixed(1)}h</b><small>Goal ${S.set.goal}h</small></div><div class="card stat"><span>Tasks completed</span><b>${done}/${S.tasks.length}</b><small>${td.filter(x => x.done).length}/${td.length} today</small></div><div class="card stat"><span>Study streak</span><b>🔥 ${streak()}</b><small>days in a row</small></div><div class="card stat"><span>Level ${lvl()}</span><b>${S.xp} XP</b><small>${200 - S.xp % 200} XP to next level</small></div></div>
  <div class="g g2"><div class="card rec"><h3>💡 Smart recommendation</h3><p>${recommend()}</p></div><div class="card"><h3>Upcoming study sessions</h3>${up.map(x => taskRow(x, true)).join('') || '<p class="mut">Nothing scheduled. Add a task or generate a plan.</p>'}</div></div>
  <div class="g g2"><div class="card"><h3>Today's timetable</h3>${td.map(x => taskRow(x)).join('') || '<p class="mut">No sessions today. <a href="planner.html">Generate a study plan</a>.</p>'}</div><div class="card"><h3>Study hours - last 7 days</h3>${bars(hv, days.map(dow), Math.max(S.set.goal, ...hv, 1))}</div></div>
  <h3 style="margin:6px 0 12px">Exam countdown</h3><div class="g g4">${ex.map(s => `<div class="card cd"><b>${daysTo(s.exam)}</b>days until<br><strong>${esc(s.name)}</strong><br><small>${s.exam}</small></div>`).join('') || '<p class="mut">Add exam dates in Subjects to see countdowns.</p>'}</div>`;
  $('#at', v).onclick = addTask; $('#fs', v).onclick = () => location.href = 'focus.html'; bindChecks(v);
}

async function generate(f) {
  const base = { morning: 480, afternoon: 780, evening: 1020, night: 1200 }[f.pref], weak = f.weak.toLowerCase(), weakT = f.weak.split(',').map(x => x.trim()).filter(Boolean);
  
  for (const n of f.subs) {
      if (!S.subjects.some(s => s.name.toLowerCase() === n.toLowerCase())) {
          try {
              const res = await api('/subjects', 'POST', { name: n, difficulty: f.diff, exam_date: f.exam || null });
              S.subjects.push({ id: res.id, name: res.name, diff: res.difficulty, exam: res.exam_date || '', topics: [] });
          } catch(e) { console.error(e); }
      }
  }
  
  if (f.exam) {
      for (const n of f.subs) {
          const s = S.subjects.find(x => x.name.toLowerCase() === n.toLowerCase()); 
          if (s && !s.exam) {
              try {
                  await api('/subjects/' + s.id, 'PUT', { exam_date: f.exam });
                  s.exam = f.exam;
              } catch(e) { console.error(e); }
          }
      }
  }
  
  const cycle = []; f.subs.forEach(n => { const s = S.subjects.find(x => x.name.toLowerCase() === n.toLowerCase()); if(s) { const w = 1 + (s.diff === 'Hard' ? 1 : 0) + (weak.includes(n.toLowerCase()) ? 1 : 0); for (let i = 0; i < w; i++) cycle.push(s); } });
  
  try {
      await api('/tasks?upcoming=true', 'DELETE');
      S.tasks = S.tasks.filter(x => x.done || !x.gen || x.date < ymd());
  } catch(e) { console.error(e); }
  
  const last = f.exam && daysTo(f.exam) >= 0 ? Math.min(daysTo(f.exam), 13) : 13;
  const newTasks = [];
  for (let d = 0; d <= last; d++) for (let i = 0; i < f.hours; i++) {
    const s = cycle[(d * f.hours + i) % cycle.length], tp = s.topics.length ? s.topics.map(t => t.n) : ['Core concepts', 'Practice problems', 'Revision', 'Past paper questions'];
    const topic = i === 0 && weakT.length ? weakT[d % weakT.length] : tp[(d + i) % tp.length];
    const hi = weak.includes(s.name.toLowerCase()) || s.diff === 'Hard' || (s.exam && daysTo(s.exam) >= 0 && daysTo(s.exam) <= 7);
    
    newTasks.push({
        subject: s.name, 
        topic, 
        date: addD(ymd(), d), 
        start_time: hm(base + i * 70), 
        end_time: hm(base + i * 70 + 60), 
        priority: hi ? 'High' : s.diff === 'Medium' ? 'Medium' : 'Low',
        generated: true
    });
  }
  
  try {
      for (const t of newTasks) await api('/tasks', 'POST', t);
      const tasks = await api('/tasks');
      S.tasks = tasks.map(t => ({
        id: t.id, subject: t.subject, topic: t.topic, date: t.date,
        start: t.start_time, end: t.end_time, pri: t.priority, done: t.done, gen: t.generated
      }));
  } catch (err) {
      toast('Error generating plan: ' + err.message);
  }
  toast('Study plan ready 🎉');
  render();
}
function pPlan(v) {
  const list = S.tasks.filter(x => x.date >= ymd()).sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
  v.innerHTML = `<form class="card qf" id="pf"><label>Subjects (comma separated)<input name="subs" value="${esc(S.subjects.map(s => s.name).join(', '))}" required></label><label>Exam date<input type="date" name="exam" min="${ymd()}"></label><label>Study hours per day<input type="number" name="hours" min="1" max="8" value="${S.set.goal}"></label><label>Difficulty<select name="diff"><option>Easy</option><option selected>Medium</option><option>Hard</option></select></label><label>Preferred study time<select name="pref"><option value="morning">Morning (8:00)</option><option value="afternoon">Afternoon (13:00)</option><option value="evening" selected>Evening (17:00)</option><option value="night">Night (20:00)</option></select></label><label>Topics needing more attention<input name="weak" placeholder="e.g. Calculus, Waves"></label><button class="btn">✨ Generate My Study Plan</button></form>
  <div class="card"><div class="row"><h3>Your timetable</h3><div class="row"><button class="btn sm ghost" id="mt">＋ Add task</button><button class="btn sm ghost red" id="cl">Clear upcoming</button></div></div><div class="tw"><table><tr><th>Date</th><th>Subject</th><th>Topic</th><th>Start</th><th>End</th><th>Priority</th><th>Done</th><th></th></tr>${list.map(x => `<tr><td>${x.date === ymd() ? 'Today' : dow(x.date) + ' ' + x.date.slice(5)}</td><td>${esc(x.subject)}</td><td>${esc(x.topic)}</td><td>${x.start}</td><td>${x.end}</td><td><span class="pill ${x.pri}">${x.pri}</span></td><td><input type="checkbox" data-id="${x.id}" ${x.done ? 'checked' : ''}></td><td><button class="ic" data-del="${x.id}" aria-label="Delete">🗑</button></td></tr>`).join('') || '<tr><td colspan="8" class="mut">No sessions yet. Fill the form and generate your plan.</td></tr>'}</table></div></div>`;
  $('#pf', v).onsubmit = e => {
    e.preventDefault(); const f = Object.fromEntries(new FormData(e.target));
    const subs = f.subs.split(',').map(x => x.trim()).filter(Boolean); if (!subs.length) return toast('Enter at least one subject');
    toast('Generating...');
    generate({ subs, exam: f.exam, hours: Math.min(8, Math.max(1, +f.hours || 2)), diff: f.diff, pref: f.pref, weak: f.weak }); 
  };
  $('#mt', v).onclick = addTask;
  $('#cl', v).onclick = async () => { if (confirm('Remove all upcoming unfinished tasks?')) { 
      try {
          await api('/tasks?upcoming=true', 'DELETE');
          S.tasks = S.tasks.filter(x => x.done || x.date < ymd()); 
          render(); 
      } catch(e) { toast('Error: ' + e.message); }
  } };
  $$('[data-del]', v).forEach(b => b.onclick = async () => { 
      try {
          await api('/tasks/' + b.dataset.del, 'DELETE');
          S.tasks = S.tasks.filter(x => x.id != b.dataset.del); 
          render(); 
      } catch(e) { toast('Error: ' + e.message); }
  });
  bindChecks(v);
}

function pSubjects(v) {
  v.innerHTML = `<form class="card qf" id="sf"><label>Subject name<input name="name" required></label><label>Difficulty<select name="diff"><option>Easy</option><option selected>Medium</option><option>Hard</option></select></label><label>Exam date<input type="date" name="exam"></label><button class="btn">＋ Add subject</button></form>
  <div class="g g3">${S.subjects.map(s => `<div class="card sc"><div class="row"><h3>${esc(s.name)}</h3><span class="pill ${s.diff}">${s.diff}</span></div><small>${s.exam ? 'Exam ' + s.exam + (daysTo(s.exam) >= 0 ? ' (' + daysTo(s.exam) + ' days)' : ' (passed)') : 'No exam date'}</small>
  <div class="row" style="margin:10px 0 6px"><b>${pct(s)}% complete</b></div><div class="pb"><i style="width:${pct(s)}%"></i></div><div style="margin:12px 0">${s.topics.map((t, i) => `<div class="tp ${t.done ? 'd' : ''}"><input type="checkbox" data-s="${s.id}" data-t="${i}" ${t.done ? 'checked' : ''}><span>${esc(t.n)}</span><button class="ic" data-rt="${s.id}:${i}" aria-label="Remove topic">✕</button></div>`).join('') || '<small>No topics yet</small>'}</div>
  <div class="row"><input data-at="${s.id}" placeholder="Add topic + Enter" style="flex:1"><button class="btn sm ghost red" data-ds="${s.id}">Delete</button></div></div>`).join('') || '<p class="mut">No subjects yet. Add your first one above.</p>'}</div>`;
  $('#sf', v).onsubmit = async e => {
    e.preventDefault(); const f = Object.fromEntries(new FormData(e.target));
    if (S.subjects.some(s => s.name.toLowerCase() === f.name.trim().toLowerCase())) return toast('Subject already exists');
    try {
        const res = await api('/subjects', 'POST', { name: f.name.trim(), difficulty: f.diff, exam_date: f.exam || null });
        S.subjects.push({ id: res.id, name: res.name, diff: res.difficulty, exam: res.exam_date || '', topics: [] }); 
        render();
    } catch(err) { toast('Error: ' + err.message); }
  };
  $$('input[data-s]', v).forEach(c => c.onchange = async () => { 
      const s = S.subjects.find(s => s.id == c.dataset.s);
      const t = s.topics[+c.dataset.t];
      try {
          await api('/subjects/' + s.id + '/topics/' + t.id, 'PUT', { done: c.checked });
          t.done = c.checked; render();
      } catch(err) { toast('Error: ' + err.message); c.checked = !c.checked; }
  });
  $$('[data-rt]', v).forEach(b => b.onclick = async () => { 
      const [id, i] = b.dataset.rt.split(':'); 
      const s = S.subjects.find(s => s.id == id);
      const t = s.topics[+i];
      try {
          await api('/subjects/' + id + '/topics/' + t.id, 'DELETE');
          s.topics.splice(+i, 1); render();
      } catch(err) { toast('Error: ' + err.message); }
  });
  $$('[data-at]', v).forEach(i => i.onkeydown = async e => { 
      if (e.key === 'Enter' && i.value.trim()) { 
          const s = S.subjects.find(s => s.id == i.dataset.at);
          try {
              const res = await api('/subjects/' + s.id + '/topics', 'POST', { name: i.value.trim() });
              s.topics.push({ id: res.id, n: res.name, done: res.done }); render();
          } catch(err) { toast('Error: ' + err.message); }
      } 
  });
  $$('[data-ds]', v).forEach(b => b.onclick = async () => { 
      if (confirm('Delete this subject?')) { 
          try {
              await api('/subjects/' + b.dataset.ds, 'DELETE');
              S.subjects = S.subjects.filter(s => s.id != b.dataset.ds); render();
          } catch(err) { toast('Error: ' + err.message); }
      } 
  });
}

/* Summarizer: picks the highest-scoring sentences. Swap for a real AI API call later. */
function summarize(t) {
  const s = t.replace(/\s+/g, ' ').match(/[^.!?]+[.!?]*/g) || []; if (s.length <= 2) return t.trim() || 'Nothing to summarize yet.';
  const stop = new Set('the and for are was were with this that from have has not but you your can will its into about'.split(' ')), f = {};
  (t.toLowerCase().match(/[a-z']+/g) || []).forEach(w => { if (!stop.has(w) && w.length > 2) f[w] = (f[w] || 0) + 1; });
  return s.map((x, i) => ({ x: x.trim(), i, v: (x.toLowerCase().match(/[a-z']+/g) || []).reduce((a, w) => a + (f[w] || 0), 0) / Math.sqrt(x.length) })).sort((a, b) => b.v - a.v).slice(0, 3).sort((a, b) => a.i - b.i).map(o => o.x).join(' ');
}
let curN = null, nq = '', nf = '';
function pNotes(v) {
  const list = S.notes.filter(n => (!nf || n.subject === nf) && (n.title + ' ' + n.body).toLowerCase().includes(nq.toLowerCase())), n = S.notes.find(x => x.id == curN);
  v.innerHTML = `<div class="split"><div class="card"><div class="row"><input id="ns" placeholder="🔍 Search notes" value="${esc(nq)}" style="flex:1"><button class="btn" id="nn">＋</button></div><select id="nfl"><option value="">All subjects</option>${subOpts(nf)}</select><div>${list.map(x => `<a class="ni ${x.id == curN ? 'on' : ''}" data-id="${x.id}"><b>${esc(x.title || 'Untitled')}</b><small>${esc(x.subject)} · ${esc(x.body.slice(0, 50))}</small></a>`).join('') || '<p class="mut">No notes found.</p>'}</div></div>
  <div class="card">${n ? `<input id="et" value="${esc(n.title)}" placeholder="Title"><select id="es">${subOpts(n.subject)}</select><textarea id="eb" rows="12" placeholder="Write your notes...">${esc(n.body)}</textarea>${n.summary ? `<div class="sum"><b>✨ AI summary</b><p>${esc(n.summary)}</p></div>` : ''}<div class="row"><button class="btn" id="sv">Save</button><button class="btn amb" id="sm">✨ Summarize with AI</button><button class="btn ghost red" id="dn">Delete</button></div>` : '<p class="mut">Select a note or tap ＋ to create one.</p>'}</div></div>`;
  const keep = async () => { 
      if (n) { 
          const title = $('#et').value, subject = $('#es').value, body = $('#eb').value;
          if (n.title !== title || n.subject !== subject || n.body !== body) {
              n.title = title; n.subject = subject; n.body = body;
              try { await api('/notes/' + n.id, 'PUT', { title, subject, body }); } catch(e) { toast('Error saving note: ' + e.message); }
          }
      } 
  };
  $('#ns', v).oninput = e => { nq = e.target.value; pNotes(v); const s = $('#ns'); s.focus(); s.setSelectionRange(nq.length, nq.length); };
  $('#nfl', v).onchange = e => { nf = e.target.value; pNotes(v); };
  $('#nn', v).onclick = async () => { 
      try {
          const res = await api('/notes', 'POST', { title: '', subject: nf || 'General', body: '' });
          S.notes.unshift(res); curN = res.id; await addXP(5, 'new note'); pNotes(v); 
      } catch(err) { toast('Error: ' + err.message); }
  };
  $$('.ni', v).forEach(a => a.onclick = async () => { await keep(); curN = a.dataset.id; pNotes(v); });
  if (n) {
    $('#sv', v).onclick = async () => { await keep(); toast('Note saved'); pNotes(v); };
    $('#sm', v).onclick = async () => { 
        await keep(); 
        const summary = summarize(n.body); 
        try {
            await api('/notes/' + n.id, 'PUT', { summary });
            n.summary = summary; pNotes(v); 
        } catch(e) { toast('Error: ' + e.message); }
    };
    $('#dn', v).onclick = async () => { 
        if (confirm('Delete this note?')) { 
            try {
                await api('/notes/' + n.id, 'DELETE');
                S.notes = S.notes.filter(x => x.id != n.id); curN = null; pNotes(v); 
            } catch(e) { toast('Error: ' + e.message); }
        } 
    };
  }
}

/* Quiz generator. Questions are built from the student's own notes;
   if there are not enough notes it uses study-skill questions.
   To use a real AI, replace makeQuiz() with a call to your backend. */
let QZ = null;
function makeQuiz(sub, topic, diff, n) {
  const text = S.notes.filter(x => sub === 'General' || x.subject === sub).map(x => x.title + '. ' + x.body).join(' ');
  const words = [...new Set((text.match(/[A-Za-z]{6,}/g) || []).map(w => w.toLowerCase()))], minLen = { Easy: 6, Medium: 7, Hard: 9 }[diff];
  let sents = (text.match(/[^.!?\n]{40,220}[.!?]/g) || []).map(x => x.trim()); const tl = topic.toLowerCase();
  sents = topic ? sents.sort((a, b) => b.toLowerCase().includes(tl) - a.toLowerCase().includes(tl)) : shuf(sents);
  const out = [];
  for (const s of sents) {
    if (out.length >= n || words.length < 4) break;
    const all = s.match(/[A-Za-z]{6,}/g) || []; let c = all.filter(w => w.length >= minLen); if (!c.length) c = all; if (!c.length) continue;
    const ans = c[Math.floor(Math.random() * c.length)], wrong = shuf(words.filter(w => w !== ans.toLowerCase())).slice(0, 3); if (wrong.length < 3) continue;
    const o = shuf([ans.toLowerCase(), ...wrong]);
    out.push({ q: 'Fill in the blank: “' + s.replace(new RegExp('\\b' + ans + '\\b'), '_____') + '”', o, a: o.indexOf(ans.toLowerCase()), e: 'From your notes: “' + s + '”' });
  }
  const T = topic || sub;
  const fb = [[`Which approach is best for mastering ${T}?`, ['Active recall and practice questions', 'Re-reading once', 'Skipping hard parts', 'Studying without breaks'], 0, 'Testing yourself strengthens memory far more than passive re-reading.'], [`When should you revise ${T}?`, ['Only the night before', 'At spaced intervals over several days', 'Never if it seems easy', 'Once a year'], 1, 'Spaced repetition beats cramming.'], [`A good first step when learning ${T} is to…`, ['Memorise everything', 'Learn the key definitions and core idea', 'Ignore examples', 'Start with the hardest exercise'], 1, 'Understand the foundations before the details.'], [`How can you check you understand ${T}?`, ['Explain it in your own words', 'Highlight more text', 'Copy the textbook', 'Avoid testing yourself'], 0, 'If you can teach it simply, you understand it (the Feynman technique).'], [`${T} feels hard. What helps most?`, ['Break it into smaller parts', 'Give up on it', 'Only study easy topics', 'Read faster'], 0, 'Chunking makes hard material manageable.'], [`How long should a focused study block be?`, ['20-30 minutes with short breaks', '6 hours non-stop', '2 minutes', 'Only at midnight'], 0, 'Short focused blocks with breaks (Pomodoro) keep concentration high.']];
  shuf(fb).forEach(x => { if (out.length < n) { const c = x[1][x[2]], o = shuf(x[1]); out.push({ q: x[0], o, a: o.indexOf(c), e: x[3] }); } });
  return out;
}
function pQuiz(v) {
  v.innerHTML = `<form class="card qf" id="qf"><label>Subject<select name="s">${subOpts('')}</select></label><label>Topic<input name="t" placeholder="e.g. Algebra (optional)"></label><label>Difficulty<select name="d"><option>Easy</option><option selected>Medium</option><option>Hard</option></select></label><label>Number of questions<input type="number" name="n" min="3" max="15" value="5"></label><button class="btn">Generate Quiz</button></form><div id="qa"></div>`;
  $('#qf', v).onsubmit = e => {
    e.preventDefault(); const f = new FormData(e.target), qs = makeQuiz(f.get('s'), f.get('t').trim(), f.get('d'), +f.get('n'));
    if (qs.length < +f.get('n')) toast('Add more notes for this subject to get more questions');
    QZ = { s: f.get('s'), t: f.get('t').trim(), qs, sub: false, ans: [] }; drawQ();
  };
  if (QZ) drawQ();
}
function drawQ() {
  const a = $('#qa'), L = 'ABCD';
  if (!QZ.sub) {
    a.innerHTML = `<form class="card" id="qq">${QZ.qs.map((q, i) => `<div class="q"><b>${i + 1}. ${esc(q.q)}</b>${q.o.map((o, j) => `<label class="o"><input type="radio" name="q${i}" value="${j}"> ${L[j]}. ${esc(o)}</label>`).join('')}</div>`).join('')}<button class="btn">Submit quiz</button></form>`;
    $('#qq').onsubmit = async e => {
      e.preventDefault(); QZ.ans = QZ.qs.map((_, i) => { const r = $(`input[name=q${i}]:checked`); return r ? +r.value : -1; });
      const score = QZ.qs.filter((q, i) => QZ.ans[i] === q.a).length, p = Math.round(score / QZ.qs.length * 100);
      try {
          const res = await api('/quizzes', 'POST', { subject: QZ.s, topic: QZ.t, score, total: QZ.qs.length, pct: p, date: ymd() });
          S.quizzes.push(res);
          await addXP(10 + score * 5, 'quiz'); 
          QZ.sub = true; QZ.score = score; QZ.p = p; drawQ();
      } catch(err) { toast('Error submitting quiz: ' + err.message); }
    };
  } else {
    a.innerHTML = `<div class="card" style="text-align:center;margin-bottom:18px"><div class="score">${QZ.p}%</div><b>${QZ.score} correct · ${QZ.qs.length - QZ.score} wrong · ${QZ.qs.length} questions</b><p class="mut">${QZ.p >= 80 ? 'Excellent work! 🎉' : QZ.p >= 50 ? 'Good effort. Review the explanations below.' : 'Keep practising. You will improve!'}</p><button class="btn" id="rq">New quiz</button></div>
    <div class="card">${QZ.qs.map((q, i) => `<div class="q"><b>${i + 1}. ${esc(q.q)}</b>${q.o.map((o, j) => `<div class="o ${j === q.a ? 'ok' : j === QZ.ans[i] ? 'no' : ''}">${j === q.a ? '✅' : j === QZ.ans[i] ? '❌' : '•'} ${L[j]}. ${esc(o)}</div>`).join('')}<small>💡 ${esc(q.e)}${QZ.ans[i] === -1 ? ' (not answered)' : ''}</small></div>`).join('')}</div>`;
    $('#rq').onclick = () => { QZ = null; a.innerHTML = ''; scrollTo(0, 0); };
  }
}

/* AI assistant. askAI() is the ONE place to plug in a real API. */
const KB = { photosynthesis: '**Photosynthesis in simple words**\nPlants make their own food using sunlight.\n1. Roots drink up water.\n2. Leaves take in carbon dioxide from the air.\n3. Chlorophyll (the green part) captures sunlight.\n4. The plant turns water + CO₂ into sugar and releases oxygen.\n**Remember:** water + CO₂ + light → sugar + oxygen.', javascript: '**JavaScript for beginners**\nJavaScript makes web pages interactive.\n• Variables store data (let, const)\n• Functions group reusable steps\n• Events react to clicks and typing\n• The DOM lets code change the page\nBuild a small to-do list to practise all four.', algebra: '**Algebra basics**\nAlgebra uses letters for unknown numbers. To solve x + 5 = 12, do the same thing to both sides: subtract 5, so x = 7. Keep the equation balanced like a see-saw.' };
const topicOf = t => { const m = t.match(/\b(?:about|explain|on|of)\s+(.+?)(?:\s+(?:in|like|for|to)\b.*)?[?.!]*$/); return (m ? m[1] : t).replace(/^(a|an|the)\s+/, '').trim(); };
function mockReply(q) {
  const t = q.toLowerCase();
  if (/plan|timetable|schedule/.test(t)) {
    const d = addD(ymd(), 1), ts = S.tasks.filter(x => x.date === d), rows = ts.length ? ts.map(x => `• ${x.start}-${x.end} ${x.subject}: ${x.topic}`) : S.subjects.slice(0, 3).map((s, i) => `• ${hm(1080 + i * 70)}-${hm(1140 + i * 70)} ${s.name}: ${(s.topics.find(x => !x.done) || { n: 'Revision' }).n}`);
    return '**Study plan for tomorrow**\n' + rows.join('\n') + '\n• Finish with a 10-minute recap.\nTip: take a 5-minute break after every 25 minutes.';
  }
  if (/questions|quiz/.test(t)) {
    const n = Math.min(15, parseInt((t.match(/(\d+)/) || [])[1]) || 5), T = topicOf(t).replace(/^\d+\s*(questions|qs)\s*/, ''), Q = [`What is ${T}? Explain it in your own words.`, `List three key terms in ${T} and define them.`, `Give a real-life example of ${T}.`, `What mistakes do students often make with ${T}?`, `How would you explain ${T} to a friend?`, `Solve a simple problem related to ${T}.`, `Compare ${T} with a related concept.`, `Why is ${T} important?`, `Write a short summary of ${T} from memory.`, `Create your own exam question on ${T}.`];
    return `**${n} practice questions on ${T}**\n` + Array.from({ length: n }, (_, i) => `${i + 1}. ${Q[i % Q.length]}`).join('\n');
  }
  for (const k in KB) if (t.includes(k)) return KB[k];
  if (/explain|what is|what are|beginner|simple/.test(t)) { const T = topicOf(t); return `**${T} - explained simply**\n1. Big idea: ${T} is a concept you can learn by breaking it into small parts.\n2. Start with the definition, then find one everyday example.\n3. Practise with 3-5 questions and check your answers.\n4. Explain it aloud without notes. Gaps show what to revise.\nWant me to make practice questions or a study plan for ${T}?`; }
  return 'I can explain topics, make practice questions, or build a study plan. Try: “Explain photosynthesis in simple words” or “Give me 10 questions about JavaScript”.';
}
async function askAI(text) {
  await new Promise(r => setTimeout(r, 700)); return mockReply(text);
}
const fmt = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
function pAssist(v) {
  v.innerHTML = `<div class="card chat"><div class="msgs" id="ms">${S.chat.length ? S.chat.map(m => `<div class="m ${m.r}">${fmt(m.t)}</div>`).join('') : '<div class="m a">Hi! I am your study assistant 🎓 Ask me to explain a topic, make questions, or plan tomorrow.</div>'}</div>
  <div class="chips">${['Explain photosynthesis in simple words', 'Make me a study plan for tomorrow', 'Give me 10 questions about JavaScript', "Explain algebra like I'm a beginner"].map(c => `<button class="chip">${c}</button>`).join('')}</div><form id="cf"><input id="ci" placeholder="Ask anything about your studies…" autocomplete="off"><button class="btn">Send</button><button type="button" class="btn ghost" id="cc">Clear</button></form></div>`;
  const ms = $('#ms', v), add = (r, t) => { const d = document.createElement('div'); d.className = 'm ' + r; d.innerHTML = fmt(t); ms.append(d); ms.scrollTop = ms.scrollHeight; return d; };
  const send = async t => { if (!t.trim()) return; add('u', t); S.chat.push({ r: 'u', t }); localStorage.setItem('sm_chat_' + userId, JSON.stringify(S.chat)); const w = add('a', 'Thinking…'); const r = await askAI(t); w.innerHTML = fmt(r); S.chat.push({ r: 'a', t: r }); localStorage.setItem('sm_chat_' + userId, JSON.stringify(S.chat)); ms.scrollTop = ms.scrollHeight; };
  $('#cf', v).onsubmit = e => { e.preventDefault(); const i = $('#ci'), t = i.value; i.value = ''; send(t); };
  $$('.chip', v).forEach(c => c.onclick = () => send(c.textContent));
  $('#cc', v).onclick = () => { S.chat = []; localStorage.setItem('sm_chat_' + userId, '[]'); pAssist(v); };
  ms.scrollTop = ms.scrollHeight;
}

function pProg(v) {
  const d7 = back(7), h7 = d7.map(hrs), wk = [3, 2, 1, 0].map(w => back(28).slice(w * 7, w * 7 + 7).reduce((a, d) => a + hrs(d), 0)), m30 = back(30).reduce((a, d) => a + hrs(d), 0), done = S.tasks.filter(x => x.done).length, q = S.quizzes.slice(-8);
  v.innerHTML = `<div class="g g4"><div class="card stat"><span>This week</span><b>${h7.reduce((a, b) => a + b, 0).toFixed(1)}h</b></div><div class="card stat"><span>Last 30 days</span><b>${m30.toFixed(1)}h</b></div><div class="card stat"><span>Tasks completed</span><b>${done}</b><small>of ${S.tasks.length}</small></div><div class="card stat"><span>Study streak</span><b>🔥 ${streak()}</b><small>Level ${lvl()} · ${S.xp} XP</small></div></div>
  <div class="g g2"><div class="card"><h3>Weekly study hours</h3>${bars(h7, d7.map(dow), Math.max(1, ...h7))}</div><div class="card"><h3>Monthly study hours (by week)</h3>${bars(wk, ['3 wks ago', '2 wks ago', 'Last wk', 'This wk'], Math.max(1, ...wk))}</div></div>
  <div class="g g2"><div class="card"><h3>Subject-wise progress</h3>${S.subjects.map(s => `<div style="margin-bottom:12px"><div class="row"><b>${esc(s.name)}</b><small>${pct(s)}%</small></div><div class="pb"><i style="width:${pct(s)}%"></i></div></div>`).join('') || '<p class="mut">No subjects yet.</p>'}</div>
  <div class="card"><h3>Quiz scores</h3>${q.length ? bars(q.map(x => x.pct / 10), q.map((x, i) => '#' + (S.quizzes.length - q.length + i + 1)), 10) + '<small>Bars show score out of 10 (100% = 10). Latest 8 quizzes.</small>' : '<p class="mut">Take a quiz to see your scores here.</p>'}</div></div>
  <div class="card"><h3>🏅 Achievements &amp; badges</h3><div class="badges">${BADGES.map(b => `<div class="bd ${b[2]() ? '' : 'lock'}"><b>${b[0]}</b>${b[1]}</div>`).join('')}</div></div>`;
}

let FT = { mode: 'focus', left: 1500, run: false, iv: null, end: 0 };
function pFocus(v) {
  const subs = S.subjects;
  v.innerHTML = `<div class="card" style="max-width:520px;margin:auto;text-align:center"><div class="row" style="justify-content:center"><button class="btn sm ${FT.mode === 'focus' ? '' : 'ghost'}" id="mf">Focus 25</button><button class="btn sm ${FT.mode === 'break' ? '' : 'ghost'}" id="mb">Break 5</button></div><div class="timer" id="tm"></div><p id="cur"></p><div class="g g2" style="text-align:left"><label>Subject<select id="fs">${subs.map(s => `<option>${esc(s.name)}</option>`).join('') || '<option>General</option>'}</select></label><label>Topic<select id="ft"></select></label></div><div class="row" style="justify-content:center"><button class="btn" id="go">${FT.run ? '⏸ Pause' : '▶ Start'}</button><button class="btn ghost" id="rs">↺ Reset</button></div><p class="mut">Today: ${(S.focus[ymd()] || 0)} focus minutes</p></div>`;
  const show = () => { $('#tm').textContent = String(Math.floor(FT.left / 60)).padStart(2, '0') + ':' + String(FT.left % 60).padStart(2, '0'); document.title = $('#tm').textContent + ' · Focus'; $('#cur').innerHTML = FT.mode === 'focus' ? `Focusing on <b>${esc($('#fs').value)}</b> - <b>${esc($('#ft').value || 'general study')}</b>` : '☕ Break time. Stretch and drink water.'; };
  const topics = () => { const s = subs.find(x => x.name === $('#fs').value); $('#ft').innerHTML = (s && s.topics.length ? s.topics.map(t => `<option>${esc(t.n)}</option>`).join('') : '<option>General study</option>'); show(); };
  const setMode = m => { clearInterval(FT.iv); FT = { mode: m, left: m === 'focus' ? 1500 : 300, run: false, iv: null, end: 0 }; pFocus(v); };
  $('#fs').onchange = topics; $('#ft').onchange = show; topics();
  $('#mf').onclick = () => setMode('focus'); $('#mb').onclick = () => setMode('break'); $('#rs').onclick = () => setMode(FT.mode);
  $('#go').onclick = () => {
    if (FT.run) { clearInterval(FT.iv); FT.run = false; $('#go').textContent = '▶ Start'; return; }
    FT.run = true; FT.end = Date.now() + FT.left * 1000; $('#go').textContent = '⏸ Pause';
    FT.iv = setInterval(() => {
      FT.left = Math.max(0, Math.round((FT.end - Date.now()) / 1000)); show();
      if (FT.left === 0) { 
          clearInterval(FT.iv); const was = FT.mode; 
          if (was === 'focus') { 
              api('/focus', 'POST', { date: ymd(), minutes: 25 })
                .then(res => { S.focus[ymd()] = res.minutes; addXP(30, 'focus session'); })
                .catch(e => toast('Error saving focus: ' + e.message));
          } 
          toast(was === 'focus' ? 'Focus session complete! Time for a break.' : 'Break over. Ready to focus?'); 
          FT = { mode: was === 'focus' ? 'break' : 'focus', left: was === 'focus' ? 300 : 1500, run: false, iv: null, end: 0 }; 
          pFocus(v); 
      }
    }, 500);
  };
}

function pSet(v) {
  v.innerHTML = `<div class="g g2"><div class="card" style="display:flex;flex-direction:column;gap:14px"><h3>Profile &amp; preferences</h3><label>Your name<input id="sn" value="${esc(users[email].name)}"></label><label>Daily study goal (hours)<input id="sg" type="number" min="1" max="12" value="${S.set.goal}"></label><label class="chk" style="flex-direction:row;gap:8px"><input type="checkbox" id="sd" ${document.documentElement.dataset.theme === 'dark' ? 'checked' : ''}> Dark mode</label><label class="chk" style="flex-direction:row;gap:8px"><input type="checkbox" id="sno" ${S.set.notif ? 'checked' : ''}> Show reminders &amp; notifications</label><button class="btn" id="ss">Save settings</button></div>
  <div class="card" style="display:flex;flex-direction:column;gap:12px"><h3>Your data</h3><p class="mut">Everything is saved in this browser (${esc(email)}).</p><button class="btn ghost" id="ex">⬇ Export my data</button><button class="btn ghost red" id="rd">Reset all my data</button><button class="btn ghost" id="lo">Log out</button></div></div>`;
  $('#sd').onchange = e => setTheme(e.target.checked ? 'dark' : 'light');
  $('#ss').onclick = async () => { 
      const name = $('#sn').value.trim() || users[email].name;
      const goal = Math.max(1, +$('#sg').value || 3);
      const notif = $('#sno').checked;
      try {
          await api('/user', 'PUT', { name, daily_goal: goal, notifications: notif });
          users[email].name = name; S.set.goal = goal; S.set.notif = notif; toast('Settings saved'); render(); 
      } catch(e) { toast('Error saving settings: ' + e.message); }
  };
  $('#ex').onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' })); a.download = 'studymate-data.json'; a.click(); };
  $('#rd').onclick = async () => { 
      if (confirm('Delete all your subjects, tasks, notes and progress?')) { 
          try {
              for (const s of S.subjects) await api('/subjects/' + s.id, 'DELETE');
              for (const t of S.tasks) await api('/tasks/' + t.id, 'DELETE');
              for (const n of S.notes) await api('/notes/' + n.id, 'DELETE');
              await boot();
              toast('Data reset'); 
          } catch(e) { toast('Error resetting data: ' + e.message); }
      } 
  };
  $('#lo').onclick = () => { localStorage.removeItem('sm_token'); sessionStorage.removeItem('sm_token'); location.href = 'index.html'; };
}

const PAGES = { dashboard: pDash, planner: pPlan, subjects: pSubjects, notes: pNotes, quiz: pQuiz, assistant: pAssist, progress: pProg, focus: pFocus, settings: pSet };
boot();
