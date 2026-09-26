'use client';

import React, { useState, useMemo } from 'react';
import {
  Sliders,
  RotateCcw,
  Sparkles,
  Clock,
  Calendar,
  Flame,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useNexus } from '@/lib/store/nexusContext';
import { Slider } from '@/components/ui/Slider';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { runFutureSimulation } from '@/lib/simulation/engine';
import { SimulationParameters } from '@/types/nexus';

export function WhatIfView() {
  const { goals, activityLogs, simulationParams, simulationResult, updateSimulationParams } =
    useNexus();

  // Local sandbox parameters for instant what-if exploration
  const [testParams, setTestParams] = useState<SimulationParameters>({ ...simulationParams });

  // Recalculate what-if scenario dynamically
  const testResult = useMemo(() => {
    return runFutureSimulation(goals, activityLogs, testParams);
  }, [goals, activityLogs, testParams]);

  const daysSavedOrLost = simulationResult.daysDifference - testResult.daysDifference;

  const handleApplyToPlan = () => {
    updateSimulationParams(testParams);
  };

  const handleResetToCurrent = () => {
    setTestParams({ ...simulationParams });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold">
              Sensitivity &amp; Tradeoff Lab
            </span>
            <Badge variant="purple">WHAT-IF ENGINE</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Hypothetical Trajectory Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Tweak your daily study volume, project building time, and consistency targets to inspect
            instant mathematical impacts on your projected attainment date.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={handleResetToCurrent}
          >
            Reset Sliders
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Sparkles className="w-3.5 h-3.5" />}
            onClick={handleApplyToPlan}
          >
            Adopt This Protocol
          </Button>
        </div>
      </div>

      {/* Main What-If Interactive Grid: Sliders on Left, Instant Delta on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders Input Panel (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-slate-900/70 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Adjust Behavioral Levers
            </h2>
            <span className="text-xs font-mono text-slate-400">Live Feedback</span>
          </div>

          {/* Slider 1: Daily Study Hours */}
          <Slider
            label="Daily Study Time"
            unit="h/day"
            min={0.5}
            max={6.0}
            step={0.25}
            value={testParams.dailyStudyHours}
            onChange={(val) => setTestParams((p) => ({ ...p, dailyStudyHours: val }))}
            description="Focused theory, documentation, and conceptual practice"
            accent="cyan"
          />

          {/* Slider 2: Weekly Project Building Time */}
          <Slider
            label="Weekly Project Development"
            unit="h/week"
            min={0}
            max={25}
            step={1}
            value={testParams.weeklyProjectHours}
            onChange={(val) => setTestParams((p) => ({ ...p, weeklyProjectHours: val }))}
            description="Hands-on building: commits, debugging, refactoring, deploying"
            accent="purple"
          />

          {/* Slider 3: Weekly DSA Practice Volume */}
          <Slider
            label="Weekly DSA / LeetCode Problems"
            unit="probs/wk"
            min={0}
            max={40}
            step={2}
            value={testParams.weeklyDSAProblems}
            onChange={(val) => setTestParams((p) => ({ ...p, weeklyDSAProblems: val }))}
            description="Algorithmic problem solving and data structures drills"
            accent="emerald"
          />

          {/* Slider 4: Target Consistency Rate */}
          <Slider
            label="Habit Consistency Target"
            unit="%"
            min={30}
            max={100}
            step={5}
            value={Math.round(testParams.targetConsistency * 100)}
            onChange={(val) => setTestParams((p) => ({ ...p, targetConsistency: val / 100 }))}
            description="Percentage of planned sessions executed without skipping"
            accent="cyan"
          />
        </div>

        {/* Real-Time Outcome Comparison Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Comparison Delta Result Card */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-purple-950/30 border border-purple-500/30 p-6 sm:p-7 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs uppercase font-mono tracking-wider text-purple-300 font-semibold">
                Simulated Outcome Delta
              </span>
              <Badge status={testResult.trajectoryStatus}>
                {testResult.trajectoryStatus.replace('_', ' ')}
              </Badge>
            </div>

            {/* Impact Metric Callout */}
            <div
              className={`p-5 rounded-2xl border text-center space-y-1 ${
                daysSavedOrLost >= 0
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
              }`}
            >
              <span className="text-xs font-mono uppercase tracking-wider block">
                Timeline Shift vs Current Behavior
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono">
                {daysSavedOrLost >= 0
                  ? `+${daysSavedOrLost} Days Saved`
                  : `${Math.abs(daysSavedOrLost)} Days Delayed`}
              </div>
              <p className="text-xs opacity-85">
                {daysSavedOrLost >= 0
                  ? 'This protocol accelerates milestone delivery significantly.'
                  : 'Lower volume or consistency extends your target completion.'}
              </p>
            </div>

            {/* Side by side dates comparison */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px] font-mono">
                    Current Projected Date
                  </span>
                  <span className="font-bold text-slate-200 mt-0.5 block">
                    {simulationResult.projectedCompletionDate}
                  </span>
                </div>
                <span className="font-mono text-slate-400 text-xs">
                  {simulationResult.currentDailyOutputHours}h/day
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/40 text-xs">
                <div>
                  <span className="text-purple-300 block text-[11px] font-mono">
                    What-If Projected Date
                  </span>
                  <span className="font-bold text-white text-sm mt-0.5 block">
                    {testResult.projectedCompletionDate}
                  </span>
                </div>
                <span className="font-mono text-cyan-300 text-xs font-bold">
                  {testResult.currentDailyOutputHours}h/day
                </span>
              </div>
            </div>

            {/* Practical Advice Note */}
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="font-semibold text-purple-300 block">Analytical Trade-Off:</span>
              <p className="leading-relaxed">
                Aiming for {Math.round(testParams.targetConsistency * 100)}% consistency requires{' '}
                {(testParams.dailyStudyHours + testParams.weeklyProjectHours / 7).toFixed(1)}h/day.
                Ensure your schedule provides sufficient recovery to prevent momentum regression.
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={handleApplyToPlan}
              icon={<CheckCircle2 className="w-4 h-4" />}
            >
              Adopt This What-If Scenario
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
