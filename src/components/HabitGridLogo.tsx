import React from 'react';

interface HabitGridLogoProps {
  className?: string;
  size?: number;
}

export const HabitGridLogo: React.FC<HabitGridLogoProps> = ({ className = '', size = 32 }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative shrink-0 rounded-lg bg-[#0d1726] shadow-sm flex items-center justify-center p-1 overflow-hidden border border-slate-700/50 ${className}`}
    >
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Grid lines */}
        {/* Horizontal lines */}
        <line x1="8" y1="14" x2="32" y2="14" stroke="#4a5d78" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="8" y1="20" x2="32" y2="20" stroke="#4a5d78" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="8" y1="26" x2="32" y2="26" stroke="#4a5d78" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Vertical lines */}
        <line x1="15" y1="8" x2="15" y2="32" stroke="#4a5d78" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="25" y1="8" x2="25" y2="32" stroke="#4a5d78" strokeWidth="2.5" strokeLinecap="round" />

        {/* Vibrant green checkmark on bottom right */}
        <path
          d="M19 28.5L24 33.5L34 22"
          stroke="#10b981"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
