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
