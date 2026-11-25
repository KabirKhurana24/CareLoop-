# CareLoop — AI Health Companion (Prototype)

A responsive, web-first wellbeing companion prototype reconstructed from the original CareLoop product direction: daily check-ins, adherence reminders, progress logs and an AI educational companion. The interface uses a layered blue 3D visual language with a floating orb, orbital rings, deep-blue surfaces and soft glass-like panels.

> **Demo boundary:** All people, routines and historical check-ins are fictional sample data. Entries are stored in this browser only. CareLoop is not a medical record, diagnostic tool, treatment planner or substitute for professional care. The companion in this prototype uses local example responses; it is not connected to a live AI model.

## Run on Windows

1. Install **Node.js 18 or newer** (Node.js 20+ recommended).
2. Extract the ZIP.
3. Double-click `run.bat`.
4. The script installs the project dependencies the first time and starts the app. Open the local address printed in the terminal (normally `http://localhost:5173`).

You can also run it manually:

```bash
npm install
npm run dev
```

## Included interactions

- **Overview:** daily greeting, check-in prompt, routine completion, streak and seven-day mood snapshot.
- **Daily check-in:** mood selection, energy/sleep/water sliders, optional note, save and edit today's entry.
- **My routine:** add reminders, set a time and category, mark complete/incomplete, delete reminders.
- **Progress:** mood trend chart, routine completion, recent check-in log and JSON export.
- **AI companion:** local sample responses for general wellbeing education, sleep, hydration, stress, routines and medication-reminder questions. Urgent symptom phrases return an emergency-care prompt.
- **Persistence:** edits are saved in browser `localStorage` and survive refreshes. Use **Reset demo** to restore the fictional starting state.
- **PWA shell:** manifest and service worker are included. The service worker is registered in production builds.

## Build for deployment

```bash
npm install
npm run build
npm run preview
```

For Vercel or Netlify, use the Vite preset, build command `npm run build`, and output directory `dist`. No API keys or backend are required for this prototype.

## Data and privacy

- Data lives in the browser's `localStorage` under `careloop-prototype-v1`.
- The export button downloads the locally stored demo data as JSON.
- Do not enter real medical, identity or other sensitive information.
- No account system, cloud sync, notification delivery, medical integrations or live AI inference is implemented in this prototype.

## Product scope recovered

The available CareLoop resume reference described the project as an **AI Health Companion** built as a web application / PWA, with daily check-ins, adherence reminders, progress logs and an AI educational companion. This prototype implements those product pillars as a local, clickable demonstration. It does not claim to recover the missing original repository or ZIP.
