'use client';

import React, { useState } from 'react';
import { NexusProvider, useNexus } from '@/lib/store/nexusContext';
import { ParticleCanvas } from '@/components/background/ParticleCanvas';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Topbar } from '@/components/navigation/Topbar';
import { LandingPage } from '@/components/landing/LandingPage';

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
  const { activeView, setActiveView, activeTab } = useNexus();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className="relative min-h-screen bg-[#05070f] text-slate-100 flex overflow-hidden">
      {/* Background Particle Canvas with low opacity for app dashboard */}
      <ParticleCanvas />

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
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

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto pb-24">
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
        </main>
      </div>

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
