import { Habit, DayInfo } from '../types';

export function calculateGridStats(habits: Habit[]) {
  const totalOpportunities = habits.length * 7;
  let totalCompleted = 0;

  habits.forEach((habit) => {
    totalCompleted += habit.checks.filter(Boolean).length;
  });

  const accuracyRate = totalOpportunities > 0 ? (totalCompleted / totalOpportunities) * 100 : 0;
  const failureRate = totalOpportunities > 0 ? 100 - accuracyRate : 0;
  const totalMisses = totalOpportunities - totalCompleted;

  // Day of week stats (0 = Mon, 6 = Sun)
  const dayScores = [0, 1, 2, 3, 4, 5, 6].map((dayIdx) => {
    let completedOnDay = 0;
    habits.forEach((h) => {
      if (h.checks[dayIdx]) completedOnDay++;
    });
    const pct = habits.length > 0 ? Math.round((completedOnDay / habits.length) * 100) : 0;
    return {
      dayIdx,
      completed: completedOnDay,
      total: habits.length,
      percentage: pct,
    };
  });

  // Top performer (highest completed this week)
  let topPerformer = habits[0];
  let maxCompleted = -1;
  habits.forEach((h) => {
    const count = h.checks.filter(Boolean).length;
    if (count > maxCompleted) {
      maxCompleted = count;
      topPerformer = h;
    }
  });

  // Missed breakdown per habit
  const missedBreakdown = habits.map((h) => {
    const completed = h.checks.filter(Boolean).length;
    const missed = 7 - completed;
    const pctOfTotalMisses = totalMisses > 0 ? Math.round((missed / totalMisses) * 1000) / 10 : 0;
    return {
      habit: h,
      missed,
      pctOfTotalMisses,
    };
  }).sort((a, b) => b.missed - a.missed);

  return {
    totalOpportunities,
    totalCompleted,
    accuracyRate,
    failureRate,
    totalMisses,
    dayScores,
    topPerformer,
    missedBreakdown,
  };
}

export function exportHabitsToCSV(habits: Habit[], days: DayInfo[]) {
  const headers = ['Habit Name', 'Category', ...days.map(d => `${d.dayName} ${d.dayNumber}`), 'Completed', 'Target', 'Yield %', 'Current Streak', 'Best Streak', '30D Acc %', 'Status'];
  
  const rows = habits.map(h => {
    const completed = h.checks.filter(Boolean).length;
    const yieldPct = ((completed / 7) * 100).toFixed(1);
    const dayCols = h.checks.map(c => c ? '1' : '0');
    return [
      `"${h.name.replace(/"/g, '""')}"`,
      h.categoryKey,
      ...dayCols,
      completed,
      7,
      `${yieldPct}%`,
      h.curStreak,
      h.bestStreak,
      `${h.acc30d}%`,
      h.status
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `HabitGrid_Report_W24_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
