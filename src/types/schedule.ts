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
