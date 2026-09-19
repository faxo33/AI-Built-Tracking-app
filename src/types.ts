export interface Habit {
  id: string;
  name: string;
  categoryKey: string; // e.g. 'GYM', 'DIET', 'FOCUS', 'HYDR', 'SLEEP'
  checks: boolean[]; // 7 days: [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
  curStreak: number;
  bestStreak: number;
  acc30d: number; // 30-day accuracy percentage
  status: 'Stable' | 'Optimal' | 'Regular' | 'Lagging';
}

export type TabType = 'grid' | 'accuracy' | 'analytics';

export interface DayInfo {
  dayName: string;
  dayNumber: number;
  isToday?: boolean;
}
