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
