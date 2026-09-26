'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Bell,
  Sparkles,
  Zap,
  Menu,
  Clock,
  RotateCcw,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useNexus } from '@/lib/store/nexusContext';
import { Button } from '@/components/ui/Button';

interface TopbarProps {
  onToggleMobileMenu?: () => void;
}

export function Topbar({ onToggleMobileMenu }: TopbarProps) {
  const {
    setIsSearchOpen,
    setIsNewTaskModalOpen,
    setIsNewGoalModalOpen,
    setActiveTab,
    resetToDefaultData,
    simulationResult,
    isDemoMode
  } = useNexus();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 shrink-0 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between gap-4 z-20">
      {/* Left: Mobile Toggle & Quick Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full max-w-sm flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all cursor-pointer shadow-inner"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-500" />
            <span>Search goals, tasks, simulations...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right: Actions, Live Clock, Simulation CTA, Notifications, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Live Telemetry Clock */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-400">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{currentTime || '12:00:00'}</span>
        </div>

        {/* Demo Mode Badge with Reset Action */}
        <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-cyan-950/40 border border-cyan-800/50 text-[11px] text-cyan-300 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>DEMO DATA ACTIVE</span>
          <button
            onClick={resetToDefaultData}
            title="Reset telemetry to baseline demo state"
            className="ml-1 text-slate-400 hover:text-cyan-200 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        {/* Big Action: Simulate My Future */}
        <Button
          variant="primary"
          size="sm"
          icon={<Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />}
          onClick={() => setActiveTab('simulation')}
          className="shadow-cyan-500/20"
        >
          <span className="hidden sm:inline">Simulate</span> Future
        </Button>

        {/* Quick Add Dropdown */}
        <Button
          variant="outline"
          size="sm"
          icon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => setIsNewTaskModalOpen(true)}
          title="Add New Daily Task"
        >
          <span className="hidden md:inline">Task</span>
        </Button>

        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-slate-950 animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="font-semibold text-sm text-white">Notifications</span>
                <span className="text-[11px] font-mono text-cyan-400">2 NEW</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Momentum Acceleration</span>
                  </div>
                  <p className="text-slate-300">
                    Your 7-day consistency hit 86%. Projected completion advanced by 4 days!
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Daily Objective Remaining</span>
                  </div>
                  <p className="text-slate-300">
                    You have 3 tasks scheduled for today. Complete them before midnight to maintain streak.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Digital Twin Mini Avatar */}
        <div
          onClick={() => setActiveTab('futureyou')}
          className="flex items-center gap-2 pl-2 border-l border-slate-800 cursor-pointer group"
          title="View Future Self Profile"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-[1.5px] group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-bold text-xs text-cyan-300">
              RX
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
