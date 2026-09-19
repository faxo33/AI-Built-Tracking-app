import React from 'react';
import { X, Check } from 'lucide-react';

export type StatusFilter = 'ALL' | 'OPTIMAL' | 'LAGGING';
export type SortOption = 'DEFAULT' | 'STREAK_DESC' | 'COMPLETION_DESC';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  statusFilter: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
  sortOption: SortOption;
  setSortOption: (sort: SortOption) => void;
  onReset: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  statusFilter,
  setStatusFilter,
  sortOption,
  setSortOption,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#131d2e] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-sm p-5 shadow-2xl flex flex-col gap-4 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-[#0b1c30] dark:text-white">Data View Filters</h3>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Filter and sort your spreadsheet models</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter by Status */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
            Habit Status Filter
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['ALL', 'OPTIMAL', 'LAGGING'] as StatusFilter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setStatusFilter(f)}
                className={`py-2 px-2.5 rounded-lg font-mono text-[11px] uppercase tracking-wider font-semibold border transition-all ${
                  statusFilter === f
                    ? 'bg-[#006948] dark:bg-emerald-600 text-white border-transparent shadow-xs'
                    : 'bg-[#eff4ff] dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/60 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Order */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
            Sort Order
          </label>
          <div className="flex flex-col gap-1.5">
            {[
              { id: 'DEFAULT', label: 'Default Order (R1..R5)' },
              { id: 'STREAK_DESC', label: 'Longest Streak First' },
              { id: 'COMPLETION_DESC', label: 'Highest Completion % First' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSortOption(opt.id as SortOption)}
                className={`flex items-center justify-between p-2.5 px-3 rounded-lg border text-left transition-colors ${
                  sortOption === opt.id
                    ? 'bg-[#dce9ff] dark:bg-[#1a2d48] border-emerald-500 text-[#006948] dark:text-emerald-300 font-semibold'
                    : 'bg-[#eff4ff]/60 dark:bg-slate-800/60 border-slate-200/50 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{opt.label}</span>
                {sortOption === opt.id && <Check className="w-4 h-4 text-[#006948] dark:text-emerald-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-mono underline underline-offset-4"
          >
            Reset Filters
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#006948] dark:bg-emerald-600 hover:bg-[#005137] text-white rounded-lg font-mono font-semibold transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
