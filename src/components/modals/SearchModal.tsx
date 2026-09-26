'use client';

import React, { useState, useEffect } from 'react';
import { useNexus } from '@/lib/store/nexusContext';
import { Modal } from '@/components/ui/Modal';
import { 
  Search, 
  LayoutDashboard, 
  PlayCircle, 
  Sliders, 
  GitFork, 
  Target, 
  CheckSquare, 
  BarChart3, 
  Bot, 
  UserCheck, 
  Settings, 
  Sparkles,
  ArrowRight,
  Plus
} from 'lucide-react';
import { TabType } from '@/types/nexus';

export const SearchModal: React.FC = () => {
  const { isModalOpen, closeModal, setActiveTab, openModal } = useNexus();
  const [query, setQuery] = useState('');

  if (!isModalOpen.search) return null;

  const navigationItems: { id: TabType; title: string; category: string; icon: React.ReactNode; shortcut: string }[] = [
    { id: 'overview', title: 'Dashboard Overview', category: 'Navigation', icon: <LayoutDashboard className="w-4 h-4 text-cyan-400" />, shortcut: 'O' },
    { id: 'simulate', title: 'Simulate My Future', category: 'Trajectory', icon: <PlayCircle className="w-4 h-4 text-cyan-400" />, shortcut: 'S' },
    { id: 'whatif', title: 'What-If Habit Simulator', category: 'Simulation', icon: <Sliders className="w-4 h-4 text-indigo-400" />, shortcut: 'W' },
    { id: 'paths', title: 'Alternative Future Paths', category: 'Scenarios', icon: <GitFork className="w-4 h-4 text-purple-400" />, shortcut: 'P' },
    { id: 'goals', title: 'Goals & Milestones Architecture', category: 'Objectives', icon: <Target className="w-4 h-4 text-rose-400" />, shortcut: 'G' },
    { id: 'tasks', title: "Today's Action Plan & Focus Timer", category: 'Execution', icon: <CheckSquare className="w-4 h-4 text-emerald-400" />, shortcut: 'T' },
    { id: 'analytics', title: 'Trajectory Analytics & Telemetry', category: 'Analytics', icon: <BarChart3 className="w-4 h-4 text-amber-400" />, shortcut: 'A' },
    { id: 'coach', title: 'AI Telemetry Diagnostic Coach', category: 'AI Intelligence', icon: <Bot className="w-4 h-4 text-indigo-400" />, shortcut: 'C' },
    { id: 'future-you', title: 'Future You Digital Twin Profile', category: 'Identity', icon: <UserCheck className="w-4 h-4 text-cyan-400" />, shortcut: 'F' },
    { id: 'settings', title: 'Engine Settings & Data Persistence', category: 'System', icon: <Settings className="w-4 h-4 text-slate-400" />, shortcut: ',' },
  ];

  const filteredItems = navigationItems.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (id: TabType) => {
    setActiveTab(id);
    closeModal('search');
  };

  return (
    <Modal
      isOpen={isModalOpen.search}
      onClose={() => closeModal('search')}
      title=""
      size="lg"
    >
      <div className="space-y-4 -mt-3">
        {/* Search input */}
        <div className="relative flex items-center border-b border-slate-800 pb-3">
          <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search trajectory views (e.g., What-If, Goals, AI Coach)..."
            className="w-full bg-transparent text-sm md:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Quick:</span>
          <button
            onClick={() => {
              closeModal('search');
              openModal('newGoal');
            }}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3 h-3" /> New Goal
          </button>
          <button
            onClick={() => {
              closeModal('search');
              openModal('newTask');
            }}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-800 flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3 h-3" /> New Task
          </button>
          <button
            onClick={() => {
              closeModal('search');
              openModal('explanation');
            }}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-slate-800 flex items-center gap-1 shrink-0"
          >
            <Sparkles className="w-3 h-3" /> Math Proof
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto space-y-1">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className="w-full p-2.5 rounded-lg flex items-center justify-between gap-3 text-left hover:bg-cyan-500/10 hover:border-cyan-500/30 border border-transparent transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-md bg-slate-900 group-hover:bg-slate-800">
                  {item.icon}
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase">
                    {item.category}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800">
                  {item.shortcut}
                </kbd>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          ))}

          {filteredItems.length === 0 && (
            <div className="py-8 text-center text-sm text-slate-500">
              No matching views or commands found for &quot;{query}&quot;
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
