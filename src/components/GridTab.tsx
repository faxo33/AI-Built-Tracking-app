import React, { useState, useRef, useEffect } from 'react';
import { Target, BarChart2, Plus, MoreVertical, Edit2, RotateCcw, Trash2, Check } from 'lucide-react';
import { Habit, DayInfo, TabType } from '../types';

interface GridTabProps {
  habits: Habit[];
  days: DayInfo[];
  onToggleCheck: (habitId: string, dayIndex: number) => void;
  onAddHabit: (name: string) => void;
  onEditHabitName: (habitId: string, newName: string) => void;
  onClearHabitWeek: (habitId: string) => void;
  onDeleteHabit: (habitId: string) => void;
  onNavigateTab: (tab: TabType) => void;
}

export const GridTab: React.FC<GridTabProps> = ({
  habits,
  days,
  onToggleCheck,
  onAddHabit,
  onEditHabitName,
  onClearHabitWeek,
  onDeleteHabit,
  onNavigateTab,
}) => {
  const [isAddingRow, setIsAddingRow] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [activeMenuHabitId, setActiveMenuHabitId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState('');
  
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setActiveMenuHabitId(null);
      }
    }
    if (activeMenuHabitId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenuHabitId]);

  // Focus add input when opened
  useEffect(() => {
    if (isAddingRow && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingRow]);

  // Metrics calculations
  const totalCells = habits.length * 7;
  let checkedCells = 0;
  habits.forEach((h) => {
    checkedCells += h.checks.filter(Boolean).length;
  });

  const completionPct = totalCells > 0 ? (checkedCells / totalCells) * 100 : 0;
  const scoreFormatted = completionPct.toFixed(1);
  const ptsPerHabit = habits.length > 0 ? (100 / habits.length).toFixed(2) : '20.00';

  const handleOpenMenu = (habitId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const popoverWidth = 144;
    const left = Math.min(rect.left - 90, window.innerWidth - popoverWidth - 16);
    setMenuPosition({
      top: rect.bottom + window.scrollY + 4,
      left: Math.max(12, left),
    });
    setActiveMenuHabitId(habitId);
  };

  const handleSaveNewHabit = () => {
    if (!newTaskName.trim()) return;
    onAddHabit(newTaskName.trim());
    setNewTaskName('');
    setIsAddingRow(false);
  };

  const handleStartEdit = (habit: Habit) => {
    setEditingHabitId(habit.id);
    setEditNameValue(habit.name);
    setActiveMenuHabitId(null);
  };

  const handleSaveEdit = () => {
    if (editingHabitId && editNameValue.trim()) {
      onEditHabitName(editingHabitId, editNameValue.trim());
    }
    setEditingHabitId(null);
    setEditNameValue('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 pb-24 pt-2">
      {/* Top KPI & Operational Cadence Panel */}
      <section className="flex flex-col gap-3 px-3 sm:px-6">
        {/* Score Matrix Card */}
        <div className="bg-white dark:bg-[#131d2e] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col gap-3 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Formula Ledger
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#dce9ff] text-[#004b73] dark:bg-[#1a2d48] dark:text-[#93ccff] rounded">
                RANGE: A1:G{habits.length}
              </span>
            </div>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide ${
                completionPct >= 75
                  ? 'bg-[#85f8c4] text-[#002114] dark:bg-emerald-950 dark:text-emerald-300'
                  : completionPct >= 50
                  ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300'
              }`}
            >
              {completionPct >= 75 ? 'Optimal Pace' : completionPct >= 50 ? 'Steady Pace' : 'Needs Focus'}
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-[#0b1c30] dark:text-white">
                {scoreFormatted}
              </span>
              <span className="text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400">
                / 100 PTS
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-mono font-semibold text-[#006948] dark:text-emerald-400">
                {checkedCells} of {totalCells}
              </span>
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Check-ins Complete
              </p>
            </div>
          </div>

          {/* Linear Micro Track */}
          <div className="w-full bg-[#e5eeff] dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#006948] dark:bg-emerald-500 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, completionPct))}%` }}
            />
          </div>
        </div>

        {/* Quick Navigation Operations */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => onNavigateTab('accuracy')}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white dark:bg-[#131d2e] hover:bg-[#eff4ff] dark:hover:bg-[#1a273e] text-[#0b1c30] dark:text-slate-200 border border-slate-200/70 dark:border-slate-800 rounded-lg shadow-sm transition-all active:scale-[0.99] text-left"
          >
            <Target className="w-4 h-4 text-[#006948] dark:text-emerald-400 shrink-0" />
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
              Accuracy Ledger
            </span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('analytics')}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white dark:bg-[#131d2e] hover:bg-[#eff4ff] dark:hover:bg-[#1a273e] text-[#0b1c30] dark:text-slate-200 border border-slate-200/70 dark:border-slate-800 rounded-lg shadow-sm transition-all active:scale-[0.99] text-left"
          >
            <BarChart2 className="w-4 h-4 text-[#4e45d5] dark:text-indigo-400 shrink-0" />
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
              Analytics View
            </span>
          </button>
        </div>

        {/* Active Formula Evaluator Bar */}
        <div className="flex items-center gap-2 bg-white dark:bg-[#131d2e] border border-slate-200/70 dark:border-slate-800 px-3 py-2 rounded-lg shadow-sm text-slate-600 dark:text-slate-300 overflow-hidden transition-colors">
          <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 px-1.5 py-0.5 bg-[#eff4ff] dark:bg-slate-800 rounded shrink-0">
            fx
          </span>
          <div className="text-[11px] font-mono text-[#0b1c30] dark:text-slate-200 truncate tracking-tight select-all">
            =SUM(A1:G{habits.length})/MAX_CELLS*100
          </div>
          <span className="ml-auto text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0">
            {ptsPerHabit} pts/ea
          </span>
        </div>
      </section>

      {/* Spreadsheet Pinned Grid Architecture */}
      <section className="px-3 sm:px-6 w-full">
        <div className="bg-white dark:bg-[#131d2e] rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-colors">
          {/* Scrollable Container with sticky leftmost column */}
          <div className="overflow-x-auto w-full relative custom-scrollbar">
            <table className="w-full border-collapse text-left min-w-[590px]">
              <thead>
                <tr className="bg-[#eff4ff] dark:bg-[#1a273e] h-9 text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800">
                  {/* Sticky Habit Header */}
                  <th
                    scope="col"
                    className="sticky left-0 z-20 bg-[#eff4ff] dark:bg-[#1a273e] px-3 w-48 min-w-[192px] shadow-[1px_0_0_rgba(15,23,42,0.08)] dark:shadow-[1px_0_0_rgba(255,255,255,0.06)]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px]">Habits / Tasks</span>
                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-400">
                        R1:R{habits.length}
                      </span>
                    </div>
                  </th>

                  {/* 7 Days Columns */}
                  {days.map((d) => (
                    <th
                      key={d.dayName}
                      scope="col"
                      className={`w-12 text-center font-mono text-[11px] px-1 ${
                        d.isToday
                          ? 'bg-[#dce9ff] dark:bg-[#203554] text-[#006948] dark:text-emerald-300 font-bold'
                          : ''
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center py-1">
                        <span>{d.dayName}</span>
                        <span className="text-[10px] font-normal opacity-80">{d.dayNumber}</span>
                      </div>
                    </th>
                  ))}

                  {/* Summary Header */}
                  <th scope="col" className="w-24 text-right pr-4 font-mono text-[11px]">
                    Progress
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                {habits.map((habit) => {
                  const completed = habit.checks.filter(Boolean).length;
                  const rowPct = Math.round((completed / 7) * 100);

                  return (
                    <tr
                      key={habit.id}
                      className="h-10 hover:bg-[#f8faff] dark:hover:bg-[#162236] transition-colors group"
                    >
                      {/* Sticky Habit Name & Menu Button */}
                      <td className="sticky left-0 z-10 bg-white group-hover:bg-[#f8faff] dark:bg-[#131d2e] dark:group-hover:bg-[#162236] px-3 w-48 min-w-[192px] shadow-[1px_0_0_rgba(15,23,42,0.08)] dark:shadow-[1px_0_0_rgba(255,255,255,0.06)] transition-colors">
                        <div className="flex items-center justify-between gap-1">
                          {editingHabitId === habit.id ? (
                            <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="text"
                                value={editNameValue}
                                onChange={(e) => setEditNameValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveEdit();
                                  if (e.key === 'Escape') setEditingHabitId(null);
                                }}
                                className="w-full text-xs px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-emerald-500 rounded outline-none text-[#0b1c30] dark:text-white"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={handleSaveEdit}
                                className="p-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <span
                                className="font-medium text-xs sm:text-sm text-[#0b1c30] dark:text-slate-100 truncate cursor-pointer hover:text-[#006948] dark:hover:text-emerald-400"
                                onClick={() => handleStartEdit(habit)}
                                title="Click to edit name"
                              >
                                {habit.name}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => handleOpenMenu(habit.id, e)}
                                aria-label="Row Actions"
                                className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded transition-colors"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>

                      {/* 7 Checkbox Cells */}
                      {habit.checks.map((isChecked, dayIdx) => (
                        <td
                          key={dayIdx}
                          className={`w-12 text-center p-0 ${
                            days[dayIdx].isToday ? 'bg-[#eff4ff]/40 dark:bg-[#1a2d48]/30' : ''
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => onToggleCheck(habit.id, dayIdx)}
                            aria-label={`Toggle ${habit.name} on ${days[dayIdx].dayName}`}
                            className="w-full h-10 flex items-center justify-center hover:bg-slate-100/60 dark:hover:bg-slate-800/50 transition-colors focus:outline-none"
                          >
                            {isChecked ? (
                              <span className="w-[19px] h-[19px] rounded-[3px] bg-[#006948] dark:bg-emerald-500 flex items-center justify-center text-white shadow-sm transition-transform active:scale-90">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </span>
                            ) : (
                              <span className="w-[19px] h-[19px] rounded-[3px] bg-[#dce9ff] dark:bg-slate-700 hover:bg-[#c9deff] dark:hover:bg-slate-600 flex items-center justify-center transition-colors" />
                            )}
                          </button>
                        </td>
                      ))}

                      {/* Progress Column */}
                      <td className="w-24 pr-4 text-right align-middle">
                        <div className="flex flex-col items-end gap-1">
                          <span className="font-mono text-[11px] font-semibold text-[#0b1c30] dark:text-slate-200">
                            {rowPct}%
                          </span>
                          <div className="w-16 bg-[#eff4ff] dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[#006948] dark:bg-emerald-500 h-full rounded-full transition-all duration-300"
                              style={{ width: `${rowPct}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Action Drawer: Add Habit Flow */}
          <div className="p-3 bg-[#eff4ff]/60 dark:bg-[#162236] border-t border-slate-200/80 dark:border-slate-800 flex flex-col gap-2 transition-colors">
            {!isAddingRow ? (
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsAddingRow(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#006948] dark:text-emerald-400 hover:bg-[#dce9ff] dark:hover:bg-emerald-950/40 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="font-mono uppercase tracking-wider">Add Row</span>
                </button>
                <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase">
                  MODELS: {habits.length} ACTIVE
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-2 bg-white dark:bg-[#131d2e] p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm animate-in fade-in duration-150">
                <label className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  New Task Identifier
                </label>
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveNewHabit();
                      if (e.key === 'Escape') setIsAddingRow(false);
                    }}
                    placeholder="e.g. Read 20 Pages"
                    className="flex-1 h-9 px-3 text-xs bg-[#eff4ff] dark:bg-slate-800 text-[#0b1c30] dark:text-white rounded-lg outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleSaveNewHabit}
                    className="h-9 px-3.5 bg-[#006948] dark:bg-emerald-600 hover:bg-[#005137] text-white text-xs font-semibold rounded-lg transition-colors active:scale-95"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingRow(false);
                      setNewTaskName('');
                    }}
                    className="h-9 px-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Spreadsheet Context Menu Popover */}
      {activeMenuHabitId && (
        <div
          ref={popoverRef}
          style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
          className="fixed z-50 bg-white dark:bg-[#162236] border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl p-1.5 w-40 flex flex-col text-xs text-[#0b1c30] dark:text-slate-200 animate-in fade-in zoom-in-95 duration-100"
        >
          <button
            type="button"
            onClick={() => {
              const h = habits.find((item) => item.id === activeMenuHabitId);
              if (h) handleStartEdit(h);
            }}
            className="flex items-center gap-2 px-2.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/70 rounded-lg text-left transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Edit Name</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onClearHabitWeek(activeMenuHabitId);
              setActiveMenuHabitId(null);
            }}
            className="flex items-center gap-2 px-2.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/70 rounded-lg text-left transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Clear Week</span>
          </button>
          <div className="h-px bg-slate-200 dark:bg-slate-700 my-1" />
          <button
            type="button"
            onClick={() => {
              onDeleteHabit(activeMenuHabitId);
              setActiveMenuHabitId(null);
            }}
            className="flex items-center gap-2 px-2.5 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-lg text-left transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Row</span>
          </button>
        </div>
      )}

      {/* Spreadsheet Formula & Performance Strip */}
      <footer className="px-3 sm:px-6 mt-1 flex flex-col">
        <div className="bg-white dark:bg-[#131d2e] border border-slate-200/70 dark:border-slate-800 p-2.5 px-3 rounded-lg flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 shadow-sm transition-colors">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#006948] dark:bg-emerald-400 animate-pulse" />
            <span className="font-mono uppercase tracking-wider font-medium text-[#0b1c30] dark:text-slate-300">
              Sync State: Cached
            </span>
          </div>
          <span className="font-mono text-slate-400 dark:text-slate-400">LATENCY: 12ms</span>
        </div>
      </footer>
    </div>
  );
};
