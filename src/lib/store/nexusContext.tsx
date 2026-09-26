'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Goal,
  Task,
  DailyActivityLog,
  SimulationParameters,
  SimulationResult,
  AlternativeScenario,
  AICoachMessage,
  TaskStatus,
  FutureSelfProfile,
  ThemeId
} from '@/types/nexus';
import { THEMES } from '@/lib/constants/themes';
import {
  INITIAL_GOALS,
  INITIAL_TASKS,
  generateInitialActivityLogs,
  INITIAL_SIMULATION_PARAMETERS
} from '@/lib/data/initialData';
import { runFutureSimulation, generateAlternativeScenarios } from '@/lib/simulation/engine';
import { generateAICoachResponse } from '@/lib/ai/service';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: string;
}

interface NexusContextType {
  // Navigation & View State
  activeView: 'landing' | 'app';
  setActiveView: (view: 'landing' | 'app') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Visual Theme & Performance
  currentTheme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  particlesEnabled: boolean;
  setParticlesEnabled: (enabled: boolean) => void;

  // Data Entities
  goals: Goal[];
  activeGoal: Goal | undefined;
  setActiveGoal: (id: string) => void;
  tasks: Task[];
  activityLogs: DailyActivityLog[];
  dailyLogs: DailyActivityLog[];
  simulationParams: SimulationParameters;
  parameters: SimulationParameters;
  simulationResult: SimulationResult;
  alternativeScenarios: AlternativeScenario[];
  aiCoachMessages: AICoachMessage[];
  coachMessages: AICoachMessage[];
  isCoachThinking: boolean;
  momentum: number;
  confidence: string;
  futureSelf: FutureSelfProfile;

  // Modals & Panels
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isNewGoalModalOpen: boolean;
  setIsNewGoalModalOpen: (open: boolean) => void;
  isNewTaskModalOpen: boolean;
  setIsNewTaskModalOpen: (open: boolean) => void;
  isExplanationModalOpen: boolean;
  setIsExplanationModalOpen: (open: boolean) => void;

  isModalOpen: {
    search: boolean;
    onboarding: boolean;
    newGoal: boolean;
    newTask: boolean;
    explanation: boolean;
  };
  openModal: (modal: 'search' | 'onboarding' | 'newGoal' | 'newTask' | 'explanation') => void;
  closeModal: (modal: 'search' | 'onboarding' | 'newGoal' | 'newTask' | 'explanation') => void;

  // Notifications
  notifications: NotificationItem[];
  addNotification: (n: { title: string; message: string; type?: 'info' | 'success' | 'warning' }) => void;
  dismissNotification: (id: string) => void;

  // Actions
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  updateMilestone: (goalId: string, milestoneId: string, isCompleted: boolean) => void;

  addTask: (task: Task) => void;
  toggleTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  deleteTask: (taskId: string) => void;

  updateSimulationParams: (params: Partial<SimulationParameters>) => void;
  updateParameters: (params: Partial<SimulationParameters>) => void;
  sendAICoachMessage: (text: string) => Promise<void>;
  addCoachMessage: (msg: AICoachMessage) => void;
  clearCoachChat: () => void;

  logTodayActivity: (studyMinutes: number, projectMinutes: number, dsaProblems: number) => void;
  resetToDefaultData: () => void;
  resetToDemo: () => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
}

const NexusContext = createContext<NexusContextType | undefined>(undefined);

const STORAGE_KEYS = {
  GOALS: 'nexus_goals_v1',
  TASKS: 'nexus_tasks_v1',
  LOGS: 'nexus_logs_v1',
  PARAMS: 'nexus_params_v1',
  COACH: 'nexus_coach_v1',
  DEMO: 'nexus_demo_v1',
  THEME: 'nexus_theme_v1',
  PARTICLES: 'nexus_particles_v1'
};

export function NexusProvider({ children }: { children: React.ReactNode }) {
  // Navigation
  const [activeView, setActiveView] = useState<'landing' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Theme & Particle State
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('obsidian');
  const [particlesEnabled, setParticlesEnabled] = useState<boolean>(true);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isExplanationModalOpen, setIsExplanationModalOpen] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-welcome',
      title: 'Simulation Online',
      message: 'Full-Stack Developer 28-day telemetry dataset loaded.',
      type: 'info',
      timestamp: new Date().toISOString()
    }
  ]);

  // Core State
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activityLogs, setActivityLogs] = useState<DailyActivityLog[]>([]);
  const [simulationParams, setSimulationParams] = useState<SimulationParameters>(INITIAL_SIMULATION_PARAMETERS);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isCoachThinking, setIsCoachThinking] = useState(false);

  // Initial Coach Messages
  const [aiCoachMessages, setAiCoachMessages] = useState<AICoachMessage[]>([
    {
      id: 'coach-init-1',
      sender: 'coach',
      role: 'assistant',
      timestamp: new Date().toISOString(),
      category: 'momentum',
      content:
        'Welcome to NEXUS. I am your telemetry diagnostic coach. I do not deal in vague motivation; I analyze your raw habits, completed milestones, and pacing velocity to reveal your true future trajectory.',
      actionableStep:
        'Try asking: "Why am I on track?" or "What should I focus on this week?" to stress-test your current roadmap.',
      suggestedActions: [
        { label: 'Explore What-If Sandbox', actionId: 'whatif' },
        { label: 'Review Today Action Items', actionId: 'tasks' }
      ]
    }
  ]);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const savedGoals = localStorage.getItem(STORAGE_KEYS.GOALS);
      const savedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
      const savedLogs = localStorage.getItem(STORAGE_KEYS.LOGS);
      const savedParams = localStorage.getItem(STORAGE_KEYS.PARAMS);
      const savedCoach = localStorage.getItem(STORAGE_KEYS.COACH);
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeId | null;
      const savedParticles = localStorage.getItem(STORAGE_KEYS.PARTICLES);

      if (savedGoals) setGoals(JSON.parse(savedGoals));
      if (savedTasks) setTasks(JSON.parse(savedTasks));
      if (savedLogs) {
        setActivityLogs(JSON.parse(savedLogs));
      } else {
        setActivityLogs(generateInitialActivityLogs());
      }
      if (savedParams) setSimulationParams(JSON.parse(savedParams));
      if (savedCoach) setAiCoachMessages(JSON.parse(savedCoach));
      if (savedTheme && THEMES[savedTheme]) setCurrentTheme(savedTheme);
      if (savedParticles !== null) setParticlesEnabled(savedParticles === 'true');
    } catch (e) {
      console.warn('LocalStorage initialization notice:', e);
      setActivityLogs(generateInitialActivityLogs());
    }
  }, []);

  // Sync theme to document body
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', currentTheme);
      const config = THEMES[currentTheme];
      if (config) {
        document.body.style.backgroundColor = config.bgHex;
      }
    }
  }, [currentTheme]);

  // Save to LocalStorage on updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(activityLogs));
      localStorage.setItem(STORAGE_KEYS.PARAMS, JSON.stringify(simulationParams));
      localStorage.setItem(STORAGE_KEYS.COACH, JSON.stringify(aiCoachMessages));
      localStorage.setItem(STORAGE_KEYS.THEME, currentTheme);
      localStorage.setItem(STORAGE_KEYS.PARTICLES, String(particlesEnabled));
    } catch (e) {
      console.warn('Failed to persist to localStorage:', e);
    }
  }, [goals, tasks, activityLogs, simulationParams, aiCoachMessages, currentTheme, particlesEnabled]);

  // Modal helpers
  const isModalOpen = useMemo(() => ({
    search: isSearchOpen,
    onboarding: isOnboardingOpen,
    newGoal: isNewGoalModalOpen,
    newTask: isNewTaskModalOpen,
    explanation: isExplanationModalOpen,
  }), [isSearchOpen, isOnboardingOpen, isNewGoalModalOpen, isNewTaskModalOpen, isExplanationModalOpen]);

  const openModal = (modal: 'search' | 'onboarding' | 'newGoal' | 'newTask' | 'explanation') => {
    if (modal === 'search') setIsSearchOpen(true);
    if (modal === 'onboarding') setIsOnboardingOpen(true);
    if (modal === 'newGoal') setIsNewGoalModalOpen(true);
    if (modal === 'newTask') setIsNewTaskModalOpen(true);
    if (modal === 'explanation') setIsExplanationModalOpen(true);
  };

  const closeModal = (modal: 'search' | 'onboarding' | 'newGoal' | 'newTask' | 'explanation') => {
    if (modal === 'search') setIsSearchOpen(false);
    if (modal === 'onboarding') setIsOnboardingOpen(false);
    if (modal === 'newGoal') setIsNewGoalModalOpen(false);
    if (modal === 'newTask') setIsNewTaskModalOpen(false);
    if (modal === 'explanation') setIsExplanationModalOpen(false);
  };

  const addNotification = (n: { title: string; message: string; type?: 'info' | 'success' | 'warning' }) => {
    const newItem: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: n.title,
      message: n.message,
      type: n.type || 'info',
      timestamp: new Date().toISOString()
    };
    setNotifications((prev) => [newItem, ...prev.slice(0, 9)]);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  // Keyboard Shortcuts (Cmd/Ctrl + K, N, G, S, A, C, W)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K => Open Global Search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
        return;
      }

      // Ignore single-key shortcuts if typing in input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsNewGoalModalOpen(false);
        setIsNewTaskModalOpen(false);
        setIsExplanationModalOpen(false);
        setIsOnboardingOpen(false);
        return;
      }

      if (activeView === 'app') {
        switch (e.key.toLowerCase()) {
          case 'n':
            e.preventDefault();
            setIsNewTaskModalOpen(true);
            break;
          case 'g':
            e.preventDefault();
            setActiveTab('goals');
            break;
          case 's':
            e.preventDefault();
            setActiveTab('simulation');
            break;
          case 'a':
            e.preventDefault();
            setActiveTab('analytics');
            break;
          case 'c':
            e.preventDefault();
            setActiveTab('coach');
            break;
          case 'w':
            e.preventDefault();
            setActiveTab('whatif');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeView]);

  // Normalized logs with helper fields for charts
  const normalizedLogs = useMemo(() => {
    return activityLogs.map((log) => ({
      ...log,
      studyHours: log.studyHours ?? Number((log.studyMinutes / 60).toFixed(1)),
      projectHours: log.projectHours ?? Number((log.projectMinutes / 60).toFixed(1)),
      dsaProblemsSolved: log.dsaProblemsSolved ?? log.dsaProblems,
      focusScore: log.focusScore ?? 0.88,
      completedAllPlanned: log.completedAllPlanned ?? (log.consistencyRate >= 0.75),
    }));
  }, [activityLogs]);

  // Derived Reactive Simulation Engine Result
  const rawSimulationResult = useMemo(() => {
    return runFutureSimulation(goals, activityLogs, simulationParams);
  }, [goals, activityLogs, simulationParams]);

  // Enhanced SimulationResult with convenience fields
  const simulationResult = useMemo<SimulationResult>(() => {
    const res = { ...rawSimulationResult };
    res.projectedDate = res.projectedCompletionDate;
    res.projectedDaysTotal = res.calculationExplanation.projectedDaysNeeded;
    res.daysVariance = res.daysDifference;
    res.confidenceLevel = res.confidence;
    res.consistencyFactor = res.consistencyScore / 100;
    res.effectiveDailyVelocity = res.calculationExplanation.effectiveDailyVelocity;

    const totalHours = goals[0]?.estimatedRequiredHours || goals[0]?.estimatedHoursTotal || 450;
    res.trajectoryPoints = res.timeline.map((node) => ({
      day: node.daysFromNow,
      requiredCumulativeHours: Math.round((node.projectedProgress / 100) * totalHours),
      projectedCumulativeHours: Math.round((node.projectedProgress / 100) * totalHours),
    }));

    if (!res.futureSelf.targetTitle) {
      res.futureSelf.targetTitle = goals[0]?.title || 'Full-Stack Software Engineer (L4 equivalent)';
    }
    if (!res.futureSelf.accomplishments) {
      res.futureSelf.accomplishments = [
        '3 Production SaaS applications architected & deployed with end-to-end tests',
        '150+ LeetCode DSA algorithmic challenges mastered across trees, graphs, and dynamic programming',
        'Distributed systems knowledge: Redis caching, Docker, PostgreSQL indexing, and CI/CD pipelines',
        'Comprehensive technical portfolio showcasing deterministic telemetry engineering'
      ];
    }
    if (!res.futureSelf.keyHabits) {
      res.futureSelf.keyHabits = [
        'Uninterrupted 3.2-hour morning deep work block sustained 6 days/week',
        'Zero context-switching during core engineering sprint sessions',
        'Weekly architectural review and test-driven code refactoring cadence',
        'Active problem decomposition before writing implementation code'
      ];
    }

    return res;
  }, [rawSimulationResult, goals]);

  // Derived Alternative Scenarios (Path A, B, C)
  const alternativeScenarios = useMemo(() => {
    return generateAlternativeScenarios(goals, activityLogs);
  }, [goals, activityLogs]);

  const activeGoal = useMemo(() => {
    return goals.find((g) => g.isActive) || goals[0];
  }, [goals]);

  const setActiveGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => ({
        ...g,
        isActive: g.id === id,
      }))
    );
  };

  // Actions
  const addGoal = (newGoal: Goal) => {
    setGoals((prev) => [newGoal, ...prev]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const updateMilestone = (goalId: string, milestoneId: string, isCompleted: boolean) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const updatedMilestones = g.milestones.map((m) =>
          m.id === milestoneId ? { ...m, isCompleted } : m
        );
        const completedMilestones = updatedMilestones.filter((m) => m.isCompleted).length;
        const pct = Math.round((completedMilestones / (updatedMilestones.length || 1)) * 100);
        return {
          ...g,
          milestones: updatedMilestones,
          progressPercentage: pct,
        };
      })
    );
  };

  const addTask = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isDone = newStatus === 'completed';
          return {
            ...t,
            status: newStatus,
            completedAt: isDone ? new Date().toISOString() : undefined,
            actualMinutes: isDone ? t.actualMinutes || t.estimatedMinutes : undefined,
          };
        }
        return t;
      })
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const updateSimulationParams = (newParams: Partial<SimulationParameters>) => {
    setSimulationParams((prev) => ({ ...prev, ...newParams }));
  };

  const addCoachMessage = (msg: AICoachMessage) => {
    setAiCoachMessages((prev) => [...prev, msg]);
  };

  const clearCoachChat = () => {
    setAiCoachMessages([
      {
        id: `coach-reset-${Date.now()}`,
        sender: 'coach',
        role: 'assistant',
        timestamp: new Date().toISOString(),
        content: 'Telemetry log reset. Ask any question to analyze your updated habit velocity.',
      },
    ]);
  };

  const sendAICoachMessage = async (text: string) => {
    const userMsg: AICoachMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      role: 'user',
      timestamp: new Date().toISOString(),
      content: text,
    };

    setAiCoachMessages((prev) => [...prev, userMsg]);
    setIsCoachThinking(true);

    try {
      const response = await generateAICoachResponse(
        text,
        normalizedLogs,
        simulationResult,
        activeGoal
      );
      setAiCoachMessages((prev) => [
        ...prev,
        {
          id: `coach-${Date.now()}`,
          sender: 'coach',
          role: 'assistant',
          timestamp: new Date().toISOString(),
          content: response.content,
          suggestedActions: response.suggestedActions,
        },
      ]);
    } catch {
      setAiCoachMessages((prev) => [
        ...prev,
        {
          id: `coach-err-${Date.now()}`,
          sender: 'coach',
          role: 'assistant',
          timestamp: new Date().toISOString(),
          content: 'Unable to stream diagnostic response. Your deterministic engine parameters remain valid.',
        },
      ]);
    } finally {
      setIsCoachThinking(false);
    }
  };

  const logTodayActivity = (studyMinutes: number, projectMinutes: number, dsaProblems: number) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setActivityLogs((prev) => {
      const existingIdx = prev.findIndex((l) => l.date === todayStr);
      const newEntry: DailyActivityLog = {
        id: `log-${Date.now()}`,
        date: todayStr,
        studyMinutes,
        projectMinutes,
        dsaProblems,
        studyHours: Number((studyMinutes / 60).toFixed(1)),
        projectHours: Number((projectMinutes / 60).toFixed(1)),
        dsaProblemsSolved: dsaProblems,
        focusScore: 0.9,
        completedAllPlanned: true,
        completedTaskIds: tasks.filter((t) => t.status === 'completed').map((t) => t.id),
        plannedTaskIds: tasks.map((t) => t.id),
        consistencyRate: Math.min(1.0, (studyMinutes + projectMinutes) / (simulationParams.dailyStudyHours * 60)),
      };

      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = newEntry;
        return updated;
      }
      return [newEntry, ...prev];
    });
  };

  const resetToDefaultData = () => {
    setGoals(INITIAL_GOALS);
    setTasks(INITIAL_TASKS);
    setActivityLogs(generateInitialActivityLogs());
    setSimulationParams(INITIAL_SIMULATION_PARAMETERS);
    setAiCoachMessages([
      {
        id: 'coach-reset',
        sender: 'coach',
        role: 'assistant',
        timestamp: new Date().toISOString(),
        category: 'momentum',
        content: 'Telemetry state has been reset to the baseline Full-Stack Developer demo scenario.',
        actionableStep: 'Inspect the Trajectory Graph and run a simulation to see projected timeline milestones.',
      },
    ]);
  };

  return (
    <NexusContext.Provider
      value={{
        activeView,
        setActiveView,
        activeTab,
        setActiveTab,
        goals,
        activeGoal,
        setActiveGoal,
        tasks,
        activityLogs: normalizedLogs,
        dailyLogs: normalizedLogs,
        simulationParams,
        parameters: simulationParams,
        simulationResult,
        alternativeScenarios,
        aiCoachMessages,
        coachMessages: aiCoachMessages,
        isCoachThinking,
        momentum: simulationResult.momentumScore,
        confidence: simulationResult.confidence,
        futureSelf: simulationResult.futureSelf,

        currentTheme,
        setTheme: setCurrentTheme,
        particlesEnabled,
        setParticlesEnabled,

        isSearchOpen,
        setIsSearchOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isNewGoalModalOpen,
        setIsNewGoalModalOpen,
        isNewTaskModalOpen,
        setIsNewTaskModalOpen,
        isExplanationModalOpen,
        setIsExplanationModalOpen,

        isModalOpen,
        openModal,
        closeModal,

        notifications,
        addNotification,
        dismissNotification,

        addGoal,
        updateGoal,
        deleteGoal,
        updateMilestone,
        addTask,
        toggleTaskStatus,
        deleteTask,
        updateSimulationParams,
        updateParameters: updateSimulationParams,
        sendAICoachMessage,
        addCoachMessage,
        clearCoachChat,
        logTodayActivity,
        resetToDefaultData,
        resetToDemo: resetToDefaultData,
        isDemoMode,
        setIsDemoMode,
      }}
    >
      {children}
    </NexusContext.Provider>
  );
}

export function useNexus() {
  const context = useContext(NexusContext);
  if (!context) {
    throw new Error('useNexus must be used within a NexusProvider');
  }
  return context;
}
