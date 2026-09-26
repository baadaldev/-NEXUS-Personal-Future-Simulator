'use client';

import React, { useState } from 'react';
import { useNexus } from '@/lib/store/nexusContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { 
  Target, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Code, 
  ArrowRight,
  TrendingUp,
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { analyzeGoalWithAI } from '@/lib/ai/service';
import { Goal, Milestone } from '@/types/nexus';

export const GoalsView: React.FC = () => {
  const { 
    goals, 
    activeGoal, 
    setActiveGoal, 
    addGoal, 
    updateMilestone,
    openModal,
    addNotification
  } = useNexus();

  const [expandedGoalId, setExpandedGoalId] = useState<string>(activeGoal?.id || goals[0]?.id || '');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiDecomposition, setAiDecomposition] = useState<{
    title: string;
    totalHours: number;
    recommendedDailyHours: number;
    milestones: { title: string; estimatedHours: number; skills: string[] }[];
    skills: string[];
    feasibilityScore: number;
    reasoning: string;
  } | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedGoalId(expandedGoalId === id ? '' : id);
  };

  const handleAiDecompose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeGoalWithAI(aiPrompt);
      setAiDecomposition(result);
      addNotification({
        title: 'Goal Analyzed',
        message: `Generated realistic roadmap for "${result.title}" (${result.totalHours} estimated hours).`,
        type: 'success',
      });
    } catch {
      addNotification({
        title: 'Analysis Error',
        message: 'Could not decompose goal. Please try again.',
        type: 'warning',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyAiGoal = () => {
    if (!aiDecomposition) return;

    const newMilestones: Milestone[] = aiDecomposition.milestones.map((m, idx) => ({
      id: `ms-ai-${Date.now()}-${idx}`,
      title: m.title,
      description: `Core focus: ${(m.skills || []).join(', ')}`,
      targetHours: m.estimatedHours,
      completedHours: 0,
      order: idx + 1,
      isCompleted: false,
      skillsCovered: m.skills || [],
    }));

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + Math.ceil(aiDecomposition.totalHours / (aiDecomposition.recommendedDailyHours || 3)));

    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title: aiDecomposition.title,
      description: aiDecomposition.reasoning,
      category: 'career',
      targetCompletionDate: targetDate.toISOString().split('T')[0],
      targetDate: targetDate.toISOString().split('T')[0],
      estimatedHoursTotal: aiDecomposition.totalHours,
      estimatedRequiredHours: aiDecomposition.totalHours,
      completedHoursTotal: 0,
      requiredDailyHours: aiDecomposition.recommendedDailyHours,
      skillsToAcquire: aiDecomposition.skills,
      milestones: newMilestones,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    addGoal(newGoal);
    setAiDecomposition(null);
    setAiPrompt('');
    setExpandedGoalId(newGoal.id);
    addNotification({
      title: 'Goal Roadmap Created',
      message: `"${newGoal.title}" is now active in your trajectory engine.`,
      type: 'success',
    });
  };

  const activeTargetDate = activeGoal?.targetCompletionDate || activeGoal?.targetDate || '2026-11-30';
  const activeCompletedHours = activeGoal?.completedHoursTotal ?? 0;
  const activeEstimatedHours = activeGoal?.estimatedHoursTotal || activeGoal?.estimatedRequiredHours || 450;
  const activeSkills = activeGoal?.skillsToAcquire || activeGoal?.skills?.map(s => s.name) || ['React 19', 'Next.js', 'Node.js', 'System Design'];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="cyan" glow>
              <Target className="w-3.5 h-3.5 mr-1" />
              Strategic Objectives
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-100">
            Goals &amp; Milestone Architecture
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Your simulation is anchored by real objectives. High-resolution milestones feed daily velocity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            onClick={() => {
              const el = document.getElementById('ai-decomposer');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Sparkles className="w-4 h-4 text-cyan-400 mr-1.5" />
            AI Goal Decomposer
          </Button>
          <Button 
            variant="primary"
            onClick={() => openModal('newGoal')}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Create Goal
          </Button>
        </div>
      </div>

      {/* Active Goal Hero Card */}
      {activeGoal && (
        <Card glow="cyan" className="relative overflow-hidden border-cyan-500/30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Primary Simulation Anchor
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-slate-400 capitalize">{activeGoal.category}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                {activeGoal.title}
              </h2>
              <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                {activeGoal.description}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:w-96 shrink-0">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  Target Hours
                </div>
                <div className="text-lg font-bold font-mono text-slate-200">
                  {activeCompletedHours} / {activeEstimatedHours}h
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3 h-3 text-indigo-400" />
                  Target Date
                </div>
                <div className="text-lg font-bold font-mono text-slate-200">
                  {new Date(activeTargetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 col-span-2 sm:col-span-1">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  Pace Req.
                </div>
                <div className="text-lg font-bold font-mono text-slate-200">
                  {activeGoal.requiredDailyHours || 2.5}h/day
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="pt-6 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Total Completion Trajectory</span>
              <span className="font-mono font-semibold text-cyan-400">
                {Math.round((activeCompletedHours / (activeEstimatedHours || 1)) * 100)}% Complete
              </span>
            </div>
            <ProgressBar 
              value={activeCompletedHours} 
              max={activeEstimatedHours} 
              color="cyan"
              size="md"
            />
          </div>

          {/* Target Skills */}
          <div className="pt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Acquired &amp; In-Flight Skills:</span>
            {activeSkills.map((skill) => (
              <span 
                key={skill}
                className="px-2 py-0.5 rounded-full text-xs font-mono bg-slate-800/80 text-cyan-300 border border-cyan-900/30 flex items-center gap-1"
              >
                <Code className="w-2.5 h-2.5 text-cyan-400" />
                {skill}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* AI Goal Decomposer Interactive Section */}
      <Card id="ai-decomposer" glow="purple" className="border-indigo-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-indigo-950/20">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="indigo">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            AI Trajectory Architect
          </Badge>
          <span className="text-xs text-slate-400 font-mono">Telemetry-Driven Roadmap Generator</span>
        </div>

        <h3 className="text-lg font-bold text-slate-100">
          Decompose Any Goal into Simulation Milestones
        </h3>
        <p className="text-xs text-slate-400 max-w-2xl mt-1 mb-4">
          Describe what you want to achieve in natural language. The AI decomposes it into estimated engineering hours, realistic pacing, and verified skill checkpoints.
        </p>

        <form onSubmit={handleAiDecompose} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="e.g., Become a Senior AI Engineer specializing in LLMs & RAG in 6 months"
            className="flex-1 bg-slate-950/80 border border-slate-700/80 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-sans"
          />
          <Button 
            type="submit" 
            variant="primary" 
            disabled={isAnalyzing || !aiPrompt.trim()}
            className="shrink-0"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-2" />
                Simulating Roadmap...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-1.5" />
                Decompose Goal
              </>
            )}
          </Button>
        </form>

        {/* AI Decomposed Result Preview */}
        {aiDecomposition && (
          <div className="mt-6 p-5 rounded-xl bg-slate-950/90 border border-indigo-500/40 space-y-5 animate-slideUp">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider">AI Proposed Objective</span>
                <h4 className="text-base font-bold text-white">{aiDecomposition.title}</h4>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-slate-400">Total Commitment</div>
                  <div className="text-sm font-mono font-bold text-cyan-400">{aiDecomposition.totalHours} hrs (~{aiDecomposition.recommendedDailyHours}h/day)</div>
                </div>
                <Button variant="primary" size="sm" onClick={handleApplyAiGoal}>
                  Apply to Simulation
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded border border-slate-800/80">
              <span className="font-semibold text-indigo-300">Pacing Assessment: </span>
              {aiDecomposition.reasoning}
            </p>

            <div>
              <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Generated Milestones:</h5>
              <div className="space-y-2">
                {aiDecomposition.milestones.map((ms, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-700/50 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <div className="truncate">
                        <div className="text-sm font-medium text-slate-200 truncate">{ms.title}</div>
                        <div className="text-xs text-slate-500 font-mono truncate">{(ms.skills || []).join(', ')}</div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-semibold text-slate-400 shrink-0">
                      {ms.estimatedHours} hrs
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* All Active & Saved Goals */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Award className="w-5 h-5 text-cyan-400" />
          All Defined Goals ({goals.length})
        </h3>

        <div className="space-y-4">
          {goals.map((goal) => {
            const isExpanded = expandedGoalId === goal.id;
            const completedCount = (goal.milestones || []).filter(m => m.isCompleted).length;
            const totalHours = goal.estimatedHoursTotal || goal.estimatedRequiredHours || 450;
            const completedHours = goal.completedHoursTotal ?? 0;
            const pct = Math.round((completedHours / (totalHours || 1)) * 100);

            return (
              <Card 
                key={goal.id} 
                className={`transition-all duration-200 ${goal.isActive ? 'border-cyan-500/40 bg-slate-900/70' : 'border-slate-800/80'}`}
              >
                {/* Goal Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer" onClick={() => toggleExpand(goal.id)}>
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`p-2.5 rounded-lg shrink-0 mt-0.5 ${goal.isActive ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-slate-800 text-slate-400'}`}>
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-white hover:text-cyan-300 transition-colors">
                          {goal.title}
                        </h4>
                        {goal.isActive ? (
                          <Badge variant="cyan" size="sm">Active Goal</Badge>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-xs h-6 px-2 text-slate-400 hover:text-cyan-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveGoal(goal.id);
                            }}
                          >
                            Set Active
                          </Button>
                        )}
                        <span className="text-xs font-mono text-slate-500 capitalize">{goal.category}</span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{goal.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-mono text-slate-300">
                        {completedHours} / {totalHours} hrs ({pct}%)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {completedCount} of {(goal.milestones || []).length} milestones complete
                      </div>
                    </div>

                    <div className="w-24 hidden sm:block">
                      <ProgressBar value={completedHours} max={totalHours} size="sm" />
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(goal.id);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Milestones Breakdown */}
                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                        Milestone Architecture &amp; Completion Status
                      </span>
                      <span className="text-xs text-slate-500">
                        Click checkbox to update milestone progress
                      </span>
                    </div>

                    <div className="space-y-2">
                      {(goal.milestones || []).map((ms, idx) => (
                        <div 
                          key={ms.id}
                          className={`p-3 rounded-lg border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            ms.isCompleted 
                              ? 'bg-emerald-950/20 border-emerald-800/30' 
                              : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <button
                              onClick={() => updateMilestone(goal.id, ms.id, !ms.isCompleted)}
                              className={`mt-0.5 rounded-full p-0.5 transition-colors ${
                                ms.isCompleted 
                                  ? 'text-emerald-400 bg-emerald-950 border border-emerald-500' 
                                  : 'text-slate-600 hover:text-cyan-400 border border-slate-700'
                              }`}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <div>
                              <div className={`text-sm font-medium ${ms.isCompleted ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                                {idx + 1}. {ms.title}
                              </div>
                              {ms.description && (
                                <div className="text-xs text-slate-500 mt-0.5">
                                  {ms.description}
                                </div>
                              )}
                              {(ms.skillsCovered || []).length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                  {(ms.skillsCovered || []).map((s) => (
                                    <span key={s} className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 sm:text-right shrink-0">
                            <div>
                              <span className="text-xs font-mono font-semibold text-slate-300">
                                {ms.completedHours ?? 0} / {ms.targetHours || 40} hrs
                              </span>
                              {(ms.dueDate || ms.targetDate) && (
                                <div className="text-[10px] text-slate-500">
                                  Target: {ms.dueDate || ms.targetDate}
                                </div>
                              )}
                            </div>
                            <Badge variant={ms.isCompleted ? 'emerald' : 'slate'} size="sm">
                              {ms.isCompleted ? 'Completed' : 'In Progress'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
