'use client';

import React, { useState } from 'react';
import {
  GitBranch,
  CheckCircle2,
  Calendar,
  Clock,
  Flame,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Zap,
  Info
} from 'lucide-react';
import { useNexus } from '@/lib/store/nexusContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AlternativeScenario } from '@/types/nexus';

export function AlternativePathsView() {
  const { alternativeScenarios, updateSimulationParams, setActiveTab } = useNexus();
  const [selectedPathId, setSelectedPathId] = useState<string>('path-b');

  const selectedPath =
    alternativeScenarios.find((p) => p.id === selectedPathId) || alternativeScenarios[1];

  const handleSelectAndAdopt = (path: AlternativeScenario) => {
    updateSimulationParams({
      dailyStudyHours: path.dailyHours,
      targetConsistency: path.consistencyRate
    });
    setActiveTab('simulation');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              Comparative Analysis
            </span>
            <Badge variant="cyan">ALTERNATIVE FUTURES</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Alternative Behavioral Trajectories
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Compare distinct behavioral commitments side by side. We present honest, objective
            mathematical trade-offs without psychological fear manipulation.
          </p>
        </div>
      </div>

      {/* 3 Alternative Scenario Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {alternativeScenarios.map((path) => {
          const isSelected = selectedPathId === path.id;
          const isRecommended = path.id === 'path-b';

          return (
            <div
              key={path.id}
              onClick={() => setSelectedPathId(path.id)}
              className={`relative rounded-3xl p-6 transition-all duration-300 border flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 border-cyan-400/80 shadow-[0_0_30px_rgba(6,182,212,0.18)] -translate-y-1'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {isRecommended && (
                <div className="absolute -top-3 left-6">
                  <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[10px] font-bold font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md">
                    Recommended Equilibrium
                  </span>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold text-white">{path.name}</h3>
                  <GitBranch
                    className={`w-5 h-5 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`}
                  />
                </div>

                <div className="space-y-2 py-3 border-y border-slate-800 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" /> Daily Workload:
                    </span>
                    <span className="font-mono font-bold text-white">{path.dailyHours} h/day</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-slate-500" /> Target Consistency:
                    </span>
                    <span className="font-mono font-bold text-cyan-300">
                      {Math.round(path.consistencyRate * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" /> Projected Arrival:
                    </span>
                    <span className="font-mono font-bold text-purple-300">
                      {path.projectedDate}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed min-h-[48px]">
                  {path.tradeoffSummary}
                </p>
              </div>

              <div className="pt-4 mt-2">
                <Button
                  variant={isSelected ? 'primary' : 'outline'}
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectAndAdopt(path);
                  }}
                  icon={<Zap className="w-3.5 h-3.5" />}
                >
                  Adopt Path Strategy
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytical Tradeoff Breakdown Deep-Dive */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">
            Selected Vector Breakdown: {selectedPath.name}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1">
            <span className="text-slate-400 font-mono text-[11px] uppercase">Arrival Timeline</span>
            <div className="text-lg font-bold text-white font-mono">{selectedPath.projectedDate}</div>
            <p className="text-slate-400">
              {selectedPath.daysSavedOrLost <= 0
                ? `Arrives ${Math.abs(selectedPath.daysSavedOrLost)} days ahead of standard deadline.`
                : `Overruns by ${selectedPath.daysSavedOrLost} days past target schedule.`}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1">
            <span className="text-slate-400 font-mono text-[11px] uppercase">Weekly Commitment</span>
            <div className="text-lg font-bold text-cyan-300 font-mono">
              {(selectedPath.dailyHours * 7).toFixed(1)} Hours/Week
            </div>
            <p className="text-slate-400">
              Estimated energy expenditure requiring structured weekly rest windows.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1">
            <span className="text-slate-400 font-mono text-[11px] uppercase">Burnout Risk Ratio</span>
            <div
              className={`text-lg font-bold font-mono ${
                selectedPath.dailyHours > 3.0
                  ? 'text-rose-400'
                  : selectedPath.dailyHours > 2.0
                  ? 'text-emerald-400'
                  : 'text-cyan-400'
              }`}
            >
              {selectedPath.dailyHours > 3.0 ? 'High Risk' : selectedPath.dailyHours > 2.0 ? 'Optimal Low Risk' : 'Minimal'}
            </div>
            <p className="text-slate-400">
              Assesses sustainability based on average human cognitive deep work thresholds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
