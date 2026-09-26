'use client';

import React, { useState } from 'react';
import { useNexus } from '@/lib/store/nexusContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  PlayCircle, 
  Sliders, 
  Bot, 
  ArrowRight, 
  Check, 
  Sparkles,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { isModalOpen, closeModal, setActiveTab } = useNexus();
  const [step, setStep] = useState(1);

  if (!isModalOpen.onboarding) return null;

  const handleFinish = (targetTab?: any) => {
    closeModal('onboarding');
    if (targetTab) {
      setActiveTab(targetTab);
    }
  };

  return (
    <Modal
      isOpen={isModalOpen.onboarding}
      onClose={() => closeModal('onboarding')}
      title=""
      size="md"
    >
      <div className="space-y-6 -mt-2">
        {step === 1 && (
          <div className="space-y-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 p-0.5 shadow-xl shadow-cyan-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-cyan-400" />
              </div>
            </div>

            <div>
              <Badge variant="cyan" glow className="mb-2">
                NEXUS SIMULATOR
              </Badge>
              <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                See where your habits are taking you.
              </h2>
              <p className="text-xs md:text-sm text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                Most productivity apps track what you did yesterday. NEXUS simulates where you will arrive tomorrow based on real mathematical velocity.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-cyan-300">
              GOALS + DAILY BEHAVIOR + CONSISTENCY + TIME = PROJECTED FUTURE
            </div>

            <div className="pt-2 flex justify-center">
              <Button variant="glow" onClick={() => setStep(2)}>
                Continue to Architecture
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center">
              <Badge variant="indigo" className="mb-2">
                CORE ENGINES
              </Badge>
              <h3 className="text-lg md:text-xl font-bold text-white">
                Three Ways to Model Your Trajectory
              </h3>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded bg-cyan-950 text-cyan-400 shrink-0">
                  <PlayCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Simulate My Future</h4>
                  <p className="text-[11px] text-slate-400">
                    Step through an interactive timeline from Today → 30d → 90d → Completion date with dynamic checkpoints.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded bg-indigo-950 text-indigo-400 shrink-0">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">What-If Habit Sandbox</h4>
                  <p className="text-[11px] text-slate-400">
                    Test micro-adjustments in study hours or project frequency and immediately see exact days saved or delayed.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded bg-purple-950 text-purple-400 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Diagnostic AI Life Coach</h4>
                  <p className="text-[11px] text-slate-400">
                    No generic quotes. The AI pinpoints exact telemetry bottlenecks like lag in DSA practice or project execution.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button variant="glow" onClick={() => handleFinish('simulate')}>
                Launch Preloaded Simulator
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
