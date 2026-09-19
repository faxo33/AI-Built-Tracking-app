import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  PieChart,
  BarChart3,
  Lightbulb,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Habit, DayInfo } from '../types';
import { calculateGridStats } from '../utils/habitUtils';

interface AnalyticsTabProps {
  habits: Habit[];
  days: DayInfo[];
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ habits, days }) => {
  const [selectedWeekOffset, setSelectedWeekOffset] = useState(0);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const stats = calculateGridStats(habits);

  const getWeekLabel = () => {
    if (selectedWeekOffset === 0) return 'This Week (Oct 14 - Oct 20)';
    if (selectedWeekOffset === -1) return 'Last Week (Oct 07 - Oct 13)';
    return `Week ${24 + selectedWeekOffset} (Cycle)`;
  };

  // Donut chart colors
  const segmentColors = [
    '#ba1a1a', // Error red
    '#4e45d5', // Indigo
    '#007bb9', // Cyan / Tertiary
    '#6d7a72', // Slate
    '#006948', // Green
  ];

  // Calculate SVG Donut segments for misses
  const donutRadius = 46;
  const donutCircumference = 2 * Math.PI * donutRadius; // ~289.0
  let accumulatedOffset = 0;

  const validMisses = stats.missedBreakdown.filter((m) => m.missed > 0);
  const totalMissesCount = stats.totalMisses;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 pb-24 pt-2">
      {/* View Controls & Date Header */}
      <div className="px-3 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-[#0b1c30] dark:text-white tracking-tight">
              Analytics Overview
            </h1>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#dce9ff] text-[#006948] dark:bg-[#1a2d48] dark:text-emerald-300">
              CALCULATED
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Aggregate performance parameters and variance logs
          </p>
        </div>

        {/* Date Range Picker */}
        <div className="flex items-center bg-white dark:bg-[#131d2e] border border-slate-200 dark:border-slate-800 rounded-lg p-1 shadow-sm self-start sm:self-auto transition-colors">
          <button
            type="button"
            onClick={() => setSelectedWeekOffset((prev) => prev - 1)}
            aria-label="Previous Period"
            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#eff4ff] dark:bg-[#1a273e] rounded shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-[#006948] dark:text-emerald-400" />
            <span className="font-mono text-xs text-[#0b1c30] dark:text-slate-200">
              {getWeekLabel()}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedWeekOffset((prev) => prev + 1)}
            aria-label="Next Period"
            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-3 sm:px-6 flex flex-col gap-4">
        {/* Top KPI Matrix Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* KPI 1: Weekly Score */}
          <div className="bg-white dark:bg-[#131d2e] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Weekly Score
              </span>
              <span className="text-xs font-mono font-semibold text-[#006948] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                +4.2%
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-mono font-bold text-[#0b1c30] dark:text-white tracking-tight">
                {stats.accuracyRate.toFixed(1)}
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">/ 100</span>
            </div>
            <div className="w-full bg-[#eff4ff] dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-[#006948] dark:bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${stats.accuracyRate}%` }}
              />
            </div>
          </div>

          {/* KPI 2: Failure Rate */}
          <div className="bg-white dark:bg-[#131d2e] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Failure Rate
              </span>
              <span className="text-xs font-mono font-semibold text-[#ba1a1a] dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded">
                -2.1%
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-mono font-bold text-[#0b1c30] dark:text-white tracking-tight">
                {stats.failureRate.toFixed(1)}%
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {stats.totalMisses} slips
              </span>
            </div>
            <div className="w-full bg-[#eff4ff] dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-[#ba1a1a] dark:bg-rose-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${stats.failureRate}%` }}
              />
            </div>
          </div>

          {/* KPI 3: Top Performer */}
          <div className="bg-white dark:bg-[#131d2e] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Top Performer
              </span>
              <span className="text-[10px] font-mono text-[#006948] dark:text-emerald-300 font-semibold uppercase bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                Benchmark
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-[#0b1c30] dark:text-white truncate">
                {stats.topPerformer ? stats.topPerformer.name : 'None'}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Consistency</span>
              <span className="text-xs font-mono text-[#006948] dark:text-emerald-400 font-semibold">
                {stats.topPerformer
                  ? `${((stats.topPerformer.checks.filter(Boolean).length / 7) * 100).toFixed(1)}% (${stats.topPerformer.checks.filter(Boolean).length}/7)`
                  : '0%'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Most Missed Tasks (Donut Chart + Ledger) */}
        <div className="bg-white dark:bg-[#131d2e] rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 sm:p-5 flex flex-col gap-4 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#006194] dark:text-sky-400" />
              <h2 className="font-semibold text-sm sm:text-base text-[#0b1c30] dark:text-white">
                Most Missed Tasks
              </h2>
            </div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Deficit Distribution
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Donut Chart Container */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-2">
              <div className="relative w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 120 120"
                  role="img"
                  aria-label="Task Misses Donut Chart"
                >
                  <circle
                    cx="60"
                    cy="60"
                    r={donutRadius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="16"
                    className="text-[#eff4ff] dark:text-slate-800"
                  />
                  {totalMissesCount > 0 ? (
                    validMisses.map((m, idx) => {
                      const fraction = m.missed / totalMissesCount;
                      const strokeDash = fraction * donutCircumference;
                      const offset = accumulatedOffset;
                      accumulatedOffset -= strokeDash;
                      const color = segmentColors[idx % segmentColors.length];

                      return (
                        <circle
                          key={m.habit.id}
                          cx="60"
                          cy="60"
                          r={donutRadius}
                          fill="transparent"
                          stroke={color}
                          strokeWidth="16"
                          strokeDasharray={`${strokeDash} ${donutCircumference - strokeDash}`}
                          strokeDashoffset={offset}
                          className="transition-all duration-300 hover:opacity-85"
                        />
                      );
                    })
                  ) : (
                    <circle
                      cx="60"
                      cy="60"
                      r={donutRadius}
                      fill="transparent"
                      stroke="#006948"
                      strokeWidth="16"
                    />
                  )}
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="font-mono text-xl sm:text-2xl font-bold text-[#0b1c30] dark:text-white">
                    {totalMissesCount}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Misses
                  </span>
                </div>
              </div>
            </div>

            {/* Tabular Breakdown & Legend */}
            <div className="md:col-span-7 flex flex-col gap-1.5">
              {stats.missedBreakdown.map((m, idx) => {
                const isFlawless = m.missed === 0;
                const color = isFlawless ? '#006948' : segmentColors[idx % segmentColors.length];

                return (
                  <div
                    key={m.habit.id}
                    className={`flex items-center justify-between p-2 px-3 rounded-lg border transition-colors ${
                      isFlawless
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300'
                        : 'bg-[#eff4ff]/60 dark:bg-[#162236] border-slate-200/50 dark:border-slate-800 hover:bg-[#eff4ff] dark:hover:bg-[#1a273e]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-xs shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs font-medium truncate text-[#0b1c30] dark:text-slate-100">
                        {m.habit.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
                      <span className="text-slate-500 dark:text-slate-400">
                        {m.missed === 0 ? '0 misses' : `${m.missed} session${m.missed > 1 ? 's' : ''}`}
                      </span>
                      <span
                        className="font-semibold w-16 text-right"
                        style={{ color: isFlawless ? '#006948' : color }}
                      >
                        {isFlawless ? 'FLAWLESS' : `${m.pctOfTotalMisses.toFixed(1)}%`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 2: Weekly Completion Trend Over Time (Bar Chart) */}
        <div className="bg-white dark:bg-[#131d2e] rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 sm:p-5 flex flex-col gap-4 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#006948] dark:text-emerald-400" />
                <h2 className="font-semibold text-sm sm:text-base text-[#0b1c30] dark:text-white">
                  Weekly Completion Trend Over Time
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Daily score progression vs target threshold
              </p>
            </div>

            {/* Target Legend */}
            <div className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-slate-400 dark:bg-slate-500" />
                <span className="uppercase text-[10px]">Target (80 PTS)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#006948] dark:bg-emerald-500" />
                <span className="uppercase text-[10px]">Achieved</span>
              </div>
            </div>
          </div>

          {/* SVG Column Chart */}
          <div className="w-full overflow-x-auto custom-scrollbar">
            <div className="min-w-[420px] h-60 pt-2">
              <svg className="w-full h-full" viewBox="0 0 420 180" preserveAspectRatio="none">
                {/* Horizontal grid lines */}
                <line x1="32" y1="20" x2="410" y2="20" stroke="#e2e8f0" strokeWidth="1" className="dark:stroke-slate-800" />
                <text x="26" y="23" textAnchor="end" fontSize="9" className="font-mono fill-slate-400">100</text>

                {/* 80-point Target Reference Line */}
                <line x1="32" y1="52" x2="410" y2="52" stroke="#006948" strokeWidth="1.5" strokeDasharray="3 3" className="dark:stroke-emerald-400" />
                <text x="26" y="55" textAnchor="end" fontSize="9" fontWeight="600" className="font-mono fill-[#006948] dark:fill-emerald-400">80</text>

                <line x1="32" y1="84" x2="410" y2="84" stroke="#e2e8f0" strokeWidth="1" className="dark:stroke-slate-800" />
                <text x="26" y="87" textAnchor="end" fontSize="9" className="font-mono fill-slate-400">60</text>

                <line x1="32" y1="116" x2="410" y2="116" stroke="#e2e8f0" strokeWidth="1" className="dark:stroke-slate-800" />
                <text x="26" y="119" textAnchor="end" fontSize="9" className="font-mono fill-slate-400">40</text>

                <line x1="32" y1="148" x2="410" y2="148" stroke="#e2e8f0" strokeWidth="1" className="dark:stroke-slate-800" />
                <text x="26" y="151" textAnchor="end" fontSize="9" className="font-mono fill-slate-400">0</text>

                {/* 7 Bars for Mon - Sun */}
                {stats.dayScores.map((ds, idx) => {
                  const day = days[idx];
                  const barX = 52 + idx * 54;
                  const barWidth = 28;
                  // Map percentage 0..100 to height 0..128 (y=148 at 0, y=20 at 100)
                  const barHeight = Math.max(4, (ds.percentage / 100) * 128);
                  const barY = 148 - barHeight;

                  const isHigh = ds.percentage >= 80;
                  const isCurrentDay = day.isToday;

                  let barFill = isHigh ? '#006948' : '#ba1a1a';
                  if (idx === 6) {
                    // Sunday active
                    barFill = '#007bb9';
                  }

                  return (
                    <g key={day.dayName} className="cursor-pointer group">
                      <rect
                        x={barX}
                        y={barY}
                        width={barWidth}
                        height={barHeight}
                        rx="3"
                        fill={barFill}
                        stroke={idx === 6 ? '#006194' : 'none'}
                        strokeDasharray={idx === 6 ? '2 2' : 'none'}
                        strokeWidth={idx === 6 ? '1.5' : '0'}
                        className="transition-opacity hover:opacity-80"
                      />
                      <text
                        x={barX + barWidth / 2}
                        y={barY - 7}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="600"
                        className="font-mono fill-[#0b1c30] dark:fill-slate-100"
                      >
                        {ds.percentage}{idx === 6 ? '*' : ''}
                      </text>
                      <text
                        x={barX + barWidth / 2}
                        y="164"
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="600"
                        className={`font-mono ${isCurrentDay ? 'fill-[#006948] dark:fill-emerald-400' : 'fill-slate-600 dark:fill-slate-400'}`}
                      >
                        {day.dayName.toUpperCase()}
                      </text>
                      <text
                        x={barX + barWidth / 2}
                        y="175"
                        textAnchor="middle"
                        fontSize="8"
                        className={`font-mono ${idx === 6 ? 'fill-[#007bb9] font-bold' : 'fill-slate-400 dark:fill-slate-500'}`}
                      >
                        {idx === 6 ? 'ACTIVE' : `${ds.completed}/${ds.total}`}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Section 3: Optimization Recommendations */}
        <div className="bg-white dark:bg-[#131d2e] rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 sm:p-5 flex flex-col gap-3 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#006948] dark:text-emerald-400" />
              <h3 className="font-semibold text-sm sm:text-base text-[#0b1c30] dark:text-white">
                Optimization Recommendations
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium">
              3 Detected Patterns
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            {/* Card 1 */}
            <div className="bg-[#eff4ff] dark:bg-[#162236] border border-slate-200/60 dark:border-slate-800 p-3 rounded-lg flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#dce9ff] dark:bg-[#1a2d48] text-slate-700 dark:text-slate-300 uppercase font-semibold">
                  Critical Lag
                </span>
                <span className="font-mono text-xs text-[#ba1a1a] dark:text-rose-400 font-semibold">
                  VAR -42.9%
                </span>
              </div>
              <p className="text-xs text-[#0b1c30] dark:text-slate-200 leading-relaxed">
                Hydration intake drops sharply on Wednesday and Saturday. Anchor bottle refills directly to wake-up and lunch routines.
              </p>
              <div className="flex items-center gap-1.5 pt-1 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                <span>Lowest weekday mid-point</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#eff4ff] dark:bg-[#162236] border border-slate-200/60 dark:border-slate-800 p-3 rounded-lg flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#dce9ff] dark:bg-[#1a2d48] text-slate-700 dark:text-slate-300 uppercase font-semibold">
                  Cadence Shift
                </span>
                <span className="font-mono text-xs text-[#4e45d5] dark:text-indigo-400 font-semibold">
                  VAR -28.6%
                </span>
              </div>
              <p className="text-xs text-[#0b1c30] dark:text-slate-200 leading-relaxed">
                Study and deep focus slips correlate directly with late evening sleep deficits. Protect the 22:30 buffer window.
              </p>
              <div className="flex items-center gap-1.5 pt-1 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                <AlertCircle className="w-3.5 h-3.5 text-indigo-500" />
                <span>Inter-habit correlation r=0.74</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#eff4ff] dark:bg-[#162236] border border-slate-200/60 dark:border-slate-800 p-3 rounded-lg flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-[#006948] dark:text-emerald-300 uppercase font-semibold">
                  Benchmark Stride
                </span>
                <span className="font-mono text-xs text-[#006948] dark:text-emerald-400 font-semibold">
                  100.0% RATE
                </span>
              </div>
              <p className="text-xs text-[#0b1c30] dark:text-slate-200 leading-relaxed">
                No Fast Food maintenance remains flawless across all 7 reporting cycles. Habit is qualified for automated consolidation.
              </p>
              <div className="flex items-center gap-1.5 pt-1 text-[#006948] dark:text-emerald-400 font-mono text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ready for locked status</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabular Ledger: Aggregate Frequency Matrix */}
        <div className="bg-white dark:bg-[#131d2e] rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="px-4 py-2.5 bg-[#eff4ff] dark:bg-[#1a273e] flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-300 font-semibold">
              Aggregate Frequency Matrix
            </span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
              Exportable (CSV/TSV)
            </span>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#eff4ff]/60 dark:bg-[#162236] text-slate-600 dark:text-slate-400 font-mono text-[10px] uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800">
                  <th className="py-2 px-3 font-semibold">Habit Entity</th>
                  <th className="py-2 px-3 font-semibold text-center">Target</th>
                  <th className="py-2 px-3 font-semibold text-center">Completed</th>
                  <th className="py-2 px-3 font-semibold text-center">Missed</th>
                  <th className="py-2 px-3 font-semibold text-right">Yield</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {habits.map((h) => {
                  const completed = h.checks.filter(Boolean).length;
                  const missed = 7 - completed;
                  const yieldPct = ((completed / 7) * 100).toFixed(1);
                  const isSelected = selectedRowId === h.id;

                  return (
                    <tr
                      key={h.id}
                      onClick={() => setSelectedRowId(isSelected ? null : h.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#dce9ff] dark:bg-[#1e324d]'
                          : 'hover:bg-[#f8faff] dark:hover:bg-[#162236]'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-sans font-medium text-[#0b1c30] dark:text-slate-100">
                        {h.name}
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-500 dark:text-slate-400">7</td>
                      <td className="py-2.5 px-3 text-center text-[#0b1c30] dark:text-slate-200">{completed}</td>
                      <td
                        className={`py-2.5 px-3 text-center font-semibold ${
                          missed === 0
                            ? 'text-[#006948] dark:text-emerald-400'
                            : 'text-[#ba1a1a] dark:text-rose-400'
                        }`}
                      >
                        {missed}
                      </td>
                      <td
                        className={`py-2.5 px-3 text-right font-semibold ${
                          completed === 7
                            ? 'text-[#006948] dark:text-emerald-400'
                            : 'text-[#0b1c30] dark:text-slate-200'
                        }`}
                      >
                        {yieldPct}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
