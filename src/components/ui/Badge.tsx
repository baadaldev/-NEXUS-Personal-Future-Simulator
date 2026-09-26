'use client';

import React from 'react';
import { TrajectoryStatus, ConfidenceLevel } from '@/types/nexus';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'purple' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate' | 'status' | 'confidence';
  status?: TrajectoryStatus;
  confidence?: ConfidenceLevel;
  className?: string;
  dot?: boolean;
  glow?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Badge({
  children,
  variant = 'cyan',
  status,
  confidence,
  className = '',
  dot = false,
  glow = false,
  size = 'md'
}: BadgeProps) {
  let styleClasses = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
  let dotColor = 'bg-cyan-400';

  if (status) {
    switch (status) {
      case 'accelerating':
        styleClasses = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35 shadow-[0_0_12px_rgba(16,185,129,0.2)]';
        dotColor = 'bg-emerald-400';
        break;
      case 'on_track':
        styleClasses = 'bg-cyan-500/15 text-cyan-300 border-cyan-500/35 shadow-[0_0_12px_rgba(6,182,212,0.2)]';
        dotColor = 'bg-cyan-400';
        break;
      case 'behind':
        styleClasses = 'bg-amber-500/15 text-amber-300 border-amber-500/35 shadow-[0_0_12px_rgba(245,158,11,0.2)]';
        dotColor = 'bg-amber-400';
        break;
      case 'critical':
        styleClasses = 'bg-rose-500/15 text-rose-300 border-rose-500/35 shadow-[0_0_12px_rgba(244,63,94,0.2)]';
        dotColor = 'bg-rose-400';
        break;
    }
  } else if (confidence) {
    switch (confidence) {
      case 'High':
        styleClasses = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35';
        dotColor = 'bg-emerald-400';
        break;
      case 'Medium':
        styleClasses = 'bg-cyan-500/15 text-cyan-300 border-cyan-500/35';
        dotColor = 'bg-cyan-400';
        break;
      case 'Low':
        styleClasses = 'bg-slate-700/50 text-slate-300 border-slate-600/50';
        dotColor = 'bg-slate-400';
        break;
    }
  } else {
    switch (variant) {
      case 'emerald':
        styleClasses = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
        dotColor = 'bg-emerald-400';
        break;
      case 'indigo':
      case 'purple':
        styleClasses = 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
        dotColor = 'bg-indigo-400';
        break;
      case 'amber':
        styleClasses = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
        dotColor = 'bg-amber-400';
        break;
      case 'rose':
        styleClasses = 'bg-rose-500/15 text-rose-300 border-rose-500/30';
        dotColor = 'bg-rose-400';
        break;
      case 'slate':
        styleClasses = 'bg-slate-800 text-slate-400 border-slate-700';
        dotColor = 'bg-slate-400';
        break;
      case 'cyan':
      default:
        styleClasses = 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
        dotColor = 'bg-cyan-400';
        break;
    }
  }

  const glowStyle = glow ? 'shadow-[0_0_15px_rgba(6,182,212,0.25)]' : '';
  const sizeClasses = size === 'sm' ? 'px-2 py-0.2 text-[10px]' : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border uppercase tracking-wider ${sizeClasses} ${styleClasses} ${glowStyle} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 animate-pulse ${dotColor}`} />}
      {children}
    </span>
  );
}
