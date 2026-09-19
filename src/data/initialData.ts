import { Habit, DayInfo } from '../types';

export const INITIAL_DAYS: DayInfo[] = [
  { dayName: 'Mon', dayNumber: 14 },
  { dayName: 'Tue', dayNumber: 15 },
  { dayName: 'Wed', dayNumber: 16 },
  { dayName: 'Thu', dayNumber: 17 },
  { dayName: 'Fri', dayNumber: 18, isToday: true },
  { dayName: 'Sat', dayNumber: 19 },
  { dayName: 'Sun', dayNumber: 20 },
];

export const INITIAL_HABITS: Habit[] = [
  {
    id: '1',
    name: 'Gym / Workout',
    categoryKey: 'GYM',
    checks: [true, true, true, true, true, true, false],
    curStreak: 12,
    bestStreak: 24,
    acc30d: 86.7,
    status: 'Stable',
  },
  {
    id: '2',
    name: 'No Fast Food',
    categoryKey: 'DIET',
    checks: [true, true, true, true, true, true, true],
    curStreak: 19,
    bestStreak: 30,
    acc30d: 96.7,
    status: 'Optimal',
  },
  {
    id: '3',
    name: 'Study / Focus',
    categoryKey: 'FOCUS',
    checks: [true, true, true, true, true, false, false],
    curStreak: 4,
    bestStreak: 18,
    acc30d: 73.3,
    status: 'Regular',
  },
  {
    id: '4',
    name: 'Drink 2L Water',
    categoryKey: 'HYDR',
    checks: [true, false, true, false, true, true, false],
    curStreak: 2,
    bestStreak: 14,
    acc30d: 60.0,
    status: 'Lagging',
  },
  {
    id: '5',
    name: '8 Hours Sleep',
    categoryKey: 'SLEEP',
    checks: [true, true, true, false, false, true, true],
    curStreak: 8,
    bestStreak: 21,
    acc30d: 76.7,
    status: 'Regular',
  },
];
