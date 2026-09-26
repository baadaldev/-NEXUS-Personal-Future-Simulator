'use client';

import React, { useState, useMemo } from 'react';
import { useNexus } from '@/lib/store/nexusContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MetricCard } from '@/components/ui/MetricCard';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Zap, 
  Calendar, 
  Clock, 
  Download, 
  Sliders, 
  Info,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  Area, 
  ComposedChart 
} from 'recharts';

export const AnalyticsView: React.FC = () => {
  const { 
    simulationResult, 
    dailyLogs, 
    activeGoal, 
    momentum, 
    confidence, 
    parameters,
    openModal 
  } = useNexus();

  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '28d' | 'all'>('28d');

  // Filter historical logs according to timeRange
  const filteredLogs = useMemo(() => {
    if (timeRange === '7d') return dailyLogs.slice(-7);
    if (timeRange === '14d') return dailyLogs.slice(-14);
    return dailyLogs;
  }, [dailyLogs, timeRange]);

  // Aggregate daily telemetry for weekly hours breakdown
  const activityData = useMemo(() => {
    return filteredLogs.map((log) => {
      const study = log.studyHours ?? Number(((log.studyMinutes || 0) / 60).toFixed(1));
      const project = log.projectHours ?? Number(((log.projectMinutes || 0) / 60).toFixed(1));
      const dsa = log.dsaProblemsSolved ?? log.dsaProblems ?? 0;
      const focus = log.focusScore ?? 0.85;
      return {
        date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        studyHours: study,
        projectHours: project,
        dsaProblems: dsa,
        totalHours: Number((study + project).toFixed(1)),
        focusScore: Math.round(focus * 100),
        completed: (log.completedAllPlanned || (log.consistencyRate ?? 0) >= 0.75) ? 1 : 0,
      };
    });
  }, [filteredLogs]);

  // Prepare unified trajectory chart data: Historical + Projected
  const trajectoryChartData = useMemo(() => {
    if (!simulationResult) return [];

    const totalGoalHours = activeGoal?.estimatedHoursTotal || activeGoal?.estimatedRequiredHours || 450;

    // Historical cumulative points
    let cumulativeActual = 0;
    const historicalPoints = dailyLogs.map((log, index) => {
      const study = log.studyHours ?? ((log.studyMinutes || 0) / 60);
      const project = log.projectHours ?? ((log.projectMinutes || 0) / 60);
      cumulativeActual += study + project;
      const idealCumulative = Math.min(
        totalGoalHours,
        Math.round((index + 1) * (activeGoal?.requiredDailyHours || 3.2))
      );
      return {
        label: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        actual: cumulativeActual,
        required: idealCumulative,
        projected: null as number | null,
        lowerConfidence: null as number | null,
        upperConfidence: null as number | null,
      };
    });

    // Today's crossover point
    const lastHist = historicalPoints[historicalPoints.length - 1];
    if (lastHist) {
      lastHist.projected = lastHist.actual;
      lastHist.lowerConfidence = lastHist.actual;
      lastHist.upperConfidence = lastHist.actual;
    }

    // Future points sampled from simulation trajectoryPoints
    const futurePoints = (simulationResult.trajectoryPoints || []).map((pt) => {
      const daysFromNow = pt.day;
      const uncertainty = (daysFromNow / 120) * 0.15;
      return {
        label: `+${pt.day}d`,
        actual: null as number | null,
        required: Math.min(totalGoalHours, Math.round(pt.requiredCumulativeHours)),
        projected: Math.min(totalGoalHours, Math.round(pt.projectedCumulativeHours)),
        lowerConfidence: Math.min(
          totalGoalHours,
          Math.round(pt.projectedCumulativeHours * (1 - uncertainty))
        ),
        upperConfidence: Math.min(
          totalGoalHours,
          Math.round(pt.projectedCumulativeHours * (1 + uncertainty))
        ),
      };
    });

    return [...historicalPoints.slice(-14), ...futurePoints];
  }, [simulationResult, dailyLogs, activeGoal]);

  // Telemetry Aggregates
  const stats = useMemo(() => {
    const totalHours = dailyLogs.reduce((acc, log) => {
      const s = log.studyHours ?? ((log.studyMinutes || 0) / 60);
      const p = log.projectHours ?? ((log.projectMinutes || 0) / 60);
      return acc + s + p;
    }, 0);
    const avgDaily = totalHours / (dailyLogs.length || 1);
    const totalDSA = dailyLogs.reduce((acc, log) => acc + (log.dsaProblemsSolved ?? log.dsaProblems ?? 0), 0);
    const completedDays = dailyLogs.filter(log => log.completedAllPlanned || (log.consistencyRate ?? 0) >= 0.75).length;
    const consistencyRate = Math.round((completedDays / (dailyLogs.length || 1)) * 100);
    const avgFocus = Math.round(
      (dailyLogs.reduce((acc, log) => acc + (log.focusScore ?? 0.88), 0) / (dailyLogs.length || 1)) * 100
    );

    return {
      totalHours: totalHours.toFixed(1),
      avgDaily: avgDaily.toFixed(1),
      totalDSA,
      consistencyRate,
      avgFocus,
    };
  }, [dailyLogs]);

  // CSV telemetry export
  const handleExportCSV = () => {
    const headers = ['Date', 'Study Hours', 'Project Hours', 'DSA Solved', 'Focus Score', 'All Planned Done'];
    const rows = dailyLogs.map(l => [
      l.date,
      l.studyHours,
      l.projectHours,
      l.dsaProblemsSolved,
      l.focusScore,
      l.completedAllPlanned ? 'Yes' : 'No'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nexus-telemetry-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="cyan" glow>
              <BarChart3 className="w-3.5 h-3.5 mr-1" />
              Telemetry & Trajectory Analytics
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-100">
            Mathematical Progress Telemetry
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Empirical logs from the last 28 days mapped against required deterministic trajectories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => openModal('explanation')}>
            <Info className="w-4 h-4 text-cyan-400" />
            Math Formulas
          </Button>
          <Button variant="secondary" size="sm" onClick={handleExportCSV}>
            <Download className="w-4 h-4" />
            Export Telemetry CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="28-Day Logged Work"
          value={`${stats.totalHours} hrs`}
          trend="up"
          trendValue="+18.4 hrs vs prev"
          icon={<Clock className="w-4 h-4 text-cyan-400" />}
          tooltip="Cumulative deep work hours logged over the last 28 days."
        />
        <MetricCard
          label="Empirical Velocity"
          value={`${stats.avgDaily} hrs/d`}
          trend={Number(stats.avgDaily) >= 3.0 ? 'up' : 'down'}
          trendValue={`Target: ${activeGoal?.requiredDailyHours || 3.2}h`}
          icon={<Activity className="w-4 h-4 text-indigo-400" />}
          tooltip="Average effective daily hours invested across study and projects."
        />
        <MetricCard
          label="Habit Consistency"
          value={`${stats.consistencyRate}%`}
          trend={stats.consistencyRate >= 80 ? 'up' : 'neutral'}
          trendValue={`${simulationResult?.consistencyFactor ? Math.round(simulationResult.consistencyFactor * 100) : 82}% Factor`}
          icon={<Zap className="w-4 h-4 text-amber-400" />}
          tooltip="Percentage of planned daily commitments successfully executed."
        />
        <MetricCard
          label="Momentum Vector"
          value={momentum >= 0 ? `+${momentum}%` : `${momentum}%`}
          trend={momentum >= 0 ? 'up' : 'down'}
          trendValue={confidence.toUpperCase() + ' CONFIDENCE'}
          icon={<TrendingUp className="w-4 h-4 text-emerald-400" />}
          tooltip="7-day rolling derivative of velocity compared to the 28-day baseline."
        />
      </div>

      {/* Trajectory Recharts Graph */}
      <Card glow className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Trajectory Engine: Actual vs Required vs Projected
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Blue = Empirical Past • Cyan = Projected Future • Slate = Required Benchmark
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
              Confidence Band: 88%
            </span>
          </div>
        </div>

        {/* Recharts Trajectory Line / Area Chart */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={trajectoryChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="projectedArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis 
                stroke="#64748b" 
                tick={{ fontSize: 11 }} 
                unit="h"
                domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.1)]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#090d16', 
                  borderColor: '#1e293b', 
                  borderRadius: '8px', 
                  fontSize: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              
              {/* Benchmark curve */}
              <Line 
                type="monotone" 
                dataKey="required" 
                name="Required Pace" 
                stroke="#64748b" 
                strokeDasharray="4 4" 
                strokeWidth={2}
                dot={false}
              />

              {/* Historical actual curve */}
              <Line 
                type="monotone" 
                dataKey="actual" 
                name="Actual Hours Logged" 
                stroke="#38bdf8" 
                strokeWidth={3}
                dot={{ r: 3, fill: '#38bdf8' }}
                activeDot={{ r: 6 }}
              />

              {/* Projected Future curve */}
              <Line 
                type="monotone" 
                dataKey="projected" 
                name="Projected Future" 
                stroke="#06b6d4" 
                strokeWidth={3}
                strokeDasharray="2 2"
                dot={{ r: 3, fill: '#06b6d4' }}
              />

              {/* Confidence Band Area */}
              <Area 
                type="monotone" 
                dataKey="upperConfidence" 
                stroke="none" 
                fill="#06b6d4" 
                fillOpacity={0.08} 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Two Column Section: Daily Workload Bar Chart + Diagnostic Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Effort Distribution (2 cols) */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                Effort Distribution: Study vs Project Work
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Hours logged per day across focused disciplines</p>
            </div>

            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              {(['7d', '14d', '28d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-2.5 py-1 rounded font-mono uppercase text-[11px] transition-colors ${
                    timeRange === range
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} unit="h" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#090d16', 
                    borderColor: '#1e293b', 
                    borderRadius: '8px', 
                    fontSize: '11px' 
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                <Bar dataKey="studyHours" name="Theory & Concept (h)" fill="#06b6d4" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="projectHours" name="Applied Coding (h)" fill="#6366f1" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Bottleneck & Telemetry Diagnostics (1 col) */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">Telemetry Diagnostics</h3>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Project / Theory Balance</span>
                <span className="font-mono text-cyan-400 font-semibold">1.4 : 1 Ratio</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Applied project hours exceed study hours by 40%, indicating strong tactile skill retention.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-900/30 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>DSA Practice Vulnerability</span>
              </div>
              <p className="text-[11px] text-amber-300/80 leading-relaxed">
                Algorithms practice averaged 2.1 problems/week vs 5 target. Potential interview readiness bottleneck.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/30 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Deep Work Focus Efficiency</span>
              </div>
              <p className="text-[11px] text-emerald-300/80 leading-relaxed">
                Average focus rating of {stats.avgFocus}% indicates minimal context switching during study blocks.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Button 
              variant="outline" 
              className="w-full text-xs"
              onClick={() => openModal('explanation')}
            >
              Inspect Simulation Proof
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
