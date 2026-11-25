import React, { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'careloop-prototype-v1';

const iconPaths = {
  home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9M9 20v-6h6v6"/></>,
  heart: <path d="M20.8 8.7c0 5.4-8.8 10.3-8.8 10.3S3.2 14.1 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z"/>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
  chart: <><path d="M4 19V5M4 19h17"/><path d="m7 15 4-4 3 2 6-7"/><path d="M17 6h3v3"/></>,
  message: <><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H6l-3 2v-6.5A7.5 7.5 0 1 1 20 11.5Z"/><path d="M8 11h.01M12 11h.01M16 11h.01"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  check: <path d="m5 12 4 4L19 6"/>,
  chevron: <path d="m9 18 6-6-6-6"/>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  droplet: <path d="M12 3s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11Z"/>,
  moon: <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z"/>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
  spark: <><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/></>,
  bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
  arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  download: <><path d="M12 3v12m-5-5 5 5 5-5"/><path d="M4 19v2h16v-2"/></>,
  rotate: <><path d="M20 7v5h-5"/><path d="M20 12a8 8 0 1 0 2 5"/></>,
  close: <path d="m6 6 12 12M18 6 6 18"/>,
  leaf: <><path d="M20 4c-8 0-14 3-14 10a6 6 0 0 0 6 6c7 0 10-6 8-16Z"/><path d="M4 21c3-5 7-8 12-11"/></>,
  shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  trash: <><path d="M4 7h16M10 11v6m4-6v6M5 7l1 14h12l1-14M9 7V4h6v3"/></>
};

function Icon({ name, size = 18, strokeWidth = 1.8, className = '' }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[name] || iconPaths.spark}</svg>;
}

function localDate(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function shiftDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return localDate(date);
}

function formatLongDate(date = new Date()) {
  return new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(date);
}

function createSeedData() {
  const history = [
    { date: shiftDate(-6), mood: 'Steady', moodScore: 3, energy: 6, sleep: 7.1, water: 5, note: 'A balanced day.' },
    { date: shiftDate(-5), mood: 'Good', moodScore: 4, energy: 7, sleep: 7.7, water: 6, note: 'Felt more rested.' },
    { date: shiftDate(-4), mood: 'Okay', moodScore: 3, energy: 5, sleep: 6.3, water: 4, note: 'A slower afternoon.' },
    { date: shiftDate(-3), mood: 'Great', moodScore: 5, energy: 8, sleep: 8.0, water: 7, note: 'Enjoyed a walk outside.' },
    { date: shiftDate(-2), mood: 'Good', moodScore: 4, energy: 7, sleep: 7.5, water: 6, note: 'Kept a gentle routine.' },
    { date: shiftDate(-1), mood: 'Steady', moodScore: 3, energy: 6, sleep: 7.0, water: 5, note: 'Taking the day as it came.' }
  ];
  const routines = [
    { id: 'water', title: 'Start with a glass of water', category: 'Hydration', time: '08:00', icon: 'droplet' },
    { id: 'move', title: 'A little movement', category: 'Movement', time: '08:30', icon: 'sun' },
    { id: 'meds', title: 'Medication reminder (as prescribed)', category: 'Medication', time: '09:00', icon: 'shield' },
    { id: 'winddown', title: 'Make space to wind down', category: 'Sleep', time: '21:00', icon: 'moon' }
  ];
  const completions = {};
  history.forEach((entry, index) => {
    completions[entry.date] = {};
    routines.forEach((routine, i) => { completions[entry.date][routine.id] = (index + i) % 4 !== 0; });
  });
  return {
    profile: { name: 'Alex Morgan', initials: 'AM' },
    routines,
    completions,
    checkins: history,
    messages: [{ id: 'welcome', role: 'assistant', text: 'Hi Alex. I’m here to help you reflect, build gentle routines and explore general wellbeing topics. What would feel useful today?', time: 'Now' }]
  };
}

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...createSeedData(), ...JSON.parse(saved) } : createSeedData();
  } catch {
    return createSeedData();
  }
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getWellbeingReply(question) {
  const q = question.toLowerCase();
  if (/chest pain|can't breathe|cannot breathe|difficulty breathing|stroke|fainting|severe allergic|overdose/.test(q)) {
    return 'Those symptoms can be urgent. Please contact your local emergency service or seek urgent medical care now. I can’t assess emergencies or determine what is causing symptoms.';
  }
  if (/sleep|insomnia|rest|tired/.test(q)) {
    return 'A gentle place to start is a consistent wind-down window: dim bright screens, keep the room comfortable, and try a calming activity you enjoy. Notice how you feel over several days rather than judging one night. Persistent sleep difficulty is worth discussing with a healthcare professional.';
  }
  if (/water|hydration|drink/.test(q)) {
    return 'Hydration needs vary with activity, climate, health and medications. You could use a water bottle as a visual cue and check in with how you feel through the day. Follow any fluid guidance from your clinician, especially if you have been advised to limit fluids.';
  }
  if (/stress|anxious|anxiety|overwhelm/.test(q)) {
    return 'Try making the next step very small: pause, take a few comfortable slow breaths, and name one thing you can influence in the next ten minutes. A short walk or a message to someone you trust may also help. If stress feels persistent or hard to manage, consider speaking with a qualified professional.';
  }
  if (/routine|habit|consistent|motivat/.test(q)) {
    return 'Make the routine easier to begin than to skip. Attach one small action to something you already do, choose a realistic time, and track consistency rather than perfection. You can edit your CareLoop reminders to fit your actual day.';
  }
  if (/medication|medicine|dose|pill/.test(q)) {
    return 'I can help you remember a schedule that your clinician has already prescribed, but I can’t recommend, change or interpret medication doses. Check the prescription label or ask your pharmacist or clinician whenever instructions are unclear.';
  }
  if (/mood|feeling|low|sad/.test(q)) {
    return 'Thanks for checking in with yourself. It can help to describe the feeling without judging it, then choose one manageable supportive action: a little movement, a glass of water, rest, or connecting with someone you trust. Your check-ins are for reflection, not diagnosis.';
  }
  return 'A useful wellbeing check-in is often simple: how rested do you feel, what is your energy like, and what is one small thing that might support you today? I can share general educational information, but I can’t diagnose symptoms or replace advice from your healthcare professional.';
}

function App() {
  const [data, setData] = useState(loadData);
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState('');
  const [checkinSaved, setCheckinSaved] = useState(false);
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const [newRoutine, setNewRoutine] = useState({ title: '', category: 'Wellbeing', time: '08:00' });
  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const today = localDate();
  const todaysCheckin = data.checkins.find((entry) => entry.date === today);
  const [checkinForm, setCheckinForm] = useState({ mood: 'Good', energy: 7, sleep: 7.5, water: 5, note: '' });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (todaysCheckin) setCheckinForm({ mood: todaysCheckin.mood, energy: todaysCheckin.energy, sleep: todaysCheckin.sleep, water: todaysCheckin.water, note: todaysCheckin.note || '' });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const todayCompletion = data.completions[today] || {};
  const completedCount = data.routines.filter((routine) => todayCompletion[routine.id]).length;
  const completionPercent = data.routines.length ? Math.round((completedCount / data.routines.length) * 100) : 0;
  const latestCheckins = useMemo(() => [...data.checkins].sort((a, b) => a.date.localeCompare(b.date)).slice(-7), [data.checkins]);
  const currentStreak = useMemo(() => {
    const checkinDates = new Set(data.checkins.map((entry) => entry.date));
    let streak = 0;
    let cursor = new Date();
    while (checkinDates.has(localDate(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    if (streak === 0) {
      cursor = new Date(); cursor.setDate(cursor.getDate() - 1);
      while (checkinDates.has(localDate(cursor))) { streak += 1; cursor.setDate(cursor.getDate() - 1); }
    }
    return streak;
  }, [data.checkins]);

  function updateData(updater) {
    setData((previous) => typeof updater === 'function' ? updater(previous) : updater);
  }

  function saveCheckin(event) {
    event?.preventDefault();
    const entry = { date: today, ...checkinForm, moodScore: ({ 'Low': 1, 'A little low': 2, 'Steady': 3, 'Good': 4, 'Great': 5 })[checkinForm.mood] || 4 };
    updateData((previous) => ({ ...previous, checkins: [...previous.checkins.filter((item) => item.date !== today), entry].sort((a, b) => a.date.localeCompare(b.date)) }));
    setCheckinSaved(true);
    setToast('Your check-in has been saved.');
  }

  function toggleRoutine(id) {
    updateData((previous) => {
      const day = { ...(previous.completions[today] || {}) };
      day[id] = !day[id];
      return { ...previous, completions: { ...previous.completions, [today]: day } };
    });
  }

  function addRoutine(event) {
    event.preventDefault();
    if (!newRoutine.title.trim()) return;
    const routine = { id: `routine-${Date.now()}`, title: newRoutine.title.trim(), category: newRoutine.category, time: newRoutine.time, icon: newRoutine.category === 'Hydration' ? 'droplet' : newRoutine.category === 'Sleep' ? 'moon' : newRoutine.category === 'Movement' ? 'sun' : 'heart' };
    updateData((previous) => ({ ...previous, routines: [...previous.routines, routine] }));
    setNewRoutine({ title: '', category: 'Wellbeing', time: '08:00' });
    setShowRoutineModal(false);
    setToast('Reminder added to your routine.');
  }

  function deleteRoutine(id) {
    updateData((previous) => ({ ...previous, routines: previous.routines.filter((item) => item.id !== id) }));
    setToast('Reminder removed.');
  }

  function sendMessage(event) {
    event.preventDefault();
    const text = chatInput.trim();
    if (!text || isSending) return;
    setIsSending(true);
    const userMessage = { id: `m-${Date.now()}`, role: 'user', text, time: 'Now' };
    const assistantMessage = { id: `a-${Date.now() + 1}`, role: 'assistant', text: getWellbeingReply(text), time: 'Now' };
    updateData((previous) => ({ ...previous, messages: [...previous.messages, userMessage, assistantMessage].slice(-40) }));
    setChatInput('');
    setIsSending(false);
  }

  function exportData() {
    const blob = new Blob([JSON.stringify({ ...data, exportedAt: new Date().toISOString(), demoNotice: 'Fictional demo data. Not a medical record.' }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = `careloop-demo-${today}.json`; anchor.click();
    URL.revokeObjectURL(url);
    setToast('Your demo data export is ready.');
  }

  function resetDemo() {
    if (!window.confirm('Reset CareLoop to the original sample data? Your local changes will be cleared.')) return;
    const fresh = createSeedData();
    setData(fresh);
    setCheckinForm({ mood: 'Good', energy: 7, sleep: 7.5, water: 5, note: '' });
    setCheckinSaved(false);
    setToast('Demo data reset.');
  }

  function navigate(tab) { setActiveTab(tab); setMobileMenu(false); }

  const navigation = [
    { id: 'overview', label: 'Overview', icon: 'home' },
    { id: 'checkin', label: 'Daily check-in', icon: 'heart' },
    { id: 'routine', label: 'My routine', icon: 'calendar' },
    { id: 'progress', label: 'Progress', icon: 'chart' },
    { id: 'companion', label: 'AI companion', icon: 'message' }
  ];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><span></span><i></i></div>
          <div><div className="brand-name">careloop<span>.</span></div><div className="brand-caption">WELLBEING, IN RHYTHM</div></div>
          <button className="mobile-close icon-button" onClick={() => setMobileMenu(false)} aria-label="Close menu"><Icon name="close" /></button>
        </div>
        <div className="workspace-label">YOUR SPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map((item) => <button key={item.id} onClick={() => navigate(item.id)} className={`nav-item ${activeTab === item.id ? 'active' : ''}`}><Icon name={item.icon} size={18} /><span>{item.label}</span>{item.id === 'checkin' && !todaysCheckin && <b className="nav-dot"></b>}</button>)}
        </nav>
        <div className="sidebar-spacer"></div>
        <div className="sidebar-note">
          <div className="note-orb"><span></span></div>
          <p className="note-kicker">A GENTLE REMINDER</p>
          <p className="note-copy">Progress isn't a straight line. Show up in the way you can.</p>
        </div>
        <div className="profile-mini">
          <div className="avatar">{data.profile.initials || 'AM'}</div>
          <div className="profile-text"><strong>{data.profile.name || 'Alex Morgan'}</strong><span>Personal space · Demo</span></div>
          <span className="online-dot"></span>
        </div>
      </aside>

      {mobileMenu && <button className="scrim" aria-label="Close navigation" onClick={() => setMobileMenu(false)}></button>}

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu icon-button" onClick={() => setMobileMenu(true)} aria-label="Open menu"><Icon name="menu" /></button>
            <div className="breadcrumbs"><span>My wellbeing</span><Icon name="chevron" size={13}/><strong>{navigation.find((item) => item.id === activeTab)?.label}</strong></div>
          </div>
          <div className="topbar-right"><span className="demo-pill"><i></i> DEMO ENVIRONMENT</span><button className="icon-button notification-button" onClick={() => navigate('routine')} aria-label="View reminders"><Icon name="bell"/><i></i></button><div className="top-avatar">{data.profile.initials || 'AM'}</div></div>
        </header>

        <div className="page-wrap">
          {activeTab === 'overview' && <OverviewPage data={data} today={today} todayCompletion={todayCompletion} completedCount={completedCount} completionPercent={completionPercent} currentStreak={currentStreak} latestCheckins={latestCheckins} todaysCheckin={todaysCheckin} checkinForm={checkinForm} setCheckinForm={setCheckinForm} saveCheckin={saveCheckin} checkinSaved={checkinSaved} toggleRoutine={toggleRoutine} navigate={navigate} setShowRoutineModal={setShowRoutineModal} />}
          {activeTab === 'checkin' && <CheckinPage checkinForm={checkinForm} setCheckinForm={setCheckinForm} saveCheckin={saveCheckin} checkinSaved={checkinSaved} todaysCheckin={todaysCheckin} />}
          {activeTab === 'routine' && <RoutinePage routines={data.routines} todayCompletion={todayCompletion} toggleRoutine={toggleRoutine} setShowRoutineModal={setShowRoutineModal} deleteRoutine={deleteRoutine} />}
          {activeTab === 'progress' && <ProgressPage data={data} latestCheckins={latestCheckins} completionPercent={completionPercent} completedCount={completedCount} routines={data.routines} todayCompletion={todayCompletion} exportData={exportData} />}
          {activeTab === 'companion' && <CompanionPage messages={data.messages} chatInput={chatInput} setChatInput={setChatInput} sendMessage={sendMessage} isSending={isSending} />}
          <footer className="page-footer"><span>CARELOOP <b>·</b> YOUR WELLBEING, IN RHYTHM</span><span>Sample data only · Not a medical record or medical advice</span></footer>
        </div>
      </main>

      {showRoutineModal && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowRoutineModal(false); }}><div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="routine-modal-title"><div className="modal-head"><div><span className="eyebrow">MAKE IT YOURS</span><h2 id="routine-modal-title">Add a reminder</h2></div><button className="icon-button" onClick={() => setShowRoutineModal(false)} aria-label="Close"><Icon name="close"/></button></div><form onSubmit={addRoutine} className="modal-form"><label>What would you like to remember?<input autoFocus value={newRoutine.title} onChange={(e) => setNewRoutine({ ...newRoutine, title: e.target.value })} placeholder="e.g. Take a screen break" maxLength={64} required /></label><div className="form-two"><label>Category<select value={newRoutine.category} onChange={(e) => setNewRoutine({ ...newRoutine, category: e.target.value })}><option>Wellbeing</option><option>Hydration</option><option>Movement</option><option>Medication</option><option>Sleep</option></select></label><label>Reminder time<input type="time" value={newRoutine.time} onChange={(e) => setNewRoutine({ ...newRoutine, time: e.target.value })} /></label></div><div className="modal-actions"><button type="button" className="button button-quiet" onClick={() => setShowRoutineModal(false)}>Cancel</button><button className="button button-primary" type="submit"><Icon name="plus" size={16}/> Add reminder</button></div></form></div></div>}
      {toast && <div className="toast"><span className="toast-check"><Icon name="check" size={14}/></span>{toast}</div>}
      <button className="reset-demo" onClick={resetDemo} title="Restore original sample data"><Icon name="rotate" size={14}/><span>Reset demo</span></button>
    </div>
  );
}

function PageHeading({ eyebrow, title, description, action }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}

function Orb({ small = false }) {
  return <div className={`orb-scene ${small ? 'orb-small' : ''}`} aria-hidden="true"><div className="orb-shadow"></div><div className="orb-ring ring-one"></div><div className="orb-ring ring-two"></div><div className="orb-core"><div className="orb-glow"></div><div className="orb-glint"></div><div className="orb-latitude"></div></div><div className="orb-particle particle-one"></div><div className="orb-particle particle-two"></div><div className="orb-particle particle-three"></div></div>;
}

function OverviewPage(props) {
  const { data, todayCompletion, completedCount, completionPercent, currentStreak, latestCheckins, todaysCheckin, checkinForm, setCheckinForm, saveCheckin, checkinSaved, toggleRoutine, navigate, setShowRoutineModal } = props;
  return <>
    <div className="welcome-row"><div><div className="eyebrow date-eyebrow">{formatLongDate()}</div><h1>{getGreeting()}, {data.profile.name.split(' ')[0]} <span className="wave">✦</span></h1><p className="welcome-sub">A little check-in. A little progress. Your pace, your way.</p></div><div className="week-chip"><span className="week-chip-icon"><Icon name="spark" size={15}/></span><span><b>{currentStreak || 0} day{currentStreak === 1 ? '' : 's'}</b><small>check-in streak</small></span></div></div>

    <section className="hero-card">
      <div className="hero-content"><div className="hero-label"><span className="hero-label-dot"></span> YOUR DAILY SPACE</div><h2>Wellbeing is built<br/>in the <em>little moments.</em></h2><p>Notice how you're feeling, keep the promises you make to yourself, and celebrate the small things.</p><button className="hero-button" onClick={() => navigate('checkin')}>{todaysCheckin ? 'View today’s check-in' : 'Start your daily check-in'} <Icon name="arrow" size={16}/></button><div className="hero-footnote"><span className="mini-check"><Icon name="check" size={11}/></span> Your data stays on this device</div></div>
      <div className="hero-art"><div className="art-aura aura-one"></div><div className="art-aura aura-two"></div><Orb/><div className="orb-caption caption-top"><span></span> SMALL STEPS, EVERY DAY</div><div className="orb-caption caption-bottom"><b>01</b><span>YOUR WELLBEING<br/>COMPANION</span></div></div>
      <div className="hero-index">C / 01</div>
    </section>

    <div className="stats-grid">
      <StatCard icon="heart" label="Daily check-in" value={todaysCheckin ? 'Complete' : 'Not yet'} detail={todaysCheckin ? 'You made time for yourself' : 'A moment to notice how you feel'} tone="blue" />
      <StatCard icon="check" label="Routine progress" value={`${completedCount}/${data.routines.length}`} detail={`${completionPercent}% of today’s reminders`} tone="violet" progress={completionPercent} />
      <StatCard icon="calendar" label="Check-in streak" value={`${currentStreak} day${currentStreak === 1 ? '' : 's'}`} detail="One day at a time" tone="cyan" />
    </div>

    <div className="dashboard-grid">
      <div className="dashboard-main-col">
        <section className="surface-card checkin-card">
          <div className="section-head"><div><div className="eyebrow">PAUSE & REFLECT</div><h2>How are you feeling today?</h2><p>A quick check-in helps you notice your patterns.</p></div><button className="text-link" onClick={() => navigate('checkin')}>Full check-in <Icon name="arrow" size={14}/></button></div>
          <form onSubmit={saveCheckin}>
            <div className="mood-options" role="group" aria-label="Choose your mood">{[{label:'Low',face:'–',tone:'low'},{label:'A little low',face:'·',tone:'low'},{label:'Steady',face:'◡',tone:'steady'},{label:'Good',face:'☺',tone:'good'},{label:'Great',face:'✦',tone:'great'}].map((mood) => <button type="button" key={mood.label} className={`mood-option ${checkinForm.mood === mood.label ? 'selected' : ''}`} onClick={() => setCheckinForm({ ...checkinForm, mood: mood.label })}><span className={`mood-face ${mood.tone}`}>{mood.face}</span><span>{mood.label}</span></button>)}</div>
            <div className="checkin-controls"><label className="range-control"><span><b>Energy</b><strong>{checkinForm.energy}/10</strong></span><input type="range" min="1" max="10" value={checkinForm.energy} onChange={(e) => setCheckinForm({ ...checkinForm, energy: Number(e.target.value) })}/><small><span>Running low</span><span>Full of energy</span></small></label><label className="range-control"><span><b>Sleep</b><strong>{Number(checkinForm.sleep).toFixed(1)} hrs</strong></span><input type="range" min="0" max="12" step="0.5" value={checkinForm.sleep} onChange={(e) => setCheckinForm({ ...checkinForm, sleep: Number(e.target.value) })}/><small><span>Less rest</span><span>More rest</span></small></label></div>
            <div className="checkin-submit-row"><span className="privacy-note"><Icon name="shield" size={14}/> Just for your reflection</span><button type="submit" className="button button-primary">{todaysCheckin ? 'Update check-in' : 'Save check-in'} <Icon name="arrow" size={15}/></button></div>
          </form>
        </section>

        <section className="surface-card routine-card">
          <div className="section-head"><div><div className="eyebrow">YOUR EVERYDAY RHYTHM</div><h2>Today’s routine</h2><p>Small, repeatable actions add up.</p></div><button className="round-add" onClick={() => setShowRoutineModal(true)} aria-label="Add routine reminder"><Icon name="plus"/></button></div>
          <div className="routine-progress-line"><div className="routine-progress-track"><span style={{ width: `${completionPercent}%` }}></span></div><b>{completedCount} of {data.routines.length} done</b></div>
          <div className="routine-list compact-list">{data.routines.slice(0, 4).map((routine) => <RoutineRow key={routine.id} routine={routine} done={!!todayCompletion[routine.id]} onToggle={() => toggleRoutine(routine.id)}/>)}</div>
          <button className="view-routine-link" onClick={() => navigate('routine')}>View all reminders <Icon name="arrow" size={14}/></button>
        </section>
      </div>

      <div className="dashboard-side-col">
        <section className="streak-card"><div className="streak-top"><div><div className="eyebrow">YOUR MOMENTUM</div><h2>Keep your<br/><em>own rhythm.</em></h2></div><div className="streak-icon"><Icon name="spark" size={20}/></div></div><div className="streak-number">{currentStreak}<span>days</span></div><p>Every check-in is a small act of care. There’s no perfect streak to chase.</p><div className="streak-days">{lastSevenLabels().map((day, i) => <div className="streak-day" key={day.date}><span className={`streak-day-dot ${data.checkins.some((entry) => entry.date === day.date) ? 'done' : ''} ${day.date === localDate() ? 'today' : ''}`}>{data.checkins.some((entry) => entry.date === day.date) ? <Icon name="check" size={11}/> : ''}</span><small>{day.label}</small></div>)}</div></section>

        <section className="surface-card week-card"><div className="section-head"><div><div className="eyebrow">A QUICK LOOK BACK</div><h2>This week</h2></div><button className="icon-link" onClick={() => navigate('progress')} aria-label="See progress"><Icon name="arrow" size={16}/></button></div><MiniChart checkins={latestCheckins}/><div className="week-legend"><span><i></i> Daily mood</span><span>Past 7 days</span></div><button className="view-routine-link" onClick={() => navigate('progress')}>Explore your progress <Icon name="arrow" size={14}/></button></section>

        <section className="companion-promo"><div className="companion-promo-orb"><Orb small/></div><div><span className="eyebrow">A SPACE TO EXPLORE</span><h3>Curious about<br/>your wellbeing?</h3><p>Ask your AI companion for general, thoughtful guidance.</p><button onClick={() => navigate('companion')}>Talk to companion <Icon name="arrow" size={14}/></button></div></section>
      </div>
    </div>
  </>;
}

function StatCard({ icon, label, value, detail, tone, progress }) {
  return <div className={`stat-card tone-${tone}`}><div className="stat-icon"><Icon name={icon} size={17}/></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-detail">{detail}</div>{typeof progress === 'number' && <div className="stat-progress"><span style={{ width: `${progress}%` }}></span></div>}</div>;
}

function RoutineRow({ routine, done, onToggle, onDelete, showDelete = false }) {
  return <div className={`routine-row ${done ? 'routine-done' : ''}`}><button className={`routine-check ${done ? 'checked' : ''}`} onClick={onToggle} aria-label={done ? `Mark ${routine.title} incomplete` : `Mark ${routine.title} complete`}>{done && <Icon name="check" size={14}/>}</button><span className={`routine-row-icon category-${routine.category.toLowerCase()}`}><Icon name={routine.icon || 'heart'} size={17}/></span><div className="routine-row-copy"><b>{routine.title}</b><span>{routine.category}</span></div><div className="routine-row-time"><Icon name="clock" size={13}/>{routine.time}</div>{showDelete && <button className="delete-routine" onClick={onDelete} aria-label={`Delete ${routine.title}`}><Icon name="trash" size={15}/></button>}</div>;
}

function lastSevenLabels() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(); date.setDate(date.getDate() - (6 - index));
    return { date: localDate(date), label: new Intl.DateTimeFormat('en', { weekday: 'short' }).format(date).slice(0, 1) };
  });
}

function MiniChart({ checkins }) {
  const values = lastSevenLabels().map((day) => checkins.find((entry) => entry.date === day.date)?.moodScore || 0);
  const max = 5; const width = 320; const height = 100; const padding = 10;
  const coords = values.map((value, index) => ({ x: padding + index * ((width - padding * 2) / 6), y: height - padding - (value / max) * (height - padding * 2) }));
  const path = coords.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const area = `${path} L ${coords[coords.length - 1].x} ${height - padding} L ${coords[0].x} ${height - padding} Z`;
  return <div className="mini-chart-wrap"><svg className="mini-chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label="Mood check-in chart for the last seven days"><defs><linearGradient id="moodFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5aaaff" stopOpacity=".24"/><stop offset="100%" stopColor="#5aaaff" stopOpacity="0"/></linearGradient></defs><path d={area} fill="url(#moodFill)"/><path d={path} fill="none" stroke="#408cf3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>{coords.map((point, i) => values[i] ? <circle key={i} cx={point.x} cy={point.y} r="3.5" fill="#fff" stroke="#408cf3" strokeWidth="2"/> : null)}</svg><div className="chart-x-labels">{lastSevenLabels().map((day) => <span key={day.date}>{day.label}</span>)}</div></div>;
}

function CheckinPage({ checkinForm, setCheckinForm, saveCheckin, checkinSaved, todaysCheckin }) {
  const moods = [{label:'Low',emoji:'–',desc:'A harder day'},{label:'A little low',emoji:'·',desc:'Not quite yourself'},{label:'Steady',emoji:'◡',desc:'Taking it as it comes'},{label:'Good',emoji:'☺',desc:'Feeling alright'},{label:'Great',emoji:'✦',desc:'Feeling positive'}];
  return <>
    <PageHeading eyebrow="PAUSE & REFLECT · 01" title="Your daily check-in" description="A few moments to notice how you’re doing. There are no right answers." action={<span className="date-tag"><Icon name="calendar" size={15}/>{formatLongDate()}</span>}/>
    <div className="checkin-page-grid"><section className="surface-card checkin-form-card"><div className="form-section-title"><span className="step-number">01</span><div><h2>How’s your mood?</h2><p>Choose the feeling that comes closest. It doesn’t have to be perfect.</p></div></div><div className="mood-cards">{moods.map((mood) => <button key={mood.label} className={`mood-card ${checkinForm.mood === mood.label ? 'selected' : ''}`} onClick={() => setCheckinForm({ ...checkinForm, mood: mood.label })}><span className="mood-card-face">{mood.emoji}</span><b>{mood.label}</b><small>{mood.desc}</small></button>)}</div><div className="form-divider"></div><div className="form-section-title"><span className="step-number">02</span><div><h2>Check in with your body</h2><p>Use the sliders to capture how today feels.</p></div></div><div className="large-range-grid"><label className="range-control"><span><b>Energy level</b><strong>{checkinForm.energy} / 10</strong></span><input type="range" min="1" max="10" value={checkinForm.energy} onChange={(e) => setCheckinForm({ ...checkinForm, energy: Number(e.target.value) })}/><small><span>Low energy</span><span>High energy</span></small></label><label className="range-control"><span><b>Hours of sleep</b><strong>{Number(checkinForm.sleep).toFixed(1)} hrs</strong></span><input type="range" min="0" max="12" step="0.5" value={checkinForm.sleep} onChange={(e) => setCheckinForm({ ...checkinForm, sleep: Number(e.target.value) })}/><small><span>Less rest</span><span>More rest</span></small></label><label className="range-control"><span><b>Glasses of water</b><strong>{checkinForm.water} glasses</strong></span><input type="range" min="0" max="12" value={checkinForm.water} onChange={(e) => setCheckinForm({ ...checkinForm, water: Number(e.target.value) })}/><small><span>Not much</span><span>More today</span></small></label></div><div className="form-divider"></div><label className="notes-label"><span><b>Anything on your mind?</b><small>Optional · A private note for your own reflection</small></span><textarea value={checkinForm.note} onChange={(e) => setCheckinForm({ ...checkinForm, note: e.target.value })} maxLength={500} placeholder="A moment worth remembering, something that felt good, or simply how the day is going…" rows={4}></textarea><small className="character-count">{checkinForm.note.length}/500</small></label><div className="checkin-form-footer"><span className="privacy-note"><Icon name="shield" size={15}/> Saved only in this browser</span><button className="button button-primary button-large" onClick={saveCheckin}>{todaysCheckin ? 'Update today’s check-in' : 'Save today’s check-in'} <Icon name="arrow" size={16}/></button></div>{checkinSaved && <div className="inline-success"><Icon name="check" size={15}/> Your check-in is saved for today.</div>}</section><aside className="checkin-aside"><div className="soft-blue-card"><div className="soft-card-orb"><Orb small/></div><div className="eyebrow">A NOTE TO SELF</div><h3>You don’t have to<br/>have it all figured out.</h3><p>Noticing is a meaningful first step. Your check-in is a snapshot, not a scorecard.</p></div><div className="surface-card checkin-tip"><div className="tip-icon"><Icon name="leaf"/></div><h3>Make room for the real you.</h3><p>Some days feel lighter than others. Try to record what is true, not what you think you should feel.</p></div></aside></div>
  </>;
}

function RoutinePage({ routines, todayCompletion, toggleRoutine, setShowRoutineModal, deleteRoutine }) {
  const sorted = [...routines].sort((a,b) => a.time.localeCompare(b.time));
  const done = routines.filter((routine) => todayCompletion[routine.id]).length;
  return <>
    <PageHeading eyebrow="YOUR EVERYDAY RHYTHM · 02" title="My routine" description="A gentle structure for the things that help you feel more like yourself." action={<button className="button button-primary" onClick={() => setShowRoutineModal(true)}><Icon name="plus" size={16}/> Add reminder</button>}/>
    <div className="routine-overview-card"><div className="routine-overview-copy"><div className="eyebrow">TODAY’S PROGRESS</div><h2>{done === routines.length && routines.length ? 'Look at you, showing up.' : 'One small step at a time.'}</h2><p>You’ve completed <b>{done} of {routines.length}</b> reminders today. Your routine should support you, not add pressure.</p></div><div className="routine-ring" style={{ '--progress': `${routines.length ? Math.round(done / routines.length * 100) : 0}%` }}><div><b>{routines.length ? Math.round(done / routines.length * 100) : 0}<small>%</small></b><span>complete</span></div></div></div>
    <div className="routine-content-grid"><section className="surface-card full-routine-card"><div className="section-head"><div><div className="eyebrow">YOUR REMINDERS</div><h2>Today, at your pace</h2><p>Tap the circle when you’ve completed an action.</p></div><span className="count-badge">{routines.length} reminders</span></div>{sorted.length ? <div className="routine-list full-list">{sorted.map((routine) => <RoutineRow key={routine.id} routine={routine} done={!!todayCompletion[routine.id]} onToggle={() => toggleRoutine(routine.id)} onDelete={() => deleteRoutine(routine.id)} showDelete/>)}</div> : <div className="empty-state"><div className="empty-icon"><Icon name="calendar" size={24}/></div><h3>A little space to start</h3><p>Add your first reminder and build a routine that works for you.</p><button className="button button-primary" onClick={() => setShowRoutineModal(true)}><Icon name="plus" size={15}/> Add a reminder</button></div>}</section><aside className="routine-aside"><section className="surface-card rhythm-tip-card"><div className="tip-orb"><Orb small/></div><div className="eyebrow">A GENTLER WAY</div><h3>Build around<br/>your real life.</h3><p>Start with actions that already fit into your day. You can adjust the timing or remove anything that no longer serves you.</p></section><section className="routine-safety-note"><Icon name="shield" size={18}/><p><b>Medication reminders</b><br/>CareLoop only helps you remember a schedule you already have. It does not suggest medicines, doses or treatment changes.</p></section></aside></div>
  </>;
}

function ProgressPage({ data, latestCheckins, completionPercent, completedCount, routines, todayCompletion, exportData }) {
  const avgEnergy = latestCheckins.length ? (latestCheckins.reduce((sum, item) => sum + Number(item.energy || 0), 0) / latestCheckins.length).toFixed(1) : '—';
  const avgSleep = latestCheckins.length ? (latestCheckins.reduce((sum, item) => sum + Number(item.sleep || 0), 0) / latestCheckins.length).toFixed(1) : '—';
  return <>
    <PageHeading eyebrow="NOTICE YOUR PATTERNS · 03" title="Your progress" description="A few gentle signals from your check-ins. Patterns matter more than perfect days." action={<button className="button button-quiet" onClick={exportData}><Icon name="download" size={16}/> Export my data</button>}/>
    <div className="progress-summary-grid"><div className="progress-summary-card"><span className="summary-icon blue"><Icon name="heart"/></span><div><span>Check-ins recorded</span><b>{data.checkins.length}</b><small>Across your demo timeline</small></div></div><div className="progress-summary-card"><span className="summary-icon violet"><Icon name="sun"/></span><div><span>Average energy</span><b>{avgEnergy}<small>/10</small></b><small>Past {latestCheckins.length || 0} check-ins</small></div></div><div className="progress-summary-card"><span className="summary-icon cyan"><Icon name="moon"/></span><div><span>Average sleep</span><b>{avgSleep}<small> hrs</small></b><small>Past {latestCheckins.length || 0} check-ins</small></div></div></div>
    <div className="progress-grid"><section className="surface-card progress-chart-card"><div className="section-head"><div><div className="eyebrow">MOOD OVER TIME</div><h2>Your recent check-ins</h2><p>Based on the mood you selected each day.</p></div><span className="chart-period">LAST 7 DAYS</span></div><LargeMoodChart checkins={latestCheckins}/><div className="mood-scale"><span>Low</span><span>Steady</span><span>Great</span></div><div className="chart-footnote"><span className="chart-dot"></span> A reflection, not a clinical measurement</div></section><section className="surface-card progress-routine-card"><div className="eyebrow">TODAY’S ROUTINE</div><h2>Small actions, repeated</h2><div className="progress-ring-large" style={{ '--progress': `${completionPercent}%` }}><div><b>{completionPercent}<small>%</small></b><span>complete</span></div></div><div className="progress-routine-count"><b>{completedCount} of {routines.length}</b><span>reminders completed today</span></div><div className="small-progress-track"><span style={{ width: `${completionPercent}%` }}></span></div><p>Consistency is personal. Use this as a helpful snapshot, not a measure of your health.</p></section></div>
    <section className="surface-card log-card"><div className="section-head"><div><div className="eyebrow">YOUR REFLECTIONS</div><h2>Recent check-in log</h2><p>Your saved entries, newest first.</p></div><span className="count-badge">{data.checkins.length} entries</span></div><div className="log-table-wrap"><table className="log-table"><thead><tr><th>DATE</th><th>MOOD</th><th>ENERGY</th><th>SLEEP</th><th>WATER</th><th>NOTE</th></tr></thead><tbody>{[...data.checkins].sort((a,b) => b.date.localeCompare(a.date)).slice(0,10).map((entry) => <tr key={entry.date}><td>{entry.date === localDate() ? 'Today' : new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(`${entry.date}T12:00:00`))}</td><td><span className={`mood-tag mood-${entry.mood.toLowerCase().replaceAll(' ', '-')}`}>{entry.mood}</span></td><td>{entry.energy}/10</td><td>{Number(entry.sleep).toFixed(1)} hrs</td><td>{entry.water} glasses</td><td className="log-note">{entry.note || '—'}</td></tr>)}</tbody></table></div><div className="log-disclaimer"><Icon name="shield" size={14}/> This is user-entered demo information stored locally in your browser.</div></section>
  </>;
}

function LargeMoodChart({ checkins }) {
  const labels = lastSevenLabels();
  const values = labels.map((day) => checkins.find((entry) => entry.date === day.date)?.moodScore || 0);
  const W = 720, H = 250, left = 34, right = 18, top = 18, bottom = 36;
  const x = (i) => left + i * ((W - left - right) / 6);
  const y = (v) => H - bottom - (v / 5) * (H - top - bottom);
  const points = values.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  const area = `${left},${H-bottom} ${points} ${x(6)},${H-bottom}`;
  return <div className="large-chart-wrap"><svg viewBox={`0 0 ${W} ${H}`} className="large-chart" role="img" aria-label="Mood trend over the past seven days"><defs><linearGradient id="largeMoodFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3289f2" stopOpacity=".20"/><stop offset="100%" stopColor="#3289f2" stopOpacity="0"/></linearGradient></defs>{[1,2,3,4,5].map((v) => <g key={v}><line x1={left} x2={W-right} y1={y(v)} y2={y(v)} stroke="#eaf0f8" strokeDasharray="3 5"/><text x="10" y={y(v)+4} fill="#9aabc1" fontSize="11">{v}</text></g>)}<polygon points={area} fill="url(#largeMoodFill)"/><polyline points={points} fill="none" stroke="#3385ed" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>{values.map((v,i) => v ? <g key={i}><circle cx={x(i)} cy={y(v)} r="7" fill="#fff" stroke="#3385ed" strokeWidth="3"/><text x={x(i)} y={H-8} textAnchor="middle" fill="#8395ac" fontSize="11">{labels[i].label}</text></g> : <text key={i} x={x(i)} y={H-8} textAnchor="middle" fill="#8395ac" fontSize="11">{labels[i].label}</text>)}</svg></div>;
}

function CompanionPage({ messages, chatInput, setChatInput, sendMessage, isSending }) {
  const suggestions = ['How can I build a calmer evening routine?', 'Share a few gentle hydration habits', 'I want to feel more consistent'];
  return <>
    <PageHeading eyebrow="THOUGHTFUL GUIDANCE · 04" title="Your AI companion" description="A friendly space for general wellbeing education, reflection and small next steps." action={<span className="companion-status"><i></i> DEMO COMPANION</span>}/>
    <div className="companion-layout"><section className="surface-card chat-card"><div className="chat-head"><div className="chat-avatar"><Orb small/></div><div><b>CareLoop companion</b><span><i></i> Available for a conversation</span></div><span className="chat-demo-tag">SIMULATED</span></div><div className="chat-messages" aria-live="polite">{messages.map((message) => <div key={message.id} className={`message-row ${message.role === 'user' ? 'user-message-row' : ''}`}><div className={`message-avatar ${message.role}`}>{message.role === 'assistant' ? <Icon name="spark" size={15}/> : 'AM'}</div><div className="message-bubble-wrap"><div className={`message-bubble ${message.role}`}>{message.text}</div><small>{message.time}</small></div></div>)}</div><form className="chat-composer" onSubmit={sendMessage}><input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask a general wellbeing question…" maxLength={500} aria-label="Your message"/><button type="submit" disabled={!chatInput.trim() || isSending} aria-label="Send message"><Icon name="arrow" size={18}/></button></form><div className="chat-composer-foot"><span>Press Enter to send</span><span>{chatInput.length}/500</span></div></section><aside className="companion-side"><div className="companion-visual-card"><div className="companion-visual-orb"><Orb/></div><div className="eyebrow">A MOMENT OF CLARITY</div><h3>Good questions<br/>make room for<br/><em>good days.</em></h3><p>Start wherever you are. There’s no script to follow.</p></div><section className="surface-card prompt-card"><div className="eyebrow">NOT SURE WHERE TO START?</div><h3>Try asking…</h3><div className="suggestion-list">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => setChatInput(suggestion)}>{suggestion}<Icon name="arrow" size={14}/></button>)}</div></section></aside></div>
    <div className="ai-disclaimer"><Icon name="shield" size={17}/><div><b>A note about this demo companion</b><p>Responses are generated from simple local examples, not a live AI model. This is general educational information only — not a diagnosis, treatment recommendation or substitute for professional care. Don’t enter sensitive personal or medical information.</p></div></div>
  </>;
}

export default App;
