# University Schedule — Astro Migration Design

## Overview

Migrate static HTML schedule to Astro + React for better maintainability and scalability across multiple subgroups.

## Goals

- Single template generates pages for all subgroups
- Schedule data stored in JSON (easy to edit)
- Preserve current visual design
- Easy to add new subgroups
- Deploy to GitHub Pages

## Tech Stack

- **Astro** — static site generator
- **React** — UI components
- **TypeScript** — type safety
- **GitHub Actions** — CI/CD

## Project Structure

```
university-schedule/
├── src/
│   ├── pages/
│   │   ├── index.astro          # landing (subgroup selector)
│   │   └── [subgroup].astro     # schedule page (generates /1, /2, /3)
│   ├── components/
│   │   ├── Schedule.tsx         # full schedule component
│   │   ├── Day.tsx              # day block
│   │   └── Lesson.tsx           # lesson card
│   ├── styles/
│   │   └── global.css           # current styles (migrated)
│   └── data/
│       └── schedule.json        # all subgroups data
├── public/
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

## Data Schema

```typescript
interface Schedule {
  [subgroupId: string]: {
    name: string
    days: Day[]
  }
}

interface Day {
  id: 'mon' | 'tue' | 'wed' | 'thu' | 'fri'
  name: string
  lessons: Lesson[]
}

interface Lesson {
  number: string        // "I", "II", etc.
  time: string          // "8:00 – 9:20"
  subject: string | null // null = empty slot
  teacher?: string
  room?: string
  type?: 'lec' | 'lab' | 'prac'
  link?: string         // Zoom/Meet URL
  note?: string         // e.g. "з 2-го тижня"
}
```

## Components

### Lesson.tsx

Props: `number`, `time`, `subject`, `teacher?`, `room?`, `type?`, `link?`, `note?`

- If `subject === null` → render empty slot (dashed border, dimmed)
- If `link` exists → wrap in `<a target="_blank">`
- Type badge: lec (purple), lab (green), prac (orange)

### Day.tsx

Props: `id`, `name`, `lessons[]`

- Calculate lesson count for meta
- Apply theme color based on `id`
- Render list of Lesson components

### Schedule.tsx

Props: `subgroup` (name), `days[]`

- Header with title and subgroup name
- List of Day components

## Routing

**`[subgroup].astro`**:
```typescript
export async function getStaticPaths() {
  const schedule = await import('../data/schedule.json')
  return Object.keys(schedule.default).map(key => ({
    params: { subgroup: key },
    props: { data: schedule.default[key] }
  }))
}
```

Generates: `/1`, `/2`, `/3`

**`index.astro`**:
- Title "Розклад занять"
- 3 cards linking to subgroups
- Same dark theme

## Deployment

GitHub Actions workflow on push to `main`:

1. Checkout
2. Setup Node.js
3. Install dependencies
4. Build (`npm run build`)
5. Deploy `dist/` to GitHub Pages

Base URL: `https://ntorbinskiy.github.io/university-schedule/`

## Migration Steps

1. Init Astro project in repo
2. Add React integration
3. Migrate styles to global.css
4. Create schedule.json with current data (subgroup 2)
5. Build Lesson, Day, Schedule components
6. Create [subgroup].astro and index.astro
7. Setup GitHub Actions
8. Test and deploy
9. Add data for subgroups 1 and 3

## Future Enhancements

- Form UI for editing schedule (Phase 2)
- Backend storage (Firebase/Supabase)
- Week selector (odd/even weeks)
- PWA support
