'use client';

import React from 'react';

export interface ProgressBarProps {
  progress?: number; // 0 to 100
  value?: number;
  max?: number;
  color?: 'cyan' | 'purple' | 'emerald' | 'amber';
  height?: 'sm' | 'md' | 'lg';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  progress,
  value,
  max = 100,
  color = 'cyan',
  height,
  size = 'md',
  showLabel = false,
  className = ''
}: ProgressBarProps) {
  let resolvedProgress = 0;
  if (typeof progress === 'number') {
    resolvedProgress = progress;
  } else if (typeof value === 'number') {
    resolvedProgress = Math.round((value / (max || 1)) * 100);
  }

  const clamped = Math.max(0, Math.min(100, resolvedProgress));
  const resolvedHeight = height || size || 'md';

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5'
  };

  const gradientStyles = {
    cyan: 'from-cyan-500 via-blue-500 to-indigo-500',
    purple: 'from-purple-500 via-pink-500 to-rose-500',
    emerald: 'from-emerald-500 via-teal-500 to-cyan-500',
    amber: 'from-amber-500 via-orange-500 to-rose-500'
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
          <span>Progress</span>
          <span className="font-mono font-medium text-slate-200">{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50 ${heightStyles[resolvedHeight]}`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradientStyles[color]} transition-all duration-500 ease-out shadow-sm`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
