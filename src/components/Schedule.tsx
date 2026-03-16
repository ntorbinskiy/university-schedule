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
