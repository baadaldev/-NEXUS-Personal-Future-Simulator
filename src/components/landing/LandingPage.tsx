'use client';

import React, { useState, useMemo } from 'react';
import { ParticleCanvas } from '@/components/background/ParticleCanvas';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Slider } from '@/components/ui/Slider';
import { 
  Sparkles, 
  PlayCircle, 
  Sliders, 
  GitFork, 
  Bot, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  Target, 
  CheckCircle2, 
  Code, 
  Activity,
  Layers,
  ChevronRight,
  Zap,
  Cpu
} from 'lucide-react';
import { useNexus } from '@/lib/store/nexusContext';

interface LandingPageProps {
  onLaunchApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp }) => {
  const { openModal } = useNexus();

  // Mini What-If Hero Sandbox state
  const [heroStudyHours, setHeroStudyHours] = useState(3.5);
  const [heroProjectHours, setHeroProjectHours] = useState(12);

  // Quick mathematical projection calculation for hero widget
  const heroProjection = useMemo(() => {
    const totalRemainingHours = 350; // remaining hours for demo goal
    const baselineDailyHours = 2.0;
    const baselineDays = Math.ceil(totalRemainingHours / baselineDailyHours);

    const effectiveVelocity = (heroStudyHours + (heroProjectHours / 7)) * 0.85; // 85% consistency factor
    const simulatedDays = Math.ceil(totalRemainingHours / effectiveVelocity);
    const daysSaved = baselineDays - simulatedDays;

    const arrivalDate = new Date();
    arrivalDate.setDate(arrivalDate.getDate() + simulatedDays);

    return {
      simulatedDays,
      daysSaved,
      arrivalDateStr: arrivalDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      velocity: effectiveVelocity.toFixed(1),
    };
  }, [heroStudyHours, heroProjectHours]);

  return (
    <div className="relative min-h-screen bg-[#05070f] text-slate-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 4K Particle Canvas Background */}
      <ParticleCanvas />

      {/* Top Navbar */}
      <header className="relative z-20 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="font-bold text-base md:text-lg tracking-wider text-white">NEXUS</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Future Trajectory Simulator
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs text-slate-400 font-medium">
            <a href="#simulator" className="hover:text-cyan-400 transition-colors">Simulation Engine</a>
            <a href="#whatif" className="hover:text-cyan-400 transition-colors">What-If Sandbox</a>
            <a href="#math" className="hover:text-cyan-400 transition-colors">Deterministic Proof</a>
            <a href="#usecases" className="hover:text-cyan-400 transition-colors">Use Cases</a>
          </nav>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => openModal('explanation')}
              className="hidden sm:flex text-xs"
            >
              Math Proof
            </Button>
            <Button 
              variant="glow" 
              size="sm"
              onClick={onLaunchApp}
              className="text-xs"
            >
              Launch App
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20 md:pt-24 md:pb-32 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
            <Cpu className="w-3.5 h-3.5" />
            <span>AI-POWERED PERSONAL TRAJECTORY &amp; LIFE SIMULATOR</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            See where your habits are <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">taking you.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Most productivity systems record what you did yesterday. <strong>NEXUS</strong> uses real deterministic differential velocity equations to simulate the concrete day you will achieve your highest goals.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              variant="glow" 
              size="lg"
              onClick={onLaunchApp}
              className="w-full sm:w-auto text-sm px-8 py-3.5 shadow-xl shadow-cyan-500/25"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              Launch Interactive Experience
              <span className="text-[11px] ml-2 px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono">Demo Ready</span>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => {
                const el = document.getElementById('sandbox-widget');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto text-sm"
            >
              Try Live Sandbox Below
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Deterministic Engine</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Zero Fake Certainty</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span>Real-Time Differential Solver</span>
            </div>
          </div>
        </div>

        {/* Live Interactive Hero Sandbox Widget */}
        <div id="sandbox-widget" className="mt-16 max-w-4xl mx-auto">
          <Card glow className="border-cyan-500/40 bg-gradient-to-br from-slate-900/95 via-slate-900/70 to-cyan-950/20 shadow-2xl shadow-cyan-500/10 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="cyan">Instant Sandbox</Badge>
                  <span className="text-xs font-mono text-slate-400">Target: Full-Stack Engineer (450 Hours)</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mt-1">
                  Adjust Daily Velocity &amp; Witness Your Arrival Date Shift
                </h3>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Projected Arrival Date</span>
                <span className="text-lg md:text-xl font-mono font-bold text-cyan-400">
                  {heroProjection.arrivalDateStr}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
              <Slider
                label="Daily Deep Study Commitment"
                value={heroStudyHours}
                min={1}
                max={6}
                step={0.5}
                unit="h/day"
                onChange={setHeroStudyHours}
                tooltip="Uninterrupted daily focus dedicated to fundamentals & deep work."
              />

              <Slider
                label="Weekly Applied Project Engineering"
                value={heroProjectHours}
                min={0}
                max={25}
                step={1}
                unit="h/week"
                onChange={setHeroProjectHours}
                tooltip="Hands-on building, architecture design, and coding sprints."
              />
            </div>

            {/* Instant Output Bar */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[11px] text-slate-500 block uppercase font-mono">Velocity</span>
                  <span className="text-base font-bold font-mono text-slate-200">
                    {heroProjection.velocity} hrs/day
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block uppercase font-mono">Horizon</span>
                  <span className="text-base font-bold font-mono text-white">
                    {heroProjection.simulatedDays} Days
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block uppercase font-mono">Impact vs Baseline</span>
                  <span className={`text-base font-bold font-mono ${heroProjection.daysSaved >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {heroProjection.daysSaved >= 0 ? `+${heroProjection.daysSaved} Days Saved` : `${heroProjection.daysSaved} Days Delayed`}
                  </span>
                </div>
              </div>

              <Button variant="glow" size="sm" onClick={onLaunchApp} className="w-full sm:w-auto">
                Explore Full Trajectory
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Core Pillar Modules */}
      <section id="simulator" className="relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <Badge variant="indigo">SYSTEM ARCHITECTURE</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Precision, Not Motivation
          </h2>
          <p className="text-sm md:text-base text-slate-400">
            NEXUS replaces vague resolutions with concrete mathematical trajectories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Card glow className="space-y-4 hover:border-cyan-500/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/50 text-cyan-400 flex items-center justify-center">
              <PlayCircle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Simulate My Future</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Step through dynamic temporal checkpoints (Today → 30d → 90d → 180d → Arrival). Inspect projected skills, milestone completion percentages, and risk factors at each checkpoint.
            </p>
            <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1 pt-2">
              Timeline Stepper with Confidence Bands <ArrowRight className="w-3 h-3" />
            </div>
          </Card>

          {/* Card 2 */}
          <Card glow className="space-y-4 hover:border-indigo-500/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800/50 text-indigo-400 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">What-If Habit Sandbox</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dynamically manipulate study hours, project intensity, DSA problem solving, and consistency rates with 60 FPS slider responsiveness. Instantly calculate net days saved.
            </p>
            <div className="text-[11px] font-mono text-indigo-400 flex items-center gap-1 pt-2">
              Sensitivity Analysis Engine <ArrowRight className="w-3 h-3" />
            </div>
          </Card>

          {/* Card 3 */}
          <Card glow className="space-y-4 hover:border-purple-500/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800/50 text-purple-400 flex items-center justify-center">
              <GitFork className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Alternative Scenarios</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Simulate 3 simultaneous futures: Path A (Baseline Status Quo), Path B (Balanced Optimization), and Path C (High Intensity Sprint). Honest burnout probability modeling.
            </p>
            <div className="text-[11px] font-mono text-purple-400 flex items-center gap-1 pt-2">
              Multi-Path Scenario Engine <ArrowRight className="w-3 h-3" />
            </div>
          </Card>

          {/* Card 4 */}
          <Card glow className="space-y-4 hover:border-emerald-500/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/50 text-emerald-400 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Diagnostic AI Life Coach</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zero generic motivational quotes. The AI analyzes your 28-day telemetry stream to diagnose exact bottlenecks, such as algorithmic practice lagging behind project commits.
            </p>
            <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 pt-2">
              Telemetry Context Stream <ArrowRight className="w-3 h-3" />
            </div>
          </Card>

          {/* Card 5 */}
          <Card glow className="space-y-4 hover:border-amber-500/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-800/50 text-amber-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Mathematical Telemetry</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interactive Recharts trajectory curves comparing required benchmark vs actual cumulative hours vs projected future corridor with confidence bands.
            </p>
            <div className="text-[11px] font-mono text-amber-400 flex items-center gap-1 pt-2">
              Recharts Data Visualizations <ArrowRight className="w-3 h-3" />
            </div>
          </Card>

          {/* Card 6 */}
          <Card glow className="space-y-4 hover:border-cyan-500/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/50 text-cyan-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Future You Digital Twin</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              A concrete digital persona representing the exact technical competencies, shipped projects, and locked-in daily habits you will possess on the arrival date.
            </p>
            <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1 pt-2">
              Identity Matrix &amp; Radar <ArrowRight className="w-3 h-3" />
            </div>
          </Card>
        </div>
      </section>

      {/* Formula & Rigor Section */}
      <section id="math" className="relative z-10 py-20 px-4 sm:px-6 max-w-5xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <Badge variant="cyan">TRANSPARENT MATHEMATICS</Badge>
          <h2 className="text-3xl font-extrabold text-white">
            The Trajectory Differential Model
          </h2>
          <p className="text-sm text-slate-400">
            NEXUS adheres to strict mathematical proof. Every output has an audit trail.
          </p>
        </div>

        <Card className="p-6 md:p-8 bg-slate-950/80 border-slate-800 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                Velocity Differential Equation
              </span>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300">
                V_eff = (H_daily + (H_weekly / 7)) × C_factor × F_focus
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Applies the historical consistency coefficient <code className="text-slate-200">C_factor</code> to prevent over-optimistic linear projections.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider font-semibold">
                Arrival Horizon Formulation
              </span>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-indigo-300">
                D_projected = ceil( H_remaining / V_eff )
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Computes the integer day horizon required to satisfy remaining milestone hours at sustained effective velocity.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Call to Action Banner */}
      <section className="relative z-10 py-20 px-4 sm:px-6 max-w-5xl mx-auto">
        <Card glow className="p-8 md:p-12 text-center bg-gradient-to-tr from-cyan-950/40 via-slate-900 to-indigo-950/40 border-cyan-500/30 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Stop Guessing Your Future. Simulate It.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Experience the complete Full-Stack Developer 28-day demo scenario now with live What-If sliders, timeline inspection, and telemetry coaching.
          </p>
          <div className="pt-2 flex justify-center">
            <Button variant="glow" size="lg" onClick={onLaunchApp} className="px-8 py-3.5">
              Launch Production Simulator
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 py-8 px-4 sm:px-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">NEXUS</span>
            <span>•</span>
            <span>Personal Future Trajectory Simulator</span>
          </div>
          <div>
            Built with Next.js 16, React 19, TypeScript &amp; Tailwind CSS v4.
          </div>
          <div>
            100% Client-Side Privacy Standard.
          </div>
        </div>
      </footer>
    </div>
  );
};
