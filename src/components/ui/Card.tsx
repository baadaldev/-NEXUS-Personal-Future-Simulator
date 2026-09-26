'use client';

import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean | 'cyan' | 'purple' | 'emerald' | 'none';
  id?: string;
  onClick?: () => void;
}

export function Card({
  children,
  className = '',
  glow = 'none',
  id,
  onClick
}: CardProps) {
  const resolvedGlow = glow === true ? 'cyan' : glow === false ? 'none' : glow;

  const glowStyles = {
    none: 'border-slate-800/80 shadow-xl shadow-black/40',
    cyan: 'border-cyan-500/30 hover:border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.12)]',
    purple: 'border-purple-500/30 hover:border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.12)]',
    emerald: 'border-emerald-500/30 hover:border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.12)]'
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative rounded-2xl bg-slate-900/70 backdrop-blur-xl border p-5 transition-all duration-300 ${glowStyles[resolvedGlow]} ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
