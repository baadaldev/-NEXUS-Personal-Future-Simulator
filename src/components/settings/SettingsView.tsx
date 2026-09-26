'use client';

import React, { useState } from 'react';
import { useNexus } from '@/lib/store/nexusContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { THEME_LIST, THEMES } from '@/lib/constants/themes';
import { 
  Settings, 
  RotateCcw, 
  Download, 
  Database, 
  Sliders, 
  ShieldCheck, 
  Info,
  Palette,
  Sparkles,
  Zap,
  Check
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { 
    resetToDemo, 
    dailyLogs, 
    goals, 
    tasks, 
    parameters, 
    addNotification,
    openModal,
    currentTheme,
    setTheme,
    particlesEnabled,
    setParticlesEnabled
  } = useNexus();

  const [confirmReset, setConfirmReset] = useState(false);

  // Export full JSON state
  const handleExportJSON = () => {
    const backup = {
      exportDate: new Date().toISOString(),
      parameters,
      goals,
      dailyLogs,
      tasks,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nexus-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addNotification({
      title: 'State Exported',
      message: 'Complete simulation telemetry and configuration saved to JSON.',
      type: 'success',
    });
  };

  const handleResetDemoData = () => {
    resetToDemo();
    setConfirmReset(false);
    addNotification({
      title: 'Demo Environment Reset',
      message: 'Restored 28-day historical telemetry and Full-Stack Developer scenario.',
      type: 'info',
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="slate">
              <Settings className="w-3.5 h-3.5 mr-1" />
              Configuration & Customization
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-100">
            System Settings & Themes
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your deterministic engine constraints, visual aesthetics, performance, and telemetry storage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => openModal('explanation')}>
            <Info className="w-4 h-4 text-cyan-400" />
            Inspect Math Proof
          </Button>
        </div>
      </div>

      {/* Visual Atmosphere & Theme Selector */}
      <Card className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold text-slate-100">Visual Aesthetic & Atmosphere</h3>
              <p className="text-xs text-slate-400">Select your preferred color palette and atmospheric glow.</p>
            </div>
          </div>
          <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
            {THEMES[currentTheme]?.name || 'Obsidian'} Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {THEME_LIST.map((theme) => {
            const isSelected = currentTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => {
                  setTheme(theme.id);
                  addNotification({
                    title: 'Theme Applied',
                    message: `Switched visual palette to ${theme.name}`,
                    type: 'info'
                  });
                }}
                className={`group relative p-3.5 rounded-2xl border text-left transition-all cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'border-cyan-400/80 bg-slate-900 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/50'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: theme.accentHex }}
                    />
                    <span className="font-semibold text-xs text-slate-200">{theme.name}</span>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {theme.tagline}
                </p>
              </button>
            );
          })}
        </div>

        {/* Performance & Animation Engine */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Fluid Trajectory Background Particles</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Renders real-time dynamic canvas nodes and vector trajectories in the background.
            </p>
          </div>
          <button
            onClick={() => setParticlesEnabled(!particlesEnabled)}
            className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer shrink-0 ${
              particlesEnabled
                ? 'bg-cyan-950/50 border-cyan-800 text-cyan-300 hover:bg-cyan-900/50'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {particlesEnabled ? 'Enabled (60 FPS)' : 'Disabled (Power Saver)'}
          </button>
        </div>
      </Card>

      {/* Persistence & Data Management */}
      <Card className="space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
          <Database className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-base font-bold text-slate-100">Telemetry Storage & State Management</h3>
            <p className="text-xs text-slate-400">All data is kept private in browser local storage and calculated client-side.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400">Active Goals</div>
            <div className="text-xl font-bold font-mono text-cyan-400 mt-1">{goals.length}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Anchoring simulations</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400">Telemetry Log Records</div>
            <div className="text-xl font-bold font-mono text-indigo-400 mt-1">{dailyLogs.length} Days</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Empirical historical samples</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400">Configured Tasks</div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{tasks.length} Items</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Actionable daily sprint items</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button variant="secondary" onClick={handleExportJSON}>
            <Download className="w-4 h-4" />
            Export Complete State (JSON)
          </Button>

          {!confirmReset ? (
            <Button variant="outline" onClick={() => setConfirmReset(true)}>
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              Reset Demo Dataset (28 Days)
            </Button>
          ) : (
            <div className="flex items-center gap-2 p-1 bg-amber-950/40 border border-amber-800/60 rounded-lg">
              <span className="text-xs text-amber-300 font-mono px-2">Reset to seed data?</span>
              <Button variant="primary" size="sm" onClick={handleResetDemoData}>
                Confirm Reset
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirmReset(false)}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Mathematical Engine Parameters */}
      <Card className="space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
          <Sliders className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-base font-bold text-slate-100">Deterministic Engine Baseline Constraints</h3>
            <p className="text-xs text-slate-400">Mathematical constants used when calculating trajectories and momentum derivatives.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <div>
              <div className="text-sm font-medium text-slate-200">Daily Deep Work Baseline</div>
              <div className="text-xs text-slate-500">Core study commitment per day</div>
            </div>
            <div className="font-mono text-cyan-400 font-bold">{parameters.dailyStudyHours} hrs/day</div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <div>
              <div className="text-sm font-medium text-slate-200">Weekly Project Engineering Target</div>
              <div className="text-xs text-slate-500">Applied coding & building commitment</div>
            </div>
            <div className="font-mono text-indigo-400 font-bold">{parameters.weeklyProjectHours} hrs/week</div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <div>
              <div className="text-sm font-medium text-slate-200">Weekly DSA Problem Solving</div>
              <div className="text-xs text-slate-500">Algorithmic readiness metric</div>
            </div>
            <div className="font-mono text-amber-400 font-bold">{parameters.weeklyDSAProblems} problems/week</div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <div>
              <div className="text-sm font-medium text-slate-200">Consistency Baseline Execution</div>
              <div className="text-xs text-slate-500">Reliability coefficient applied to velocity</div>
            </div>
            <div className="font-mono text-emerald-400 font-bold">{parameters.consistencyRate}% factor</div>
          </div>
        </div>
      </Card>

      {/* About & Telemetry Privacy */}
      <Card className="border-slate-800 bg-slate-950/40 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h4 className="text-sm font-bold text-slate-200">Privacy & Determinism Architecture</h4>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          NEXUS runs 100% in your browser. All calculations, sensitivity analysis, and milestone projections are mathematically deterministic using real differential velocity equations. No habit telemetry or personal goals are stored on remote servers without explicit configuration.
        </p>
        <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-slate-500">
          <span>Engine: Nexus v2.5</span>
          <span>•</span>
          <span>Build: Production Live</span>
          <span>•</span>
          <span>Latency: &lt;1ms</span>
        </div>
      </Card>
    </div>
  );
};
