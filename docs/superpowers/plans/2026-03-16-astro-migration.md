# Astro Migration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate static HTML schedule to Astro + React with JSON data source for multiple subgroups.

**Architecture:** Astro generates static pages from JSON data. React components render schedule UI. Dynamic routes create pages for each subgroup (/1, /2, /3).

**Tech Stack:** Astro 4.x, React 18, TypeScript, GitHub Actions

---

## File Structure

```
university-schedule/
├── src/
│   ├── pages/
│   │   ├── index.astro          # landing page with subgroup selector
│   │   └── [subgroup].astro     # schedule page template
│   ├── components/
│   │   ├── Lesson.tsx           # single lesson card
│   │   ├── Day.tsx              # day block with lessons
│   │   └── Schedule.tsx         # full schedule wrapper
│   ├── styles/
│   │   └── global.css           # migrated styles
│   ├── data/
│   │   └── schedule.json        # all subgroups data
│   └── types/
│       └── schedule.ts          # TypeScript interfaces
├── public/
│   └── (empty, fonts loaded via CDN)
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions deployment
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

---

## Chunk 1: Project Setup

### Task 1: Initialize Astro Project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`

- [ ] **Step 1: Create Astro project in current directory**

```bash
npm create astro@latest . -- --template minimal --install --no-git --typescript strict
```

Select "Empty" template, Yes to TypeScript (strict), Yes to install dependencies.

- [ ] **Step 2: Verify installation**

```bash
npm run dev
```

Expected: Dev server starts at localhost:4321

- [ ] **Step 3: Stop dev server and commit**

```bash
git add .
git commit -m "chore: init astro project"
```

---

### Task 2: Add React Integration

**Files:**
- Modify: `astro.config.mjs`
- Modify: `package.json`

- [ ] **Step 1: Install React integration**

```bash
npx astro add react
```

Answer Yes to all prompts.

- [ ] **Step 2: Verify astro.config.mjs has React**

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  site: 'https://ntorbinskiy.github.io',
  base: '/university-schedule',
});
```

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "chore: add react integration"
```

---

### Task 3: Migrate Global Styles

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Create styles directory**

```bash
mkdir -p src/styles
```

- [ ] **Step 2: Create global.css with migrated styles**

Create `src/styles/global.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --bg: #0a0a0f;
  --card: #12121a;
  --card-hover: #1a1a26;
  --border: #1e1e2e;
  --text: #e4e4ef;
  --text-dim: #6b6b80;
  --accent-mon: #6366f1;
  --accent-tue: #f59e0b;
  --accent-wed: #10b981;
  --accent-thu: #ec4899;
  --accent-fri: #8b5cf6;
  --glow-mon: rgba(99,102,241,0.15);
  --glow-tue: rgba(245,158,11,0.15);
  --glow-wed: rgba(16,185,129,0.15);
  --glow-thu: rgba(236,72,153,0.15);
  --glow-fri: rgba(139,92,246,0.15);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Outfit', sans-serif;
  min-height: 100vh;
  padding: 40px 20px;
  background-image:
    radial-gradient(ellipse at 20% 0%, rgba(99,102,241,0.06) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 100%, rgba(139,92,246,0.06) 0%, transparent 60%);
}

.container { max-width: 900px; margin: 0 auto; }

.header {
  text-align: center;
  margin-bottom: 48px;
  animation: fadeDown 0.6s ease-out;
}

.header h1 {
  font-size: 2.4rem;
  font-weight: 800;
  letter-spacing: -1px;
  background: linear-gradient(135deg, #e4e4ef 0%, #8b8ba0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.header .subtitle {
  font-size: 1rem;
  color: var(--text-dim);
  font-weight: 400;
  letter-spacing: 3px;
  text-transform: uppercase;
}

.day-block {
  margin-bottom: 32px;
  animation: fadeUp 0.5s ease-out both;
}
.day-block:nth-child(1) { animation-delay: 0.1s; }
.day-block:nth-child(2) { animation-delay: 0.2s; }
.day-block:nth-child(3) { animation-delay: 0.3s; }
.day-block:nth-child(4) { animation-delay: 0.4s; }
.day-block:nth-child(5) { animation-delay: 0.5s; }

.day-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
  padding-left: 4px;
}

.day-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.day-name { font-size: 1.3rem; font-weight: 700; letter-spacing: -0.5px; }
.day-meta { font-size: 0.8rem; color: var(--text-dim); font-weight: 400; margin-left: auto; padding-right: 4px; }

.lessons { display: flex; flex-direction: column; gap: 6px; }

.lesson {
  display: grid;
  grid-template-columns: 56px 120px 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
}

.lesson::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  border-radius: 0 3px 3px 0;
  opacity: 0.8;
}

.lesson:hover {
  background: var(--card-hover);
  transform: translateX(4px);
}

a.lesson { cursor: pointer; }

.lesson-empty {
  display: grid;
  grid-template-columns: 56px 120px 1fr;
  align-items: center;
  gap: 16px;
  padding: 10px 20px;
  background: transparent;
  border: 1px dashed rgba(255,255,255,0.06);
  border-radius: 14px;
  opacity: 0.35;
}
.lesson-empty .lesson-subject {
  font-weight: 400;
  font-style: italic;
  color: var(--text-dim);
  font-size: 0.85rem;
}

.lesson-number {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-dim);
  text-align: center;
  padding: 4px 8px;
  border-radius: 8px;
  background: rgba(255,255,255,0.03);
}

.lesson-time {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: var(--text-dim);
  font-weight: 400;
}

.lesson-info { display: flex; flex-direction: column; gap: 4px; }
.lesson-subject { font-size: 1rem; font-weight: 600; letter-spacing: -0.3px; }
.lesson-details {
  font-size: 0.8rem;
  color: var(--text-dim);
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.lesson-type {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.type-lec { background: rgba(99,102,241,0.15); color: #818cf8; }
.type-lab { background: rgba(16,185,129,0.15); color: #34d399; }
.type-prac { background: rgba(245,158,11,0.15); color: #fbbf24; }

.note { font-size: 0.7rem; color: var(--text-dim); font-style: italic; opacity: 0.7; }

/* Day themes */
.mon .lesson::before { background: var(--accent-mon); }
.mon .day-dot { background: var(--accent-mon); box-shadow: 0 0 12px var(--glow-mon); }
.mon .day-name { color: var(--accent-mon); }
.mon .lesson:hover { box-shadow: 0 4px 20px var(--glow-mon); }

.tue .lesson::before { background: var(--accent-tue); }
.tue .day-dot { background: var(--accent-tue); box-shadow: 0 0 12px var(--glow-tue); }
.tue .day-name { color: var(--accent-tue); }
.tue .lesson:hover { box-shadow: 0 4px 20px var(--glow-tue); }

.wed .lesson::before { background: var(--accent-wed); }
.wed .day-dot { background: var(--accent-wed); box-shadow: 0 0 12px var(--glow-wed); }
.wed .day-name { color: var(--accent-wed); }
.wed .lesson:hover { box-shadow: 0 4px 20px var(--glow-wed); }

.thu .lesson::before { background: var(--accent-thu); }
.thu .day-dot { background: var(--accent-thu); box-shadow: 0 0 12px var(--glow-thu); }
.thu .day-name { color: var(--accent-thu); }
.thu .lesson:hover { box-shadow: 0 4px 20px var(--glow-thu); }

.fri .lesson::before { background: var(--accent-fri); }
.fri .day-dot { background: var(--accent-fri); box-shadow: 0 0 12px var(--glow-fri); }
.fri .day-name { color: var(--accent-fri); }
.fri .lesson:hover { box-shadow: 0 4px 20px var(--glow-fri); }

@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 640px) {
  body { padding: 24px 12px; }
  .header { margin-bottom: 32px; }
  .header h1 { font-size: 1.8rem; }
  .lesson {
    grid-template-columns: 44px 80px 1fr auto;
    gap: 10px;
    padding: 14px 14px;
  }
  .lesson-empty {
    grid-template-columns: 44px 80px 1fr;
    gap: 10px;
    padding: 8px 14px;
  }
  .lesson-time { font-size: 0.75rem; }
  .lesson-subject { font-size: 0.9rem; }
  .lesson-number { font-size: 0.7rem; padding: 3px 6px; }
}

/* Landing page styles */
.subgroup-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 32px;
}

.subgroup-card {
  display: block;
  padding: 24px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  text-decoration: none;
  color: var(--text);
  transition: all 0.25s ease;
  text-align: center;
}

.subgroup-card:hover {
  background: var(--card-hover);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(99,102,241,0.15);
}

.subgroup-card h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.subgroup-card p {
  color: var(--text-dim);
  font-size: 0.9rem;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add global styles"
```

---

## Chunk 2: TypeScript Types and Data

### Task 4: Create TypeScript Types

**Files:**
- Create: `src/types/schedule.ts`

- [ ] **Step 1: Create types directory**

```bash
mkdir -p src/types
```

- [ ] **Step 2: Create schedule.ts with interfaces**

Create `src/types/schedule.ts`:

```typescript
export type DayId = 'mon' | 'tue' | 'wed' | 'thu' | 'fri';

export type LessonType = 'lec' | 'lab' | 'prac';

export interface Lesson {
  number: string;
  time: string;
  subject: string | null;
  teacher?: string;
  room?: string;
  type?: LessonType;
  link?: string;
  note?: string;
}

export interface Day {
  id: DayId;
  name: string;
  lessons: Lesson[];
}

export interface SubgroupSchedule {
  name: string;
  days: Day[];
}

export interface Schedule {
  [subgroupId: string]: SubgroupSchedule;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/types/schedule.ts
git commit -m "feat: add schedule types"
```

---

### Task 5: Create Schedule Data JSON

**Files:**
- Create: `src/data/schedule.json`

- [ ] **Step 1: Create data directory**

```bash
mkdir -p src/data
```

- [ ] **Step 2: Create schedule.json with subgroup 2 data**

Create `src/data/schedule.json`:

```json
{
  "2": {
    "name": "2 підгрупа",
    "days": [
      {
        "id": "mon",
        "name": "Понеділок",
        "lessons": [
          { "number": "I", "time": "8:00 – 9:20", "subject": null },
          { "number": "II", "time": "9:30 – 10:50", "subject": null },
          { "number": "III", "time": "11:20 – 12:40", "subject": null },
          { "number": "IV", "time": "12:50 – 14:10", "subject": null },
          { "number": "V", "time": "14:20 – 15:40", "subject": null },
          { "number": "VI", "time": "15:50 – 17:10", "subject": null }
        ]
      },
      {
        "id": "tue",
        "name": "Вівторок",
        "lessons": [
          { "number": "I", "time": "8:00 – 9:20", "subject": "Логічне програмування", "teacher": "Толкачев", "room": "ауд. 74", "type": "lec", "link": "https://us04web.zoom.us/j/72926167552?pwd=j1xK14jN99tEk2WQ7QpC6AVb4itm0f.1" },
          { "number": "II", "time": "9:30 – 10:50", "subject": "Логічне програмування", "teacher": "Толкачев", "room": "ауд. 74", "type": "lab", "link": "https://us04web.zoom.us/j/72926167552?pwd=j1xK14jN99tEk2WQ7QpC6AVb4itm0f.1" },
          { "number": "III", "time": "11:20 – 12:40", "subject": null },
          { "number": "IV", "time": "12:50 – 14:10", "subject": "Теорія ймовірностей", "teacher": "доц. Коваленко", "room": "ауд. 97", "type": "lec", "link": "https://meet.google.com/ebk-ujyr-cnq" },
          { "number": "V", "time": "14:20 – 15:40", "subject": null },
          { "number": "VI", "time": "15:50 – 17:10", "subject": "БЗВП", "room": "Львівська 15", "type": "lec", "note": "з 2-го тижня" },
          { "number": "VII", "time": "17:20 – 18:40", "subject": "БЗВП", "room": "Львівська 15", "type": "lec", "note": "з 2-го тижня" }
        ]
      },
      {
        "id": "wed",
        "name": "Середа",
        "lessons": [
          { "number": "I", "time": "8:00 – 9:20", "subject": "ОБД", "teacher": "Каменєва", "type": "lab", "link": "https://meet.google.com/grp-pyto-hph" },
          { "number": "II", "time": "9:30 – 10:50", "subject": "Комп. схемотехніка", "teacher": "проф. Гунченко", "room": "ауд. 72", "type": "lec", "link": "https://us02web.zoom.us/j/85630970050?pwd=WEtHK0llaWZmTWtmTnhPUlVqRmlGUT09" },
          { "number": "III", "time": "11:20 – 12:40", "subject": "КС", "teacher": "Шугайло", "room": "ауд. 19", "type": "lab", "link": "https://us02web.zoom.us/j/5067616111?pwd=K0t6WEVlV0JWNG5Rb2dVWklSNEZYZz09" },
          { "number": "IV", "time": "12:50 – 14:10", "subject": null },
          { "number": "V", "time": "14:20 – 15:40", "subject": null },
          { "number": "VI", "time": "15:50 – 17:10", "subject": null }
        ]
      },
      {
        "id": "thu",
        "name": "Четвер",
        "lessons": [
          { "number": "I", "time": "8:00 – 9:20", "subject": null },
          { "number": "II", "time": "9:30 – 10:50", "subject": "МОДС", "teacher": "доц. Яровий", "type": "lab", "link": "https://meet.google.com/esc-fsho-qkw" },
          { "number": "III", "time": "11:20 – 12:40", "subject": "Методи оптим. та досл. операцій", "teacher": "доц. Яровий", "room": "ауд. 97", "type": "lec" },
          { "number": "IV", "time": "12:50 – 14:10", "subject": null },
          { "number": "V", "time": "14:20 – 15:40", "subject": null },
          { "number": "VI", "time": "15:50 – 17:10", "subject": null }
        ]
      },
      {
        "id": "fri",
        "name": "П'ятниця",
        "lessons": [
          { "number": "I", "time": "8:00 – 9:20", "subject": "Організація бази даних", "teacher": "доц. Єпік", "type": "lec" },
          { "number": "II", "time": "9:30 – 10:50", "subject": "ОБД", "teacher": "Каменєва", "type": "lab", "link": "https://meet.google.com/grp-pyto-hph" },
          { "number": "III", "time": "11:20 – 12:40", "subject": null },
          { "number": "IV", "time": "12:50 – 14:10", "subject": "Теорія ймовірностей", "teacher": "доц. Коваленко", "room": "ауд. 97", "type": "prac", "link": "https://meet.google.com/ebk-ujyr-cnq" },
          { "number": "V", "time": "14:20 – 15:40", "subject": "БЖ та охорона праці", "teacher": "доц. Устянська", "type": "lec", "link": "https://us05web.zoom.us/j/5161457280?pwd=RnJMeWloTFRhcWNSQzVodit4R2svQT09", "note": "л. (1–7 тиж) / прак. (з 8 тиж)" },
          { "number": "VI", "time": "15:50 – 17:10", "subject": null }
        ]
      }
    ]
  },
  "1": {
    "name": "1 підгрупа",
    "days": []
  },
  "3": {
    "name": "3 підгрупа",
    "days": []
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/data/schedule.json
git commit -m "feat: add schedule data for subgroup 2"
```

---

## Chunk 3: React Components

### Task 6: Create Lesson Component

**Files:**
- Create: `src/components/Lesson.tsx`

- [ ] **Step 1: Create components directory**

```bash
mkdir -p src/components
```

- [ ] **Step 2: Create Lesson.tsx**

Create `src/components/Lesson.tsx`:

```tsx
import type { Lesson as LessonType } from '../types/schedule';

interface LessonProps extends LessonType {}

const TYPE_LABELS: Record<string, string> = {
  lec: 'лекція',
  lab: 'лаб.',
  prac: 'прак.',
};

export function Lesson({ number, time, subject, teacher, room, type, link, note }: LessonProps) {
  if (subject === null) {
    return (
      <div className="lesson-empty">
        <div className="lesson-number">{number}</div>
        <div className="lesson-time">{time}</div>
        <div className="lesson-info">
          <div className="lesson-subject">—</div>
        </div>
      </div>
    );
  }

  const content = (
    <>
      <div className="lesson-number">{number}</div>
      <div className="lesson-time">{time}</div>
      <div className="lesson-info">
        <div className="lesson-subject">{subject}</div>
        <div className="lesson-details">
          {teacher && <span>{teacher}</span>}
          {room && <span>{room}</span>}
          {note && <span className="note">{note}</span>}
        </div>
      </div>
      {type && (
        <div className={`lesson-type type-${type}`}>
          {TYPE_LABELS[type] || type}
        </div>
      )}
    </>
  );

  if (link) {
    return (
      <a className="lesson" href={link} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <div className="lesson">{content}</div>;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Lesson.tsx
git commit -m "feat: add Lesson component"
```

---

### Task 7: Create Day Component

**Files:**
- Create: `src/components/Day.tsx`

- [ ] **Step 1: Create Day.tsx**

Create `src/components/Day.tsx`:

```tsx
import type { Day as DayType } from '../types/schedule';
import { Lesson } from './Lesson';

interface DayProps extends DayType {}

function countLessons(lessons: DayType['lessons']): number {
  return lessons.filter(l => l.subject !== null).length;
}

function formatMeta(lessons: DayType['lessons']): string {
  const count = countLessons(lessons);
  if (count === 0) return '0 пар';

  const filledLessons = lessons.filter(l => l.subject !== null);
  if (filledLessons.length === 0) return '0 пар';

  const firstTime = filledLessons[0].time.split(' – ')[0];
  const lastTime = filledLessons[filledLessons.length - 1].time.split(' – ')[1];

  const word = count === 1 ? 'пара' : count < 5 ? 'пари' : 'пар';
  return `${firstTime} – ${lastTime} · ${count} ${word}`;
}

export function Day({ id, name, lessons }: DayProps) {
  return (
    <div className={`day-block ${id}`}>
      <div className="day-header">
        <div className="day-dot" />
        <div className="day-name">{name}</div>
        <div className="day-meta">{formatMeta(lessons)}</div>
      </div>
      <div className="lessons">
        {lessons.map((lesson, index) => (
          <Lesson key={index} {...lesson} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Day.tsx
git commit -m "feat: add Day component"
```

---

### Task 8: Create Schedule Component

**Files:**
- Create: `src/components/Schedule.tsx`

- [ ] **Step 1: Create Schedule.tsx**

Create `src/components/Schedule.tsx`:

```tsx
import type { SubgroupSchedule } from '../types/schedule';
import { Day } from './Day';

interface ScheduleProps {
  subgroup: SubgroupSchedule;
}

export function Schedule({ subgroup }: ScheduleProps) {
  return (
    <div className="container">
      <div className="header">
        <h1>Розклад занять</h1>
        <div className="subtitle">2 курс · {subgroup.name}</div>
      </div>
      {subgroup.days.map((day) => (
        <Day key={day.id} {...day} />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Schedule.tsx
git commit -m "feat: add Schedule component"
```

---

## Chunk 4: Astro Pages

### Task 9: Create Dynamic Schedule Page

**Files:**
- Create: `src/pages/[subgroup].astro`

- [ ] **Step 1: Create [subgroup].astro**

Create `src/pages/[subgroup].astro`:

```astro
---
import '../styles/global.css';
import { Schedule } from '../components/Schedule';
import scheduleData from '../data/schedule.json';
import type { Schedule as ScheduleType } from '../types/schedule';

export function getStaticPaths() {
  const data = scheduleData as ScheduleType;
  return Object.keys(data).map((key) => ({
    params: { subgroup: key },
    props: { subgroupData: data[key] },
  }));
}

const { subgroupData } = Astro.props;
---

<!doctype html>
<html lang="uk">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Розклад — {subgroupData.name}</title>
  </head>
  <body>
    <Schedule subgroup={subgroupData} client:load />
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/\[subgroup\].astro
git commit -m "feat: add dynamic schedule page"
```

---

### Task 10: Create Landing Page

**Files:**
- Create: `src/pages/index.astro`
- Delete: `index.html` (old static file)

- [ ] **Step 1: Create index.astro**

Create `src/pages/index.astro`:

```astro
---
import '../styles/global.css';
import scheduleData from '../data/schedule.json';
import type { Schedule } from '../types/schedule';

const data = scheduleData as Schedule;
const subgroups = Object.entries(data).map(([id, info]) => ({
  id,
  name: info.name,
  hasData: info.days.length > 0,
}));
---

<!doctype html>
<html lang="uk">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Розклад занять — 2 курс</title>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Розклад занять</h1>
        <div class="subtitle">2 курс</div>
      </div>
      <div class="subgroup-grid">
        {subgroups.map(({ id, name, hasData }) => (
          <a href={`${import.meta.env.BASE_URL}${id}`} class="subgroup-card">
            <h2>{name}</h2>
            <p>{hasData ? 'Переглянути розклад' : 'Розклад скоро буде'}</p>
          </a>
        ))}
      </div>
    </div>
  </body>
</html>
```

- [ ] **Step 2: Delete old index.html**

```bash
rm index.html
```

- [ ] **Step 3: Test locally**

```bash
npm run dev
```

Open http://localhost:4321 — should see landing page with 3 subgroup cards.
Click on "2 підгрупа" — should see schedule.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add landing page, remove old html"
```

---

## Chunk 5: GitHub Actions Deployment

### Task 11: Setup GitHub Actions

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create workflows directory**

```bash
mkdir -p .github/workflows
```

- [ ] **Step 2: Create deploy.yml**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: Update astro.config.mjs for GitHub Pages**

Verify `astro.config.mjs` has correct base path:

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  site: 'https://ntorbinskiy.github.io',
  base: '/university-schedule',
});
```

- [ ] **Step 4: Build locally to verify**

```bash
npm run build
```

Expected: No errors, `dist/` folder created.

- [ ] **Step 5: Commit and push**

```bash
git add .
git commit -m "ci: add github actions deployment"
git push
```

- [ ] **Step 6: Verify deployment**

Go to GitHub repo → Actions tab → Wait for workflow to complete.
Visit https://ntorbinskiy.github.io/university-schedule/

---

## Chunk 6: Final Cleanup

### Task 12: Update Documentation

**Files:**
- Modify: `docs/` (optional cleanup)

- [ ] **Step 1: Verify site works**

Test all pages:
- https://ntorbinskiy.github.io/university-schedule/ (landing)
- https://ntorbinskiy.github.io/university-schedule/2 (subgroup 2)

- [ ] **Step 2: Final commit**

```bash
git add .
git commit -m "docs: migration complete"
git push
```

---

## Summary

After completing all tasks:

1. ✅ Astro + React project initialized
2. ✅ Styles migrated
3. ✅ TypeScript types defined
4. ✅ Schedule data in JSON format
5. ✅ React components: Lesson, Day, Schedule
6. ✅ Dynamic routing for subgroups
7. ✅ Landing page with subgroup selector
8. ✅ GitHub Actions deployment
9. ✅ Live at https://ntorbinskiy.github.io/university-schedule/

To add data for subgroups 1 and 3, edit `src/data/schedule.json` and push.
