'use client';

import React from 'react';
import { useNexus } from '@/lib/store/nexusContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { 
  UserCheck, 
  Sparkles, 
  Award, 
  Calendar, 
  Clock, 
  Code, 
  Zap, 
  ShieldCheck, 
  Layers, 
  CheckCircle2,
  TrendingUp,
  Cpu,
  ArrowRight
} from 'lucide-react';

export const FutureYouView: React.FC = () => {
  const { 
    futureSelf, 
    simulationResult, 
    activeGoal, 
    setActiveTab, 
    parameters 
  } = useNexus();

  const projectedDateStr = simulationResult?.projectedDate
    ? new Date(simulationResult.projectedDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'October 24, 2026';

  const skillMatrix = [
    { name: 'Frontend Architecture (React 19 / Next.js)', level: 88, status: 'Advanced' },
    { name: 'Backend Systems & API Design (Node / Go)', level: 82, status: 'Proficient' },
    { name: 'Database Optimization & SQL / Prisma', level: 78, status: 'Proficient' },
    { name: 'Cloud Infrastructure & Docker / CI/CD', level: 72, status: 'Competent' },
    { name: 'Data Structures & Algorithmic Problem Solving', level: 68, status: 'Interview Ready' },
    { name: 'System Design & Distributed Scalability', level: 74, status: 'Proficient' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="cyan" glow>
              <UserCheck className="w-3.5 h-3.5 mr-1" />
              Digital Twin Simulation
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-100">
            Future You Profile
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            A concrete mathematical model of your acquired competencies upon completing your active trajectory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setActiveTab('whatif')}>
            <Zap className="w-4 h-4 text-cyan-400" />
            Adjust Trajectory in What-If
          </Button>
        </div>
      </div>

      {/* Main Digital Twin Hero Identity Card */}
      <Card glow className="relative overflow-hidden border-cyan-500/30 bg-gradient-to-br from-slate-900/95 via-slate-900/60 to-cyan-950/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-6 border-b border-slate-800">
          <div className="relative">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 p-0.5 shadow-xl shadow-cyan-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Cpu className="w-10 h-10 md:w-12 md:h-12 text-cyan-400" />
              </div>
            </div>
            <span className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-full text-[10px] font-mono font-bold">
              VERIFIED
            </span>
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                Simulated Persona Checkpoint
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-mono">Confidence: {(simulationResult?.confidenceLevel || simulationResult?.confidence || 'High').toUpperCase()}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {futureSelf.targetTitle || futureSelf.archetypeTitle}
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Synthesized through consistent daily execution of {parameters.dailyStudyHours}h study and {parameters.weeklyProjectHours}h project engineering.
            </p>
          </div>
        </div>

        {/* Core Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              Arrival Date
            </div>
            <div className="text-sm md:text-base font-bold font-mono text-slate-100">
              {projectedDateStr}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Mastery Hours Logged
            </div>
            <div className="text-sm md:text-base font-bold font-mono text-slate-100">
              {activeGoal?.estimatedHoursTotal || 450} Total Hrs
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Target Portfolio
            </div>
            <div className="text-sm md:text-base font-bold font-mono text-slate-100">
              3 Production SaaS
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Consistency Index
            </div>
            <div className="text-sm md:text-base font-bold font-mono text-emerald-400">
              {parameters.consistencyRate}% Sustained
            </div>
          </div>
        </div>
      </Card>

      {/* Skills Competency Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-slate-100">Competency Level at Arrival</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Target Benchmark</span>
          </div>

          <div className="space-y-4">
            {skillMatrix.map((item) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {item.status}
                    </span>
                    <span className="font-mono font-bold text-cyan-400">{item.level}%</span>
                  </div>
                </div>
                <ProgressBar value={item.level} max={100} size="sm" color="cyan" />
              </div>
            ))}
          </div>
        </Card>

        {/* Projected Milestone Accomplishments & Identity Habits */}
        <div className="space-y-6">
          <Card className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold text-slate-100">Projected Accomplishments</h3>
            </div>

            <div className="space-y-2.5">
              {(futureSelf.accomplishments || [
                'Production SaaS architecture deployed with verified live users',
                '100+ LeetCode DSA algorithmic challenges mastered',
                'Comprehensive technical portfolio showcasing deterministic telemetry engineering'
              ]).map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="space-y-4 border-indigo-500/30 bg-slate-900/60">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="text-base font-bold text-slate-100">Identity Habits Locked In</h3>
            </div>

            <div className="space-y-2.5">
              {(futureSelf.keyHabits || [
                'Uninterrupted 3.2-hour morning deep work block sustained 6 days/week',
                'Zero context-switching during core engineering sprint sessions',
                'Weekly architectural review and test-driven code refactoring cadence'
              ]).map((habit, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2.5 rounded-lg bg-indigo-950/20 border border-indigo-900/30">
                  <Zap className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-indigo-200 leading-relaxed">{habit}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Trajectory Acceleration CTA */}
      <Card className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-white">Want to reach this future state 30 days earlier?</h4>
          <p className="text-xs text-slate-400 mt-1">
            Simulate a balanced shift in What-If: adding +35 min study daily and 2 more project hours per week.
          </p>
        </div>

        <Button variant="glow" onClick={() => setActiveTab('whatif')} className="shrink-0">
          Open What-If Simulator
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Card>
    </div>
  );
};
