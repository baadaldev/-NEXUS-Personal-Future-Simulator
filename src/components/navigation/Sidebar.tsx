'use client';

import React from 'react';
import {
  Compass,
  Zap,
  Sliders,
  GitBranch,
  CalendarCheck,
  Target,
  BarChart3,
  Bot,
  UserCheck,
  Settings,
  Sparkles,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { useNexus } from '@/lib/store/nexusContext';
import { Badge } from '@/components/ui/Badge';

export function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    setActiveView,
    simulationResult,
    setIsNewGoalModalOpen,
    isDemoMode
  } = useNexus();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Compass, badge: null },
    { id: 'simulation', label: 'Simulate Future', icon: Zap, badge: 'Core' },
    { id: 'whatif', label: 'What If?', icon: Sliders, badge: null },
    { id: 'paths', label: 'Alternative Paths', icon: GitBranch, badge: '3' },
    { id: 'today', label: "Today's Plan", icon: CalendarCheck, badge: null },
    { id: 'goals', label: 'Active Goals', icon: Target, badge: null },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
    { id: 'coach', label: 'AI Coach', icon: Bot, badge: 'AI' },
    { id: 'futureyou', label: 'Future You', icon: UserCheck, badge: 'New' },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null }
  ];

  return (
    <aside className="w-64 shrink-0 flex flex-col h-screen bg-slate-950/80 backdrop-blur-2xl border-r border-slate-800/80 p-4 select-none z-30">
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-800/80 px-2">
        <button
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-wider text-white">NEXUS</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                v2.4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[140px]">
              Future Simulator
            </p>
          </div>
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 py-4 space-y-1 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Trajectory Telemetry Card */}
      <div className="pt-3 border-t border-slate-800/80 space-y-3">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-mono text-[11px]">TRAJECTORY</span>
            <Badge status={simulationResult.trajectoryStatus} dot>
              {simulationResult.trajectoryStatus.replace('_', ' ')}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span>Momentum:</span>
            <span
              className={`font-mono font-bold ${
                simulationResult.momentumScore >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {simulationResult.momentumScore >= 0 ? '+' : ''}
              {simulationResult.momentumScore}%
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Projected:</span>
            <span className="font-mono text-cyan-300">
              {simulationResult.projectedCompletionDate}
            </span>
          </div>
        </div>

        <button
          onClick={() => setActiveView('landing')}
          className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Landing Page</span>
        </button>
      </div>
    </aside>
  );
}
