import React, { useState } from 'react';
import { CheckCircle, TrendingUp, X, Download, RefreshCw, Check } from 'lucide-react';
import { Habit, DayInfo, TabType } from '../types';
import { calculateGridStats, exportHabitsToCSV } from '../utils/habitUtils';

interface AccuracyTabProps {
  habits: Habit[];
  days: DayInfo[];
  onClose: () => void;
  onNavigateTab: (tab: TabType) => void;
}

export const AccuracyTab: React.FC<AccuracyTabProps> = ({
  habits,
  days,
  onClose,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [recalcSuccess, setRecalcSuccess] = useState(false);

  const stats = calculateGridStats(habits);
  const ptsPerHabitNum = habits.length > 0 ? 100 / habits.length : 20;

  // SVG Circular progress math
  const radius = 30;
  const circumference = 2 * Math.PI * radius; // ~188.5
  const strokeDashoffset = circumference - (stats.accuracyRate / 100) * circumference;

  const handleExport = () => {
    setIsExporting(true);
    exportHabitsToCSV(habits, days);
    setTimeout(() => {
      setIsExporting(false);
    }, 1200);
  };

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
      setRecalcSuccess(true);
      setTimeout(() => {
        setRecalcSuccess(false);
      }, 2000);
    }, 600);
  };

  const getStatusBadge = (status: Habit['status']) => {
    switch (status) {
      case 'Optimal':
      case 'Stable':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold">
            {status}
          </span>
        );
      case 'Regular':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold">
            {status}
          </span>
        );
      case 'Lagging':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 font-semibold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 pb-24 pt-2">
      {/* Subheader banner */}
      <div className="mx-3 sm:mx-6 px-4 py-3 bg-[#eff4ff] dark:bg-[#162236] border border-slate-200/80 dark:border-slate-800 rounded-xl flex items-center justify-between shadow-sm transition-colors">
        <div className="flex flex-col min-w-0 pr-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#006948] dark:text-emerald-400 shrink-0" />
            <span className="font-semibold text-base sm:text-lg text-[#0b1c30] dark:text-white tracking-tight truncate">
              Accuracy Ledger
            </span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-[#006948]/10 dark:bg-emerald-500/20 text-[#006948] dark:text-emerald-400 rounded uppercase">
              AUDIT W24
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
            Comprehensive audit of habitual compliance and streak consistency
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close to Grid"
          className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-3 sm:px-6 flex flex-col gap-4">
        {/* Primary Index Metric Card */}
        <div className="bg-white dark:bg-[#131d2e] rounded-xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col transition-colors">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Primary Index Metric
            </span>
            <div className="flex items-center gap-1 text-[#006948] dark:text-emerald-400 font-mono text-xs font-semibold">
              <TrendingUp className="w-4 h-4" />
              <span>+4.2% VS W23</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-mono font-bold text-[#0b1c30] dark:text-white tracking-tight">
                  {stats.accuracyRate.toFixed(1)}%
                </span>
                <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Accuracy Rate
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                {stats.totalCompleted} completed out of {stats.totalOpportunities} total opportunities across 7 calendar days.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <div className="h-1.5 w-24 bg-[#eff4ff] dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#006948] dark:bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${stats.accuracyRate}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {stats.totalCompleted} / {stats.totalOpportunities} CHK
                </span>
              </div>
            </div>

            {/* Circular Gauge */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
                <circle
                  cx="36"
                  cy="36"
                  r={radius}
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-slate-100 dark:text-slate-800"
                />
                <circle
                  cx="36"
                  cy="36"
                  r={radius}
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="text-[#006948] dark:text-emerald-500 transition-all duration-500"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="font-mono text-xs sm:text-sm font-bold text-[#0b1c30] dark:text-white">
                  {stats.accuracyRate.toFixed(1)}
                </span>
                <span className="font-mono text-[9px] uppercase text-slate-400 -mt-0.5">
                  SCORE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 100-Point Formula Logic Card */}
        <div className="bg-white dark:bg-[#131d2e] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between pb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
              100-Point Formula Logic
            </span>
            <span className="font-mono text-xs text-[#006194] dark:text-sky-400 font-semibold">
              {habits.length} × {ptsPerHabitNum.toFixed(2)} PTS
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Equally balanced weight model across active tracked habits. Daily yield averages {stats.accuracyRate.toFixed(1)} / 100 max.
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3 pt-1">
            {habits.map((h) => {
              const completed = h.checks.filter(Boolean).length;
              const pct = (completed / 7) * 100;
              const pointsEarned = ((completed / 7) * ptsPerHabitNum).toFixed(2);
              return (
                <div
                  key={h.id}
                  className="bg-[#eff4ff] dark:bg-[#162236] p-2 rounded-lg flex flex-col items-center text-center border border-slate-200/50 dark:border-slate-800 transition-colors"
                >
                  <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                    {h.categoryKey}
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-[#0b1c30] dark:text-slate-100 mt-0.5">
                    {pointsEarned}
                  </span>
                  <span className="font-mono text-[9px] text-[#006948] dark:text-emerald-400 font-semibold">
                    {pct.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Habit Breakdown & Streak Records */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Habit Breakdown &amp; Streak Records
            </span>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase">
              7-DAY CYCLE
            </span>
          </div>

          <div className="bg-white dark:bg-[#131d2e] rounded-xl p-3 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col gap-2 transition-colors">
            {habits.map((h) => {
              const completed = h.checks.filter(Boolean).length;
              const pct = ((completed / 7) * 100).toFixed(1);

              return (
                <div
                  key={h.id}
                  className="flex items-center justify-between p-2.5 bg-[#eff4ff] dark:bg-[#162236] rounded-lg border border-slate-200/50 dark:border-slate-800 transition-colors"
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="font-semibold text-xs sm:text-sm text-[#0b1c30] dark:text-slate-100 truncate">
                      {h.name}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs">
                      <span className="font-mono text-[11px] font-semibold text-[#006948] dark:text-emerald-400">
                        STRK {h.curStreak}D
                      </span>
                      <span className="text-slate-400 text-[10px]">•</span>
                      <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        {completed} of 7 days
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <span className="font-mono text-xs font-bold text-[#0b1c30] dark:text-slate-200">
                      {pct}%
                    </span>
                    <div className="w-16 h-1.5 bg-[#dce9ff] dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-[#006948] dark:bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Accuracy Distribution Table (30D Window) */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Accuracy Distribution Table
            </span>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase">
              30D WINDOW
            </span>
          </div>

          <div className="bg-white dark:bg-[#131d2e] rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#eff4ff] dark:bg-[#1a273e] text-slate-600 dark:text-slate-300 font-mono text-[10px] uppercase tracking-wider h-8 border-b border-slate-200/80 dark:border-slate-800">
                    <th className="px-3 py-1 font-semibold whitespace-nowrap">Habit</th>
                    <th className="px-3 py-1 font-semibold text-center whitespace-nowrap">Cur</th>
                    <th className="px-3 py-1 font-semibold text-center whitespace-nowrap">Best</th>
                    <th className="px-3 py-1 font-semibold text-right whitespace-nowrap">30D Acc</th>
                    <th className="px-3 py-1 font-semibold text-center whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-slate-700 dark:text-slate-200">
                  {habits.map((h) => (
                    <tr
                      key={h.id}
                      className="hover:bg-[#f8faff] dark:hover:bg-[#162236] transition-colors h-9"
                    >
                      <td className="px-3 py-1 font-sans font-medium text-[#0b1c30] dark:text-slate-200 truncate max-w-[140px]">
                        {h.name}
                      </td>
                      <td className="px-3 py-1 text-center font-bold text-[#006948] dark:text-emerald-400">
                        {h.curStreak}
                      </td>
                      <td className="px-3 py-1 text-center text-slate-500 dark:text-slate-400">
                        {h.bestStreak}
                      </td>
                      <td className="px-3 py-1 text-right font-semibold">
                        {h.acc30d.toFixed(1)}%
                      </td>
                      <td className="px-3 py-1 text-center">
                        {getStatusBadge(h.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Action Buttons: Export CSV & Recalculate Weight */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="h-10 px-4 rounded-xl bg-white dark:bg-[#131d2e] hover:bg-[#eff4ff] dark:hover:bg-[#1a273e] text-[#0b1c30] dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99]"
          >
            {isExporting ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Exported CSV</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                <span>Export CSV</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleRecalculate}
            disabled={isRecalculating}
            className="h-10 px-4 rounded-xl bg-[#006948] dark:bg-emerald-600 hover:bg-[#005137] text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99]"
          >
            {isRecalculating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Syncing...</span>
              </>
            ) : recalcSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Updated (100.0)</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Recalculate Weight</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
