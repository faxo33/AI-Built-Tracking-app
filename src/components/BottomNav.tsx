import React from 'react';
import { CalendarDays, CheckSquare, TrendingUp } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-40 bg-[#f8f9ff]/90 dark:bg-[#0c1421]/90 backdrop-blur-xl border-t border-slate-200/60 dark:border-slate-800/80 shadow-[0_-1px_12px_rgba(0,0,0,0.03)] pb-safe transition-colors">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-4">
        {/* Quick Grid Tab */}
        <button
          type="button"
          onClick={() => onChangeTab('grid')}
          aria-current={activeTab === 'grid' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] transition-colors ${
            activeTab === 'grid'
              ? 'text-[#006948] dark:text-emerald-400 font-semibold'
              : 'text-[#3d4a42] dark:text-slate-400 hover:text-[#0b1c30] dark:hover:text-slate-200'
          }`}
        >
          <CalendarDays className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-mono uppercase tracking-wider">Grid</span>
        </button>

        {/* Accuracy Ledger Tab */}
        <button
          type="button"
          onClick={() => onChangeTab('accuracy')}
          aria-current={activeTab === 'accuracy' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] transition-colors ${
            activeTab === 'accuracy'
              ? 'text-[#006948] dark:text-emerald-400 font-semibold'
              : 'text-[#3d4a42] dark:text-slate-400 hover:text-[#0b1c30] dark:hover:text-slate-200'
          }`}
        >
          <CheckSquare className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-mono uppercase tracking-wider">Accuracy</span>
        </button>

        {/* Analytics Tab */}
        <button
          type="button"
          onClick={() => onChangeTab('analytics')}
          aria-current={activeTab === 'analytics' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] transition-colors ${
            activeTab === 'analytics'
              ? 'text-[#006948] dark:text-emerald-400 font-semibold'
              : 'text-[#3d4a42] dark:text-slate-400 hover:text-[#0b1c30] dark:hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-mono uppercase tracking-wider">Analytics</span>
        </button>
      </div>
    </nav>
  );
};
