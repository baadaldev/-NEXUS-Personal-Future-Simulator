'use client';

import React from 'react';
import {
  Zap,
  TrendingUp,
  Target,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Flame,
  Award,
  ChevronRight,
  BarChart2
} from 'lucide-react';
import { useNexus } from '@/lib/store/nexusContext';
import { MetricCard } from '@/components/ui/MetricCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';

export function OverviewView() {
  const {
    goals,
    tasks,
    activityLogs,
    simulationResult,
    setActiveTab,
    toggleTaskStatus,
    setIsNewTaskModalOpen
  } = useNexus();

  const primaryGoal = goals[0];
  const todayTasks = tasks.slice(0, 4);

  const completedTodayCount = todayTasks.filter((t) => t.status === 'completed').length;
  const todayCompletionRate =
    todayTasks.length > 0 ? Math.round((completedTodayCount / todayTasks.length) * 100) : 0;

  // Calculate weekly output hours
  const weeklyHours = activityLogs
    .slice(0, 7)
    .reduce((sum, l) => sum + (l.studyMinutes + l.projectMinutes) / 60, 0)
    .toFixed(1);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Hero Trajectory Executive Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/40 border border-cyan-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-semibold">
                Live Trajectory Engine
              </span>
              <span className="text-slate-600">&bull;</span>
              <Badge status={simulationResult.trajectoryStatus} dot>
                {simulationResult.trajectoryStatus.replace('_', ' ')}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Projected Ready:{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                {simulationResult.projectedCompletionDate}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              At your current effective output of{' '}
              <strong className="text-cyan-300 font-mono">
                {simulationResult.currentDailyOutputHours}h/day
              </strong>{' '}
              and{' '}
              <strong className="text-cyan-300 font-mono">
                {simulationResult.consistencyScore}% consistency
              </strong>
              , you are{' '}
              <span
                className={`font-semibold ${
                  simulationResult.daysDifference <= 0 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {simulationResult.daysDifference <= 0
                  ? `${Math.abs(simulationResult.daysDifference)} days ahead of schedule`
                  : `${simulationResult.daysDifference} days behind baseline target`}
              </span>
              .
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0">
            <Button
              variant="primary"
              size="lg"
              icon={<Zap className="w-4 h-4 text-amber-300 fill-amber-300" />}
              onClick={() => setActiveTab('simulation')}
              className="shadow-xl"
            >
              Simulate My Future
            </Button>
            <Button
              variant="outline"
              size="md"
              icon={<BarChart2 className="w-4 h-4" />}
              onClick={() => setActiveTab('whatif')}
            >
              Run &quot;What If?&quot; Test
            </Button>
          </div>
        </div>
      </div>

      {/* Primary Telemetry Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="CONSISTENCY"
          value={`${simulationResult.consistencyScore}%`}
          subValue="Calculated from 28-day habit stability"
          trend="up"
          trendValue="+4.2%"
          tooltip="Consistency measures the percentage of scheduled study and project blocks completed without missing."
          accent="cyan"
          icon={<Flame className="w-5 h-5 text-cyan-400" />}
        />

        <MetricCard
          label="MOMENTUM"
          value={`${simulationResult.momentumScore >= 0 ? '+' : ''}${simulationResult.momentumScore}%`}
          subValue="7-day velocity vs 21-day baseline"
          trend={simulationResult.momentumScore >= 0 ? 'up' : 'down'}
          trendValue={simulationResult.momentumScore >= 0 ? 'Accelerating' : 'Lagging'}
          tooltip="Momentum weights recent performance over historical inertia to reflect behavioral momentum shifts."
          accent={simulationResult.momentumScore >= 0 ? 'emerald' : 'rose'}
          icon={<TrendingUp className="w-5 h-5" />}
        />

        <MetricCard
          label="WEEKLY OUTPUT"
          value={`${weeklyHours}h`}
          subValue="Target: 14.0h/week (88% met)"
          trend="up"
          trendValue="Healthy"
          tooltip="Total focused study and code hours logged during the past 7 days."
          accent="purple"
          icon={<Clock className="w-5 h-5 text-purple-400" />}
        />

        <MetricCard
          label="CONFIDENCE"
          value={simulationResult.confidence}
          subValue={`${simulationResult.confidenceScore}% statistical stability`}
          tooltip={simulationResult.confidenceReason}
          accent="emerald"
          icon={<Award className="w-5 h-5 text-emerald-400" />}
        />
      </div>

      {/* Two Column Grid: Active Goal Spotlight vs Today's Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Active Goal & Next Milestone */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-bold text-white tracking-tight">Active Primary Goal</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('goals')}
                className="text-cyan-400"
              >
                All Goals <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {primaryGoal ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{primaryGoal.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {primaryGoal.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Overall Progress</span>
                    <span className="font-mono font-bold text-cyan-400">
                      {primaryGoal.progressPercentage}%
                    </span>
                  </div>
                  <ProgressBar progress={primaryGoal.progressPercentage} color="cyan" height="lg" />
                </div>

                {/* Milestone breakdown mini list */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-xs font-mono uppercase text-slate-400 font-medium">
                    Upcoming Milestones
                  </span>
                  <div className="space-y-2">
                    {primaryGoal.milestones?.slice(0, 3).map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              m.isCompleted ? 'bg-emerald-400' : 'bg-cyan-400'
                            }`}
                          />
                          <span
                            className={`font-medium ${
                              m.isCompleted ? 'text-slate-400 line-through' : 'text-slate-200'
                            }`}
                          >
                            {m.title}
                          </span>
                        </div>
                        <span className="font-mono text-slate-400 text-[11px]">
                          {m.completionPercentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-sm">
                No active goal set. Create your first goal to start simulation.
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Today's Plan */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-bold text-white tracking-tight">Today&apos;s Actions</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsNewTaskModalOpen(true)}
                className="text-purple-400"
              >
                + Add Task
              </Button>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
              <span>Execution Rate:</span>
              <span className="font-mono text-cyan-300 font-semibold">
                {completedTodayCount} / {todayTasks.length} ({todayCompletionRate}%)
              </span>
            </div>

            <div className="space-y-2.5">
              {todayTasks.map((t) => {
                const isCompleted = t.status === 'completed';
                return (
                  <div
                    key={t.id}
                    onClick={() =>
                      toggleTaskStatus(t.id, isCompleted ? 'todo' : 'completed')
                    }
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                        : 'bg-slate-800/60 border-slate-700/70 hover:border-cyan-500/40'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                          isCompleted
                            ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                            : 'border-slate-600 hover:border-cyan-400'
                        }`}
                      >
                        {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-medium leading-snug ${
                          isCompleted ? 'text-slate-400 line-through' : 'text-slate-200'
                        }`}
                      >
                        {t.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-mono">
                        <span>{t.estimatedMinutes}m</span>
                        {t.category && <span>&bull; {t.category}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('today')}
              className="w-full mt-2"
            >
              Open Daily Task Workspace
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
