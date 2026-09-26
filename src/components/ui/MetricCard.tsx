'use client';

import React from 'react';
import { HelpCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  tooltip?: string;
  icon?: React.ReactNode;
  accent?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose';
  className?: string;
}

export function MetricCard({
  label,
  value,
  subValue,
  trend,
  trendValue,
  tooltip,
  icon,
  accent = 'cyan',
  className = ''
}: MetricCardProps) {
  const accentGlow = {
    cyan: 'border-cyan-500/20 hover:border-cyan-500/40 shadow-cyan-500/5',
    purple: 'border-purple-500/20 hover:border-purple-500/40 shadow-purple-500/5',
    emerald: 'border-emerald-500/20 hover:border-emerald-500/40 shadow-emerald-500/5',
    amber: 'border-amber-500/20 hover:border-amber-500/40 shadow-amber-500/5',
    rose: 'border-rose-500/20 hover:border-rose-500/40 shadow-rose-500/5'
  };

  const accentText = {
    cyan: 'text-cyan-400',
    purple: 'text-purple-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400'
  };

  return (
    <div
      className={`group relative rounded-2xl bg-slate-900/60 backdrop-blur-xl border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${accentGlow[accent]} ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-mono tracking-wider text-slate-400 font-medium">
            {label}
          </span>
          {tooltip && (
            <div className="relative group/tip cursor-help">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300 transition-colors" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/tip:block w-48 p-2 bg-slate-800 border border-slate-700 rounded-lg text-[11px] text-slate-300 shadow-xl z-50 pointer-events-none">
                {tooltip}
              </div>
            </div>
          )}
        </div>
        {icon && <div className={`${accentText[accent]} opacity-80 shrink-0`}>{icon}</div>}
      </div>

      <div className="flex items-baseline justify-between gap-3">
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
          {value}
        </div>
        {trendValue && (
          <div
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
              trend === 'up'
                ? 'bg-emerald-500/15 text-emerald-400'
                : trend === 'down'
                ? 'bg-rose-500/15 text-rose-400'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {trend === 'up' && <TrendingUp className="w-3 h-3" />}
            {trend === 'down' && <TrendingDown className="w-3 h-3" />}
            {trend === 'neutral' && <Minus className="w-3 h-3" />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      {subValue && (
        <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5 font-medium">
          {subValue}
        </div>
      )}
    </div>
  );
}
