'use client';

import React, { useState } from 'react';
import {
  Zap,
  HelpCircle,
  Calendar,
  Clock,
  Target,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useNexus } from '@/lib/store/nexusContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';

export function SimulationView() {
  const {
    goals,
    activityLogs,
    simulationResult,
    simulationParams,
    setIsExplanationModalOpen
  } = useNexus();

  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedTimelineNode, setSelectedTimelineNode] = useState<number>(0);

  const primaryGoal = goals[0];

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 600);
  };

  const activeNode = simulationResult.timeline[selectedTimelineNode] || simulationResult.timeline[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Simulation Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="cyan" dot>
              PROJECTION MODEL ACTIVE
            </Badge>
            <span className="text-xs text-slate-500 font-mono">
              Confidence: {simulationResult.confidence} ({simulationResult.confidenceScore}%)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Future Trajectory Simulation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Simulating multi-month outcomes from your actual behavioral telemetry. All dates are
            deterministic algorithmic projections, not guaranteed predictions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={<HelpCircle className="w-3.5 h-3.5" />}
            onClick={() => setIsExplanationModalOpen(true)}
          >
            How it works
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={
              <RefreshCw
                className={`w-4 h-4 ${isSimulating ? 'animate-spin text-amber-300' : ''}`}
              />
            }
            onClick={handleRunSimulation}
            disabled={isSimulating}
          >
            {isSimulating ? 'Simulating...' : 'Recalculate Future'}
          </Button>
        </div>
      </div>

      {/* Side-by-Side: Current Reality vs Projected Future State */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CURRENT STATE CARD */}
        <div className="relative rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-7 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <h2 className="text-base font-bold text-slate-200 tracking-wide uppercase font-mono">
                Current Reality (Today)
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">Baseline Telemetry</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span className="text-[11px] font-mono text-slate-400 block uppercase">
                Daily Velocity
              </span>
              <span className="text-xl font-bold font-mono text-white mt-1 block">
                {simulationResult.currentDailyOutputHours}h
              </span>
              <span className="text-[10px] text-slate-400">average focused work</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span className="text-[11px] font-mono text-slate-400 block uppercase">
                Consistency
              </span>
              <span className="text-xl font-bold font-mono text-cyan-400 mt-1 block">
                {simulationResult.consistencyScore}%
              </span>
              <span className="text-[10px] text-slate-400">habit stability</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span className="text-[11px] font-mono text-slate-400 block uppercase">Momentum</span>
              <span
                className={`text-xl font-bold font-mono mt-1 block ${
                  simulationResult.momentumScore >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {simulationResult.momentumScore >= 0 ? '+' : ''}
                {simulationResult.momentumScore}%
              </span>
              <span className="text-[10px] text-slate-400">7d vs 21d delta</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span className="text-[11px] font-mono text-slate-400 block uppercase">
                Logged Hours
              </span>
              <span className="text-xl font-bold font-mono text-white mt-1 block">
                {simulationResult.calculationExplanation.hoursLoggedSoFar}h
              </span>
              <span className="text-[10px] text-slate-400">
                of {simulationResult.calculationExplanation.totalRequiredHours}h target
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span className="text-[11px] font-mono text-slate-400 block uppercase">
                Active Goals
              </span>
              <span className="text-xl font-bold font-mono text-white mt-1 block">
                {goals.length}
              </span>
              <span className="text-[10px] text-slate-400">in progression</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span className="text-[11px] font-mono text-slate-400 block uppercase">
                Current Skill
              </span>
              <span className="text-xl font-bold font-mono text-purple-400 mt-1 block">
                Intermediate
              </span>
              <span className="text-[10px] text-slate-400">Full-Stack Stack</span>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-400">Journey Progress Completed</span>
              <span className="font-mono text-cyan-300 font-bold">
                {primaryGoal ? primaryGoal.progressPercentage : 0}%
              </span>
            </div>
            <ProgressBar progress={primaryGoal?.progressPercentage ?? 0} color="cyan" />
          </div>
        </div>

        {/* FUTURE STATE CARD */}
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-cyan-950/20 to-purple-950/20 border border-cyan-500/35 p-6 sm:p-7 shadow-2xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h2 className="text-base font-bold text-cyan-300 tracking-wide uppercase font-mono">
                Simulated Future State
              </h2>
            </div>
            <Badge status={simulationResult.trajectoryStatus}>
              {simulationResult.trajectoryStatus.replace('_', ' ')}
            </Badge>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-1">
            <span className="text-xs uppercase font-mono tracking-wider text-cyan-400">
              Estimated Completion Date
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {simulationResult.projectedCompletionDate}
            </div>
            <div className="text-xs text-slate-300 flex items-center gap-1.5 pt-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                Baseline Deadline: <strong>{simulationResult.targetDate}</strong>
              </span>
              <span className="text-slate-500">&bull;</span>
              <span
                className={`font-semibold ${
                  simulationResult.daysDifference <= 0 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {simulationResult.daysDifference <= 0
                  ? `${Math.abs(simulationResult.daysDifference)} days ahead`
                  : `${simulationResult.daysDifference} days delay`}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <span className="text-[11px] font-mono text-slate-400 block uppercase">
                Expected Projects
              </span>
              <span className="text-xl font-bold font-mono text-white mt-1 block">
                {simulationResult.futureSelf.projectsCompleted} Shipped
              </span>
              <span className="text-[10px] text-slate-400">production-grade</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <span className="text-[11px] font-mono text-slate-400 block uppercase">
                DSA Solved
              </span>
              <span className="text-xl font-bold font-mono text-white mt-1 block">
                {simulationResult.futureSelf.dsaCompleted}
              </span>
              <span className="text-[10px] text-slate-400">patterns mastered</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <span className="text-[11px] font-mono text-slate-400 block uppercase">
                Future Skill
              </span>
              <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
                Advanced
              </span>
              <span className="text-[10px] text-slate-400">Internship Hireable</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300">
            <span className="font-semibold text-cyan-300 block mb-0.5">
              Trajectory Verdict:
            </span>
            {simulationResult.futureSelf.summary}
          </div>
        </div>
      </div>

      {/* Visual Timeline Stepper (TODAY -> 30d -> 90d -> 180d -> COMPLETION) */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              Sequential Milestone Trajectory Timeline
            </h3>
            <p className="text-xs text-slate-400">
              Select any checkpoint node to inspect expected milestone completions and skill progression.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/50 px-2.5 py-1 rounded-lg border border-cyan-800/50">
            Click nodes to inspect
          </span>
        </div>

        {/* Timeline Stepper Nodes */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {simulationResult.timeline.map((node, index) => {
            const isSelected = selectedTimelineNode === index;
            return (
              <button
                key={node.label}
                onClick={() => setSelectedTimelineNode(index)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-b from-cyan-950/60 to-slate-900 border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-slate-400">{node.label}</span>
                  <span className="font-mono text-xs font-bold text-cyan-300">
                    {node.projectedProgress}%
                  </span>
                </div>
                <div className="text-sm font-bold text-white truncate">{node.date}</div>
                <span className="text-[10px] text-slate-400 mt-1 block truncate">
                  {node.statusHighlight}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Checkpoint Detail Drawer Box */}
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/90 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase">
                Checkpoint: {activeNode.label} ({activeNode.date})
              </span>
              <h4 className="text-lg font-bold text-white mt-0.5">
                Expected Milestone State &bull; {activeNode.projectedProgress}% Progress
              </h4>
            </div>
            <Badge variant="cyan">{activeNode.statusHighlight}</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-slate-400 font-medium">
                Milestones Cleared by {activeNode.label}
              </span>
              {activeNode.expectedMilestones && activeNode.expectedMilestones.length > 0 ? (
                <ul className="space-y-2">
                  {activeNode.expectedMilestones.map((m, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-xs text-slate-200 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-500">
                  Initial ramp-up phase: Foundational competencies in development.
                </div>
              )}
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-slate-400 font-medium">
                Projected Skill Matrix
              </span>
              <div className="grid grid-cols-2 gap-2">
                {activeNode.projectedSkills?.map((s, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-300 truncate">{s.name}</span>
                    <Badge variant={s.level === 'Advanced' ? 'emerald' : 'cyan'}>
                      {s.level}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
