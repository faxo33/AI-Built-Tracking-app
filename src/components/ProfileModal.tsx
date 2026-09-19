import React from 'react';
import { X, Award, RotateCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Habit } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  habits: Habit[];
  onResetData: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  habits,
  onResetData,
}) => {
  if (!isOpen) return null;

  const totalChecks = habits.reduce(
    (acc, h) => acc + h.checks.filter(Boolean).length,
    0
  );
  const maxStreak = Math.max(...habits.map((h) => h.curStreak), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#131d2e] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-sm p-5 shadow-2xl flex flex-col gap-4 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#006948] dark:bg-emerald-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
              JD
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0b1c30] dark:text-white">John Doe</h3>
              <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">
                HabitGrid Pro • W24 Active
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Milestone Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#eff4ff] dark:bg-[#162236] p-3 rounded-xl border border-slate-200/50 dark:border-slate-800 text-center flex flex-col items-center">
            <Award className="w-5 h-5 text-amber-500 mb-1" />
            <span className="font-mono text-lg font-bold text-[#0b1c30] dark:text-white">{maxStreak}D</span>
            <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase">Best Active Streak</span>
          </div>

          <div className="bg-[#eff4ff] dark:bg-[#162236] p-3 rounded-xl border border-slate-200/50 dark:border-slate-800 text-center flex flex-col items-center">
            <CheckCircle2 className="w-5 h-5 text-[#006948] dark:text-emerald-400 mb-1" />
            <span className="font-mono text-lg font-bold text-[#0b1c30] dark:text-white">{totalChecks}</span>
            <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase">Week Check-Ins</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
            Unlocked Badges
          </span>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 p-2 bg-[#eff4ff]/60 dark:bg-slate-800/50 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-[#006948] dark:text-emerald-400 shrink-0" />
              <div>
                <p className="font-semibold text-xs text-[#0b1c30] dark:text-white">Consistency Benchmark</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Maintained 100% adherence on core habits</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2 bg-[#eff4ff]/60 dark:bg-slate-800/50 rounded-lg">
              <Award className="w-4 h-4 text-indigo-500 shrink-0" />
              <div>
                <p className="font-semibold text-xs text-[#0b1c30] dark:text-white">Spreadsheet Master</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">A1:G5 formula evaluation ledger certified</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reset Data Action */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset habits back to original reference state?')) {
                onResetData();
                onClose();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:underline font-mono"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default Habits</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-mono font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
