import React from 'react';
import { SlidersHorizontal, Download, Sun, Moon, User } from 'lucide-react';
import { HabitGridLogo } from './HabitGridLogo';
import { TabType } from '../types';

interface HeaderProps {
  activeTab: TabType;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenFilter: () => void;
  onExport: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  darkMode,
  onToggleDarkMode,
  onOpenFilter,
  onExport,
  onOpenProfile,
}) => {
  const getSubtitle = () => {
    switch (activeTab) {
      case 'grid':
        return 'Quick Grid';
      case 'accuracy':
        return 'Accuracy Ledger';
      case 'analytics':
        return 'Analytics Overview';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-40 bg-[#f8f9ff]/90 dark:bg-[#0c1421]/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/80 transition-colors">
      <div className="max-w-6xl mx-auto h-16 px-3 sm:px-6 flex items-center justify-between">
        {/* Left Brand Identity */}
        <div className="flex items-center gap-2.5">
          <HabitGridLogo size={34} />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-base sm:text-lg text-[#0b1c30] dark:text-[#f8f9ff] tracking-tight uppercase">
                HabitGrid
              </span>
              <span className="text-[10px] font-semibold font-mono px-1.5 py-0.5 bg-[#dce9ff] text-[#004b73] dark:bg-[#1a2d48] dark:text-[#93ccff] rounded">
                W24
              </span>
            </div>
            <span className="text-[11px] font-semibold text-[#3d4a42] dark:text-slate-400 uppercase tracking-wider -mt-0.5">
              {getSubtitle()}
            </span>
          </div>
        </div>

        {/* Right Actions & Dark Mode Toggler */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Dark Mode Toggle */}
          <button
            id="btn-dark-mode-toggle"
            type="button"
            onClick={onToggleDarkMode}
            aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/70 transition-all active:scale-95"
          >
            {darkMode ? (
              <Sun className="w-[18px] h-[18px] text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-[18px] h-[18px] text-slate-700 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Filter view button */}
          <button
            type="button"
            onClick={onOpenFilter}
            aria-label="Data view filters"
            title="Data View Filters"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/70 transition-colors active:scale-95"
          >
            <SlidersHorizontal className="w-[18px] h-[18px]" />
          </button>

          {/* Export button */}
          <button
            type="button"
            onClick={onExport}
            aria-label="Export table report"
            title="Export CSV Report"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/70 transition-colors active:scale-95"
          >
            <Download className="w-[18px] h-[18px]" />
          </button>

          {/* User profile avatar */}
          <button
            type="button"
            onClick={onOpenProfile}
            aria-label="User profile"
            title="Account & Streaks"
            className="w-8 h-8 rounded-full bg-[#006948] dark:bg-emerald-600 hover:bg-[#005137] dark:hover:bg-emerald-500 text-white flex items-center justify-center ml-1 shadow-sm transition-transform active:scale-95"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
