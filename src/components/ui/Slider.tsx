'use client';

import React from 'react';

export interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  description?: string;
  tooltip?: string;
  onChange: (val: number) => void;
  accent?: 'cyan' | 'purple' | 'emerald';
  className?: string;
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  description,
  tooltip,
  onChange,
  accent = 'cyan',
  className = ''
}: SliderProps) {
  const resolvedDesc = description || tooltip;
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  const accentThumb = {
    cyan: 'accent-cyan-400',
    purple: 'accent-purple-400',
    emerald: 'accent-emerald-400'
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-slate-300">{label}</span>
        <span className="font-mono font-semibold text-cyan-300 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60 text-xs">
          {value} {unit}
        </span>
      </div>

      <div className="relative py-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className={`w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer ${accentThumb[accent]} focus:outline-none`}
          style={{
            background: `linear-gradient(to right, rgb(6, 182, 212) 0%, rgb(6, 182, 212) ${percentage}%, rgb(30, 41, 59) ${percentage}%, rgb(30, 41, 59) 100%)`
          }}
        />
      </div>

      <div className="flex justify-between text-[11px] text-slate-500 font-mono">
        <span>
          {min} {unit}
        </span>
        {resolvedDesc && <span className="text-slate-400">{resolvedDesc}</span>}
        <span>
          {max} {unit}
        </span>
      </div>
    </div>
  );
}
