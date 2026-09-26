import { Goal, DailyActivityLog, Task, SimulationParameters } from '@/types/nexus';

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal-fullstack',
    title: 'Become an Internship-Ready Full-Stack Developer',
    description: 'Master modern full-stack web engineering with production React/Next.js systems, Node.js REST APIs, SQL database design, and algorithmic problem solving.',
    category: 'Software Engineering',
    startDate: '2026-08-15',
    targetDate: '2027-02-28',
    estimatedRequiredHours: 380,
    priority: 'high',
    status: 'active',
    progressPercentage: 48,
    skills: [
      { id: 'sk-1', name: 'JavaScript & TypeScript', category: 'frontend', currentLevel: 'Advanced', targetLevel: 'Advanced', hoursInvested: 65 },
      { id: 'sk-2', name: 'React & Next.js Ecosystem', category: 'frontend', currentLevel: 'Intermediate', targetLevel: 'Advanced', hoursInvested: 48 },
      { id: 'sk-3', name: 'Node.js & Express APIs', category: 'backend', currentLevel: 'Intermediate', targetLevel: 'Advanced', hoursInvested: 38 },
      { id: 'sk-4', name: 'PostgreSQL & Relational Design', category: 'backend', currentLevel: 'Intermediate', targetLevel: 'Advanced', hoursInvested: 32 },
      { id: 'sk-5', name: 'C++ & Data Structures', category: 'dsa', currentLevel: 'Intermediate', targetLevel: 'Advanced', hoursInvested: 42 },
      { id: 'sk-6', name: 'Git & Deployment Workflows', category: 'devops', currentLevel: 'Intermediate', targetLevel: 'Advanced', hoursInvested: 18 }
    ],
    milestones: [
      {
        id: 'ms-1',
        goalId: 'goal-fullstack',
        title: 'Frontend Foundations & Modern React State',
        targetDate: '2026-09-30',
        weight: 8,
        completionPercentage: 100,
        isCompleted: true,
        tasksCount: 16,
        completedTasksCount: 16
      },
      {
        id: 'ms-2',
        goalId: 'goal-fullstack',
        title: 'Backend Architecture, JWT Auth & SQL Relational Design',
        targetDate: '2026-11-15',
        weight: 9,
        completionPercentage: 75,
        isCompleted: false,
        tasksCount: 20,
        completedTasksCount: 15
      },
      {
        id: 'ms-3',
        goalId: 'goal-fullstack',
        title: 'Production Capstone SaaS Application Deployment',
        targetDate: '2027-01-10',
        weight: 10,
        completionPercentage: 25,
        isCompleted: false,
        tasksCount: 18,
        completedTasksCount: 5
      },
      {
        id: 'ms-4',
        goalId: 'goal-fullstack',
        title: '150 LeetCode Patterns & System Design Drills',
        targetDate: '2027-02-28',
        weight: 9,
        completionPercentage: 35,
        isCompleted: false,
        tasksCount: 25,
        completedTasksCount: 9
      }
    ]
  },
  {
    id: 'goal-cloud',
    title: 'Cloud & DevOps Associate Fundamentals',
    description: 'Learn Docker containerization, AWS basic services (EC2, S3, RDS), and GitHub Actions CI/CD pipelines.',
    category: 'Cloud Engineering',
    startDate: '2026-09-01',
    targetDate: '2027-04-15',
    estimatedRequiredHours: 120,
    priority: 'medium',
    status: 'active',
    progressPercentage: 22,
    skills: [
      { id: 'sk-7', name: 'Docker & Microservices', category: 'devops', currentLevel: 'Beginner', targetLevel: 'Intermediate', hoursInvested: 14 },
      { id: 'sk-8', name: 'AWS Cloud Services', category: 'devops', currentLevel: 'Beginner', targetLevel: 'Intermediate', hoursInvested: 12 }
    ],
    milestones: [
      {
        id: 'ms-5',
        goalId: 'goal-cloud',
        title: 'Dockerizing Full-Stack Services',
        targetDate: '2026-10-31',
        weight: 7,
        completionPercentage: 60,
        isCompleted: false,
        tasksCount: 10,
        completedTasksCount: 6
      },
      {
        id: 'ms-6',
        goalId: 'goal-cloud',
        title: 'Automated CI/CD Pipeline Deployment',
        targetDate: '2026-12-20',
        weight: 8,
        completionPercentage: 0,
        isCompleted: false,
        tasksCount: 8,
        completedTasksCount: 0
      }
    ]
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    goalId: 'goal-fullstack',
    milestoneId: 'ms-2',
    goalTitle: 'Become an Internship-Ready Full-Stack Developer',
    title: 'Implement PostgreSQL Connection Pool & Migration Scripts',
    estimatedMinutes: 60,
    actualMinutes: 65,
    priority: 'high',
    status: 'completed',
    scheduledDate: '2026-09-25',
    completedAt: '2026-09-25T11:30:00Z',
    category: 'Backend'
  },
  {
    id: 'task-2',
    goalId: 'goal-fullstack',
    milestoneId: 'ms-4',
    goalTitle: 'Become an Internship-Ready Full-Stack Developer',
    title: 'Solve 2 Binary Search Trees & Graph BFS Problems in C++',
    estimatedMinutes: 45,
    actualMinutes: 45,
    priority: 'high',
    status: 'completed',
    scheduledDate: '2026-09-25',
    completedAt: '2026-09-25T14:15:00Z',
    category: 'DSA'
  },
  {
    id: 'task-3',
    goalId: 'goal-fullstack',
    milestoneId: 'ms-3',
    goalTitle: 'Become an Internship-Ready Full-Stack Developer',
    title: 'Build Interactive Trajectory Chart with Recharts & Framer Motion',
    estimatedMinutes: 90,
    actualMinutes: undefined,
    priority: 'high',
    status: 'todo',
    scheduledDate: '2026-09-25',
    category: 'Frontend'
  },
  {
    id: 'task-4',
    goalId: 'goal-cloud',
    milestoneId: 'ms-5',
    goalTitle: 'Cloud & DevOps Associate Fundamentals',
    title: 'Write Multi-Stage Dockerfile for Next.js Standalone Build',
    estimatedMinutes: 40,
    actualMinutes: undefined,
    priority: 'medium',
    status: 'todo',
    scheduledDate: '2026-09-25',
    category: 'DevOps'
  },
  {
    id: 'task-5',
    goalId: 'goal-fullstack',
    milestoneId: 'ms-2',
    goalTitle: 'Become an Internship-Ready Full-Stack Developer',
    title: 'Write Integration Tests for Auth Middleware & Session Refresh',
    estimatedMinutes: 50,
    actualMinutes: undefined,
    priority: 'medium',
    status: 'todo',
    scheduledDate: '2026-09-25',
    category: 'Backend'
  }
];

// Generate 28 days of realistic historical activity logs
export function generateInitialActivityLogs(): DailyActivityLog[] {
  const logs: DailyActivityLog[] = [];
  const baseDate = new Date('2026-09-25');

  // Realistic pattern with minor weekend dips and strong weekday focus
  const consistencyPatterns = [
    0.95, 0.90, 0.85, 0.80, 0.90, 0.70, 0.60,
    0.85, 0.95, 0.90, 0.85, 0.90, 0.75, 0.65,
    0.90, 0.85, 0.95, 0.90, 0.80, 0.85, 0.70,
    0.95, 0.90, 0.95, 0.90, 0.85, 0.95, 0.90
  ];

  for (let i = 0; i < 28; i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const consistency = consistencyPatterns[i % consistencyPatterns.length];
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;

    const studyMinutes = isWeekend
      ? Math.round(50 * consistency)
      : Math.round((90 + (i % 4) * 15) * consistency);

    const projectMinutes = isWeekend
      ? Math.round(40 * consistency)
      : Math.round((45 + (i % 3) * 20) * consistency);

    const dsaProblems = isWeekend ? 1 : Math.round(2 + (i % 3));

    logs.push({
      id: `log-seed-${i}`,
      date: dateStr,
      studyMinutes,
      projectMinutes,
      dsaProblems,
      completedTaskIds: ['task-1', 'task-2'],
      plannedTaskIds: ['task-1', 'task-2', 'task-3'],
      consistencyRate: consistency,
      notes: i === 3 ? 'Deep focus flow session: Finished SQL indexing benchmarks' : undefined
    });
  }

  return logs;
}

export const INITIAL_SIMULATION_PARAMETERS: SimulationParameters = {
  dailyStudyHours: 2.2,
  weeklyProjectHours: 10,
  weeklyDSAProblems: 14,
  targetConsistency: 0.86,
  focusFactor: 1.05
};
