export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'completed' | 'skipped' | 'rescheduled' | 'pending';
export type GoalStatus = 'active' | 'completed' | 'paused';
export type TrajectoryStatus = 'accelerating' | 'on_track' | 'behind' | 'critical';
export type ConfidenceLevel = 'Low' | 'Medium' | 'High';
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type TabType = 
  | 'overview' 
  | 'simulation' 
  | 'simulate' 
  | 'whatif' 
  | 'paths' 
  | 'today' 
  | 'tasks' 
  | 'goals' 
  | 'analytics' 
  | 'coach' 
  | 'futureyou' 
  | 'future-you' 
  | 'settings';

export type ThemeId = 'obsidian' | 'midnight' | 'matrix' | 'sunset' | 'light';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  accentHex: string;
  accentClass: string;
  bgHex: string;
  cardBgHex: string;
  particleColors: {
    primary: string;
    secondary: string;
    bg: string;
  };
}

export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'dsa' | 'devops' | 'soft_skills' | 'general';
  currentLevel: SkillLevel;
  targetLevel: SkillLevel;
  hoursInvested: number;
}

export interface Milestone {
  id: string;
  goalId?: string;
  title: string;
  description?: string;
  targetDate?: string;
  dueDate?: string;
  weight?: number; // e.g. 1 to 10
  targetHours?: number;
  completedHours?: number;
  completionPercentage?: number;
  dependencies?: string[];
  isCompleted: boolean;
  tasksCount?: number;
  completedTasksCount?: number;
  order?: number;
  skillsCovered?: string[];
}

export interface Task {
  id: string;
  goalId?: string;
  milestoneId?: string;
  goalTitle?: string;
  title: string;
  estimatedMinutes: number;
  actualMinutes?: number;
  completedMinutes?: number;
  priority: Priority;
  status: TaskStatus;
  scheduledDate?: string; // YYYY-MM-DD
  dueDate?: string;
  completedAt?: string;
  category?: string;
  createdAt?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate?: string; // YYYY-MM-DD
  targetDate?: string; // YYYY-MM-DD
  targetCompletionDate?: string;
  estimatedRequiredHours?: number;
  estimatedHoursTotal?: number;
  completedHoursTotal?: number;
  requiredDailyHours?: number;
  priority?: Priority;
  status?: GoalStatus;
  isActive?: boolean;
  progressPercentage?: number;
  skills?: Skill[];
  skillsToAcquire?: string[];
  milestones: Milestone[];
  createdAt?: string;
}

export interface DailyActivityLog {
  id: string;
  date: string; // YYYY-MM-DD
  studyMinutes: number;
  projectMinutes: number;
  dsaProblems: number;
  completedTaskIds: string[];
  plannedTaskIds: string[];
  consistencyRate: number; // 0 to 1.0
  notes?: string;
  // Optional convenience fields for analytics views
  studyHours?: number;
  projectHours?: number;
  dsaProblemsSolved?: number;
  focusScore?: number;
  completedAllPlanned?: boolean;
}

export interface SimulationParameters {
  dailyStudyHours: number;
  weeklyProjectHours: number;
  weeklyDSAProblems: number;
  targetConsistency: number; // 0.2 to 1.0
  focusFactor: number; // 0.7 to 1.3
  consistencyRate?: number;
}

export interface TimelineNode {
  label: string;
  daysFromNow: number;
  date: string;
  projectedProgress: number;
  expectedMilestones: string[];
  projectedSkills: { name: string; level: SkillLevel }[];
  statusHighlight: string;
}

export interface TrajectoryPoint {
  date: string;
  dayLabel: string;
  requiredProgress: number;
  actualProgress: number | null;
  simulatedProgress: number;
  eventNote?: string;
}

export interface FutureSelfProfile {
  projectedDate: string;
  skills: {
    name: string;
    level: SkillLevel;
    progress: number;
  }[];
  totalHours: number;
  projectsCompleted: number;
  dsaCompleted: number;
  summary: string;
  archetypeTitle: string;
  targetTitle?: string;
  accomplishments?: string[];
  keyHabits?: string[];
}

export interface SimulationResult {
  currentDailyOutputHours: number;
  requiredDailyOutputHours: number;
  projectedCompletionDate: string;
  targetDate: string;
  daysDifference: number; // negative = ahead (saved), positive = delayed
  trajectoryStatus: TrajectoryStatus;
  confidence: ConfidenceLevel;
  confidenceScore: number; // 0-100
  confidenceReason: string;
  consistencyScore: number; // 0-100
  momentumScore: number; // -100 to +100
  timeline: TimelineNode[];
  trajectoryCurve: TrajectoryPoint[];
  futureSelf: FutureSelfProfile;
  calculationExplanation: {
    formula: string;
    totalRequiredHours: number;
    hoursLoggedSoFar: number;
    hoursRemaining: number;
    effectiveDailyVelocity: number;
    projectedDaysNeeded: number;
    consistencyAdjustment: number;
  };
  projectedDate?: string;
  projectedDaysTotal?: number;
  daysVariance?: number;
  confidenceLevel?: ConfidenceLevel;
  consistencyFactor?: number;
  effectiveDailyVelocity?: number;
  trajectoryPoints?: { day: number; requiredCumulativeHours: number; projectedCumulativeHours: number }[];
}

export interface AlternativeScenario {
  id: string;
  name: string;
  dailyHours: number;
  consistencyRate: number;
  projectedDate: string;
  daysSavedOrLost: number;
  tradeoffSummary: string;
  trajectoryPoints: { date: string; progress: number }[];
}

export interface AICoachMessage {
  id: string;
  sender?: 'user' | 'coach' | 'system';
  role?: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  category?: 'bottleneck' | 'recommendation' | 'milestone' | 'momentum';
  actionableStep?: string;
  suggestedActions?: { label: string; actionId: string }[];
}

export interface UserMetricsSummary {
  overallConsistency: number;
  momentum: number;
  weeklyOutputMinutes: number;
  taskCompletionRate: number;
  totalHoursLogged: number;
  streakDays: number;
  activeGoalsCount: number;
  completedMilestonesCount: number;
  trajectoryStatus: TrajectoryStatus;
}
