'use client';

import React, { useState } from 'react';
import { NexusProvider, useNexus } from '@/lib/store/nexusContext';
import { ParticleCanvas } from '@/components/background/ParticleCanvas';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Topbar } from '@/components/navigation/Topbar';
import { LandingPage } from '@/components/landing/LandingPage';
import { AnimatePresence, motion } from 'framer-motion';
import { THEMES } from '@/lib/constants/themes';
import { 
  LayoutDashboard, 
  Zap, 
  CheckSquare, 
  Target, 
  Bot,
  Sliders
} from 'lucide-react';

// Views
import { OverviewView } from '@/components/dashboard/OverviewView';
import { SimulationView } from '@/components/simulation/SimulationView';
import { WhatIfView } from '@/components/whatif/WhatIfView';
import { AlternativePathsView } from '@/components/paths/AlternativePathsView';
import { TodayPlanView } from '@/components/tasks/TodayPlanView';
import { GoalsView } from '@/components/goals/GoalsView';
import { AnalyticsView } from '@/components/analytics/AnalyticsView';
import { AICoachView } from '@/components/coach/AICoachView';
import { FutureYouView } from '@/components/future-you/FutureYouView';
import { SettingsView } from '@/components/settings/SettingsView';

// Modals
import { SearchModal } from '@/components/modals/SearchModal';
import { NewGoalModal } from '@/components/modals/NewGoalModal';
import { NewTaskModal } from '@/components/modals/NewTaskModal';
import { ExplanationModal } from '@/components/modals/ExplanationModal';
import { OnboardingModal } from '@/components/modals/OnboardingModal';

function AppContent() {
  const { activeView, setActiveView, activeTab, setActiveTab, currentTheme } = useNexus();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const themeConfig = THEMES[currentTheme] || THEMES.obsidian;

  // If in landing view, show the high-converting marketing & interactive preview page
  if (activeView === 'landing') {
    return (
      <>
        <LandingPage onLaunchApp={() => setActiveView('app')} />
        <SearchModal />
        <ExplanationModal />
        <OnboardingModal />
      </>
    );
  }

  // App Dashboard Layout
  return (
    <div 
      className="relative min-h-screen text-slate-100 flex overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: themeConfig.bgHex }}
    >
      {/* Background Particle Canvas with low opacity for app dashboard */}
      <ParticleCanvas />

      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-72 h-full bg-slate-950 border-r border-slate-800 animate-slideUp">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        <Topbar onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto pb-28 lg:pb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeTab === 'overview' && <OverviewView />}
              {(activeTab === 'simulation' || activeTab === 'simulate') && <SimulationView />}
              {activeTab === 'whatif' && <WhatIfView />}
              {activeTab === 'paths' && <AlternativePathsView />}
              {(activeTab === 'today' || activeTab === 'tasks') && <TodayPlanView />}
              {activeTab === 'goals' && <GoalsView />}
              {activeTab === 'analytics' && <AnalyticsView />}
              {activeTab === 'coach' && <AICoachView />}
              {(activeTab === 'futureyou' || activeTab === 'future-you') && <FutureYouView />}
              {activeTab === 'settings' && <SettingsView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Floating Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-3 left-4 right-4 z-40 bg-slate-950/85 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-1.5 shadow-2xl flex items-center justify-around">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'overview' ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[10px] font-medium">Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('simulation')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'simulation' ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span className="text-[10px] font-medium">Simulate</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'tasks' || activeTab === 'today' ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span className="text-[10px] font-medium">Tasks</span>
        </button>

        <button
          onClick={() => setActiveTab('goals')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'goals' ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Target className="w-4 h-4" />
          <span className="text-[10px] font-medium">Goals</span>
        </button>

        <button
          onClick={() => setActiveTab('coach')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'coach' ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span className="text-[10px] font-medium">AI Coach</span>
        </button>
      </nav>

      {/* Application Modals */}
      <SearchModal />
      <NewGoalModal />
      <NewTaskModal />
      <ExplanationModal />
      <OnboardingModal />
    </div>
  );
}

export default function Home() {
  return (
    <NexusProvider>
      <AppContent />
    </NexusProvider>
  );
}
