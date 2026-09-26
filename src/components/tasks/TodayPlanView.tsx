'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Plus,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Target,
  ArrowRight,
  Flame,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react';
import { useNexus } from '@/lib/store/nexusContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Task, TaskStatus } from '@/types/nexus';

export function TodayPlanView() {
  const {
    tasks,
    toggleTaskStatus,
    deleteTask,
    setIsNewTaskModalOpen,
    logTodayActivity
  } = useNexus();

  // Focus Timer State (Pomodoro / Deep Work Session)
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [sessionMinutesLogged, setSessionMinutesLogged] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            setSessionMinutesLogged((m) => m + 25);
            logTodayActivity(25, 0, 0);
            return 25 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, logTodayActivity]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const totalCount = tasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              Daily Habit Execution
            </span>
            <Badge variant="cyan">TODAY&apos;S SPRINT</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Today&apos;s Execution Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Execute today&apos;s micro-habits. Every marked task directly reinforces your mathematical
            velocity and tightens your projected goal completion window.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsNewTaskModalOpen(true)}
          >
            Create Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Tasks List (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <CalendarCheck className="w-4 h-4 text-cyan-400" />
              <span>
                Completed: <strong>{completedCount}</strong> of <strong>{totalCount}</strong>
              </span>
            </div>
            <span className="font-mono font-bold text-cyan-300">
              {completionPercentage}% Target Met
            </span>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => {
              const isCompleted = task.status === 'completed';
              const isSkipped = task.status === 'skipped';

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCompleted
                      ? 'bg-slate-900/40 border-slate-800/60 opacity-65'
                      : isSkipped
                      ? 'bg-rose-950/20 border-rose-900/40 opacity-60'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <button
                        onClick={() =>
                          toggleTaskStatus(task.id, isCompleted ? 'todo' : 'completed')
                        }
                        className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                          isCompleted
                            ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-sm'
                            : 'border-slate-600 hover:border-cyan-400'
                        }`}
                        aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {isCompleted && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                      </button>

                      <div className="space-y-1 min-w-0">
                        <p
                          className={`text-sm font-semibold leading-snug ${
                            isCompleted ? 'text-slate-400 line-through' : 'text-slate-100'
                          }`}
                        >
                          {task.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {task.estimatedMinutes}m est.
                          </span>
                          <span>&bull;</span>
                          <span className="text-cyan-400/90 truncate max-w-[200px]">
                            {task.goalTitle}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <select
                        value={task.status}
                        onChange={(e) =>
                          toggleTaskStatus(task.id, e.target.value as TaskStatus)
                        }
                        className="bg-slate-800/80 border border-slate-700 rounded-lg text-[11px] text-slate-300 py-1 px-2 focus:outline-none cursor-pointer"
                      >
                        <option value="todo">To-Do</option>
                        <option value="completed">Completed</option>
                        <option value="skipped">Skipped</option>
                        <option value="rescheduled">Reschedule</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Work Focus Timer & Daily Log (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Deep Work Focus Timer Card */}
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-7 shadow-xl space-y-6 text-center">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
              <span className="uppercase font-mono">Focus Sprint</span>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="hover:text-white transition-colors"
                title="Toggle audio cues"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-5xl sm:text-6xl font-extrabold font-mono text-white tracking-wider">
                {formatTimer(timerSeconds)}
              </div>
              <p className="text-xs text-slate-400">
                25-minute deep focus block &bull; Auto-records session telemetry
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Button
                variant={timerRunning ? 'danger' : 'primary'}
                size="md"
                onClick={() => setTimerRunning(!timerRunning)}
                icon={timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                className="w-36"
              >
                {timerRunning ? 'Pause' : 'Start Focus'}
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setTimerRunning(false);
                  setTimerSeconds(25 * 60);
                }}
                icon={<RotateCcw className="w-4 h-4" />}
              >
                Reset
              </Button>
            </div>

            {sessionMinutesLogged > 0 && (
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300">
                ✓ Recorded {sessionMinutesLogged} mins to today&apos;s trajectory log!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
