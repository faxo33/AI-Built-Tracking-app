import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { GridTab } from './components/GridTab';
import { AccuracyTab } from './components/AccuracyTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import { FilterModal, StatusFilter, SortOption } from './components/FilterModal';
import { ProfileModal } from './components/ProfileModal';
import { INITIAL_HABITS, INITIAL_DAYS } from './data/initialData';
import { Habit, TabType } from './types';
import { exportHabitsToCSV } from './utils/habitUtils';

export default function App() {
  // Navigation Tab
  const [activeTab, setActiveTab] = useState<TabType>('grid');

  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('habitgrid_theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class to HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('habitgrid_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('habitgrid_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Habits State
  const [habits, setHabits] = useState<Habit[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('habitgrid_habits');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_HABITS;
  });

  // Persist habits to localStorage
  useEffect(() => {
    localStorage.setItem('habitgrid_habits', JSON.stringify(habits));
  }, [habits]);

  // Filter & Sort State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [sortOption, setSortOption] = useState<SortOption>('DEFAULT');

  // Toggle checkbox for a specific day
  const handleToggleCheck = (habitId: string, dayIndex: number) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== habitId) return habit;
        const newChecks = [...habit.checks];
        const nextState = !newChecks[dayIndex];
        newChecks[dayIndex] = nextState;

        // Calculate updated streak
        let streak = 0;
        for (let i = dayIndex; i >= 0; i--) {
          if (newChecks[i]) streak++;
          else break;
        }

        const completedCount = newChecks.filter(Boolean).length;
        const yieldRatio = completedCount / 7;

        let newStatus: Habit['status'] = habit.status;
        if (yieldRatio >= 0.85) newStatus = 'Optimal';
        else if (yieldRatio >= 0.7) newStatus = 'Stable';
        else if (yieldRatio >= 0.5) newStatus = 'Regular';
        else newStatus = 'Lagging';

        return {
          ...habit,
          checks: newChecks,
          curStreak: nextState ? Math.max(habit.curStreak, streak) : Math.max(0, habit.curStreak - 1),
          status: newStatus,
        };
      })
    );
  };

  // Add new Habit
  const handleAddHabit = (name: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      categoryKey: name.slice(0, 4).toUpperCase().trim() || 'TASK',
      checks: [false, false, false, false, false, false, false],
      curStreak: 0,
      bestStreak: 7,
      acc30d: 70.0,
      status: 'Regular',
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  // Edit Habit name
  const handleEditHabitName = (habitId: string, newName: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === habitId ? { ...h, name: newName } : h))
    );
  };

  // Clear habit week checks
  const handleClearHabitWeek = (habitId: string) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId
          ? {
              ...h,
              checks: [false, false, false, false, false, false, false],
              curStreak: 0,
              status: 'Lagging',
            }
          : h
      )
    );
  };

  // Delete habit
  const handleDeleteHabit = (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  };

  // Reset to initial reference dataset
  const handleResetData = () => {
    setHabits(INITIAL_HABITS);
    localStorage.removeItem('habitgrid_habits');
  };

  // Export current table
  const handleExport = () => {
    exportHabitsToCSV(habits, INITIAL_DAYS);
  };

  // Filtered and sorted habits for Grid and other views
  const displayHabits = useMemo(() => {
    let result = [...habits];

    // Filter
    if (statusFilter === 'OPTIMAL') {
      result = result.filter(
        (h) => h.status === 'Optimal' || h.status === 'Stable'
      );
    } else if (statusFilter === 'LAGGING') {
      result = result.filter((h) => h.status === 'Lagging');
    }

    // Sort
    if (sortOption === 'STREAK_DESC') {
      result.sort((a, b) => b.curStreak - a.curStreak);
    } else if (sortOption === 'COMPLETION_DESC') {
      result.sort((a, b) => {
        const aCount = a.checks.filter(Boolean).length;
        const bCount = b.checks.filter(Boolean).length;
        return bCount - aCount;
      });
    }

    return result;
  }, [habits, statusFilter, sortOption]);

  return (
    <div className="min-h-screen bg-[#f8f9ff] dark:bg-[#0c1421] text-[#0b1c30] dark:text-[#f8f9ff] flex flex-col font-sans transition-colors duration-200">
      {/* Top Fixed Header with Dark Mode Toggle */}
      <Header
        activeTab={activeTab}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenFilter={() => setIsFilterOpen(true)}
        onExport={handleExport}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main App Content */}
      <main className="flex-1 w-full pt-16 flex flex-col">
        <AnimatePresence mode="wait">
          {activeTab === 'grid' && (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="w-full"
            >
              <GridTab
                habits={displayHabits}
                days={INITIAL_DAYS}
                onToggleCheck={handleToggleCheck}
                onAddHabit={handleAddHabit}
                onEditHabitName={handleEditHabitName}
                onClearHabitWeek={handleClearHabitWeek}
                onDeleteHabit={handleDeleteHabit}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            </motion.div>
          )}

          {activeTab === 'accuracy' && (
            <motion.div
              key="accuracy"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="w-full"
            >
              <AccuracyTab
                habits={habits}
                days={INITIAL_DAYS}
                onClose={() => setActiveTab('grid')}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="w-full"
            >
              <AnalyticsTab habits={habits} days={INITIAL_DAYS} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Floating/Fixed Navigation */}
      <BottomNav activeTab={activeTab} onChangeTab={(tab) => setActiveTab(tab)} />

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortOption={sortOption}
        setSortOption={setSortOption}
        onReset={() => {
          setStatusFilter('ALL');
          setSortOption('DEFAULT');
        }}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        habits={habits}
        onResetData={handleResetData}
      />
    </div>
  );
}
