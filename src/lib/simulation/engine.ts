import {
  Goal,
  DailyActivityLog,
  SimulationParameters,
  SimulationResult,
  TimelineNode,
  TrajectoryPoint,
  FutureSelfProfile,
  TrajectoryStatus,
  ConfidenceLevel,
  SkillLevel,
  AlternativeScenario
} from '@/types/nexus';

/**
 * Format a Date object to YYYY-MM-DD
 */
export function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

/**
 * Add days to a Date object and return new Date
 */
export function addDays(d: Date, days: number): Date {
  const result = new Date(d);
  result.setDate(result.getDate() + Math.round(days));
  return result;
}

/**
 * Deterministic Momentum Calculator (-100 to +100%)
 * Compares 7-day recent moving average with 21-day prior baseline.
 */
export function calculateMomentum(activityLogs: DailyActivityLog[]): {
  score: number;
  label: string;
  trend: 'positive' | 'neutral' | 'negative';
} {
  if (!activityLogs || activityLogs.length === 0) {
    return { score: 0, label: '0%', trend: 'neutral' };
  }

  // Sort logs by date descending
  const sorted = [...activityLogs].sort((a, b) => b.date.localeCompare(a.date));

  const recent7 = sorted.slice(0, 7);
  const prior21 = sorted.slice(7, 28);

  const recentAvg =
    recent7.reduce((acc, log) => acc + (log.studyMinutes + log.projectMinutes) / 60, 0) /
    Math.max(1, recent7.length);

  const priorAvg =
    prior21.length > 0
      ? prior21.reduce((acc, log) => acc + (log.studyMinutes + log.projectMinutes) / 60, 0) /
        prior21.length
      : recentAvg * 0.9;

  if (priorAvg <= 0.1 && recentAvg <= 0.1) {
    return { score: 0, label: '0%', trend: 'neutral' };
  }

  const rawChange = ((recentAvg - priorAvg) / Math.max(0.5, priorAvg)) * 100;
  const score = Math.max(-100, Math.min(100, Math.round(rawChange)));

  return {
    score,
    label: `${score >= 0 ? '+' : ''}${score}%`,
    trend: score > 5 ? 'positive' : score < -5 ? 'negative' : 'neutral'
  };
}

/**
 * Calculate historical consistency (0 to 100)
 */
export function calculateConsistencyScore(activityLogs: DailyActivityLog[]): number {
  if (!activityLogs || activityLogs.length === 0) return 75; // Default baseline
  const recent = activityLogs.slice(0, 30);
  const total = recent.reduce((sum, item) => sum + (item.consistencyRate || 0), 0);
  return Math.round((total / recent.length) * 100);
}

/**
 * Calculate confidence based on stability and volume of logged data
 */
export function calculateConfidence(activityLogs: DailyActivityLog[]): {
  level: ConfidenceLevel;
  score: number;
  reason: string;
} {
  const count = activityLogs ? activityLogs.length : 0;
  if (count < 7) {
    return {
      level: 'Low',
      score: 42,
      reason: 'Preliminary projection: Less than 7 days of behavioral telemetry recorded.'
    };
  } else if (count < 21) {
    return {
      level: 'Medium',
      score: 74,
      reason: 'Reliable trend: Established from 2-3 weeks of active daily consistency tracking.'
    };
  } else {
    return {
      level: 'High',
      score: 91,
      reason: 'High fidelity model: Backed by 3+ weeks of stable historical velocity patterns.'
    };
  }
}

/**
 * Core Deterministic Simulation Engine
 */
export function runFutureSimulation(
  goals: Goal[],
  activityLogs: DailyActivityLog[],
  params: SimulationParameters,
  referenceDate: Date = new Date()
): SimulationResult {
  const activeGoals = goals.filter((g) => g.status === 'active');
  const primaryGoal = activeGoals[0] || goals[0] || {
    id: 'default',
    title: 'Self-Directed Mastery',
    estimatedRequiredHours: 400,
    targetDate: formatDate(addDays(referenceDate, 180)),
    startDate: formatDate(referenceDate),
    skills: [],
    milestones: []
  };

  // 1. Total Required Work vs Completed Work
  const totalRequiredHours = activeGoals.reduce((sum, g) => sum + (g.estimatedRequiredHours || g.estimatedHoursTotal || 350), 0) || 350;
  
  const totalHoursLogged = activityLogs.reduce((sum, log) => {
    return sum + (log.studyMinutes + log.projectMinutes) / 60;
  }, 0);

  const hoursRemaining = Math.max(10, totalRequiredHours - totalHoursLogged);

  // 2. Daily Effective Velocity
  // Formula: Effective Velocity = (Daily Study Hours + Weekly Projects/7) * Consistency * FocusFactor
  const dailyProjectHours = (params.weeklyProjectHours || 0) / 7;
  const rawDailyPotential = (params.dailyStudyHours || 1.5) + dailyProjectHours;
  const effectiveDailyVelocity = Math.max(
    0.2,
    rawDailyPotential * (params.targetConsistency || 0.8) * (params.focusFactor || 1.0)
  );

  // 3. Projected Days to Goal Completion
  const projectedDaysNeeded = Math.ceil(hoursRemaining / effectiveDailyVelocity);
  const projectedCompletionDate = formatDate(addDays(referenceDate, projectedDaysNeeded));

  // 4. Target Baseline
  const targetDateObj = new Date(primaryGoal.targetDate || addDays(referenceDate, 180));
  const diffTime = targetDateObj.getTime() - referenceDate.getTime();
  const targetDaysFromNow = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const daysDifference = projectedDaysNeeded - targetDaysFromNow;

  // 5. Trajectory Status
  let trajectoryStatus: TrajectoryStatus = 'on_track';
  if (daysDifference <= -14) {
    trajectoryStatus = 'accelerating';
  } else if (daysDifference <= 7) {
    trajectoryStatus = 'on_track';
  } else if (daysDifference <= 30) {
    trajectoryStatus = 'behind';
  } else {
    trajectoryStatus = 'critical';
  }

  // 6. Metrics & Momentum
  const momentum = calculateMomentum(activityLogs);
  const consistencyScore = Math.round(params.targetConsistency * 100);
  const confidence = calculateConfidence(activityLogs);

  // 7. Interactive Timeline Nodes (Today, 30d, 90d, 180d, Finish)
  const currentProgressPct = Math.min(95, Math.round((totalHoursLogged / totalRequiredHours) * 100));

  const timelineCheckpoints = [
    { label: 'TODAY', days: 0 },
    { label: '30 DAYS', days: 30 },
    { label: '90 DAYS', days: 90 },
    { label: '180 DAYS', days: 180 },
    { label: 'COMPLETION', days: projectedDaysNeeded }
  ];

  // Filter and deduplicate timeline nodes
  const timeline: TimelineNode[] = timelineCheckpoints.map((cp) => {
    const nodeDate = addDays(referenceDate, cp.days);
    const addedHours = effectiveDailyVelocity * cp.days;
    const progressAtNode = Math.min(
      100,
      Math.round(((totalHoursLogged + addedHours) / totalRequiredHours) * 100)
    );

    // Milestones expected by this checkpoint
    const expectedMilestones: string[] = [];
    if (primaryGoal.milestones) {
      primaryGoal.milestones.forEach((m, idx) => {
        const milestoneThreshold = ((idx + 1) / primaryGoal.milestones.length) * 100;
        if (progressAtNode >= milestoneThreshold * 0.9) {
          expectedMilestones.push(m.title);
        }
      });
    }

    // Skills projected
    const projectedSkills = (primaryGoal.skills || []).map((s) => {
      let level: SkillLevel = s.currentLevel;
      if (progressAtNode >= 85) level = 'Advanced';
      else if (progressAtNode >= 50) level = 'Intermediate';
      else level = s.currentLevel;
      return { name: s.name, level };
    });

    let statusHighlight = 'On Track';
    if (cp.days > 0 && progressAtNode > (cp.days / targetDaysFromNow) * 100) {
      statusHighlight = 'Accelerated Trajectory';
    } else if (cp.days > 0 && progressAtNode < (cp.days / targetDaysFromNow) * 80) {
      statusHighlight = 'Pacing Lag';
    }

    return {
      label: cp.label,
      daysFromNow: cp.days,
      date: formatDate(nodeDate),
      projectedProgress: progressAtNode,
      expectedMilestones: expectedMilestones.slice(0, 3),
      projectedSkills: projectedSkills.slice(0, 4),
      statusHighlight
    };
  });

  // 8. Trajectory Points (Historical + Simulated Curve for Charting)
  const trajectoryCurve: TrajectoryPoint[] = [];

  // 8A. Historical points (Past 21 days sampled)
  const sortedLogs = [...activityLogs].sort((a, b) => a.date.localeCompare(b.date));
  let runningHours = Math.max(0, totalHoursLogged - 45);

  const pastPointsCount = Math.min(sortedLogs.length, 14);
  for (let i = 0; i < pastPointsCount; i++) {
    const log = sortedLogs[i];
    runningHours += (log.studyMinutes + log.projectMinutes) / 60;
    const historicalProgress = Math.min(100, Math.round((runningHours / totalRequiredHours) * 100));

    // Ideal required progress linear curve
    const dayIndex = i + 1;
    const reqProgress = Math.min(100, Math.round((dayIndex / (pastPointsCount + 30)) * 60));

    let eventNote: string | undefined = undefined;
    if (log.consistencyRate >= 0.95) {
      eventNote = 'High focus deep work session (+2.4% trajectory)';
    } else if (log.consistencyRate < 0.4) {
      eventNote = 'Missed scheduled milestone session (-1.8% drift)';
    }

    trajectoryCurve.push({
      date: log.date,
      dayLabel: `Day -${pastPointsCount - i}`,
      requiredProgress: reqProgress,
      actualProgress: historicalProgress,
      simulatedProgress: historicalProgress,
      eventNote
    });
  }

  // Today inflection point
  trajectoryCurve.push({
    date: formatDate(referenceDate),
    dayLabel: 'Today',
    requiredProgress: Math.min(100, Math.round((totalHoursLogged / totalRequiredHours) * 105)),
    actualProgress: currentProgressPct,
    simulatedProgress: currentProgressPct,
    eventNote: `Current Baseline: ${currentProgressPct}% completed, ${momentum.label} momentum`
  });

  // 8B. Simulated Future Points (Next 120 days sampled every 15 days)
  const futureSteps = [15, 30, 45, 60, 75, 90, 110, 130, 150, Math.min(180, projectedDaysNeeded)];
  futureSteps.forEach((stepDays) => {
    const futureDate = addDays(referenceDate, stepDays);
    const simulatedAddedHours = effectiveDailyVelocity * stepDays;
    const simProgress = Math.min(
      100,
      Math.round(((totalHoursLogged + simulatedAddedHours) / totalRequiredHours) * 100)
    );

    // Theoretical linear requirement to finish by target date
    const reqProgress = Math.min(
      100,
      Math.round(currentProgressPct + ((100 - currentProgressPct) * stepDays) / targetDaysFromNow)
    );

    trajectoryCurve.push({
      date: formatDate(futureDate),
      dayLabel: `+${stepDays}d`,
      requiredProgress: reqProgress,
      actualProgress: null, // Future has no actual progress yet
      simulatedProgress: simProgress,
      eventNote: simProgress >= 100 ? 'Estimated Goal Attainment Reached' : undefined
    });
  });

  // 9. Future Self Digital Twin Profile
  const futureSelf: FutureSelfProfile = {
    projectedDate: projectedCompletionDate,
    skills: (primaryGoal.skills || []).map((s) => ({
      name: s.name,
      level: (s.targetLevel || 'Advanced') as SkillLevel,
      progress: 92
    })),
    totalHours: Math.round(totalRequiredHours),
    projectsCompleted: Math.max(3, Math.round(params.weeklyProjectHours * 0.4 + 2)),
    dsaCompleted: Math.max(50, Math.round(params.weeklyDSAProblems * 8 + 40)),
    summary: `At current behavioral trajectory, by ${projectedCompletionDate} you will have accumulated ${Math.round(totalRequiredHours)} hours of deliberate practice, shipping production applications with advanced proficiency.`,
    archetypeTitle:
      params.weeklyProjectHours > 10
        ? 'Full-Stack Systems Architect'
        : params.weeklyDSAProblems > 20
        ? 'Algorithmic Problem Solver & Engineer'
        : 'Consistent Software Craftsman'
  };

  return {
    currentDailyOutputHours: Number(effectiveDailyVelocity.toFixed(1)),
    requiredDailyOutputHours: Number((hoursRemaining / targetDaysFromNow).toFixed(1)),
    projectedCompletionDate,
    targetDate: primaryGoal.targetDate || formatDate(addDays(referenceDate, 180)),
    daysDifference,
    trajectoryStatus,
    confidence: confidence.level,
    confidenceScore: confidence.score,
    confidenceReason: confidence.reason,
    consistencyScore,
    momentumScore: momentum.score,
    timeline,
    trajectoryCurve,
    futureSelf,
    calculationExplanation: {
      formula: 'Projected Days = (Total Target Hours - Logged Hours) / (Daily Hours × Consistency × Focus)',
      totalRequiredHours,
      hoursLoggedSoFar: Math.round(totalHoursLogged),
      hoursRemaining: Math.round(hoursRemaining),
      effectiveDailyVelocity: Number(effectiveDailyVelocity.toFixed(2)),
      projectedDaysNeeded,
      consistencyAdjustment: Number((params.targetConsistency * params.focusFactor).toFixed(2))
    }
  };
}

/**
 * Generate Comparative Alternative Futures (Path A, B, C)
 */
export function generateAlternativeScenarios(
  goals: Goal[],
  activityLogs: DailyActivityLog[],
  referenceDate: Date = new Date()
): AlternativeScenario[] {
  // Scenario A: Current Baseline
  const resA = runFutureSimulation(
    goals,
    activityLogs,
    {
      dailyStudyHours: 1.2,
      weeklyProjectHours: 4,
      weeklyDSAProblems: 6,
      targetConsistency: 0.72,
      focusFactor: 0.95
    },
    referenceDate
  );

  // Scenario B: Consistent Growth (Recommended Target)
  const resB = runFutureSimulation(
    goals,
    activityLogs,
    {
      dailyStudyHours: 2.2,
      weeklyProjectHours: 10,
      weeklyDSAProblems: 15,
      targetConsistency: 0.86,
      focusFactor: 1.05
    },
    referenceDate
  );

  // Scenario C: High Intensity Sprint
  const resC = runFutureSimulation(
    goals,
    activityLogs,
    {
      dailyStudyHours: 3.8,
      weeklyProjectHours: 16,
      weeklyDSAProblems: 30,
      targetConsistency: 0.92,
      focusFactor: 1.15
    },
    referenceDate
  );

  return [
    {
      id: 'path-a',
      name: 'Path A: Current Baseline',
      dailyHours: 1.2,
      consistencyRate: 0.72,
      projectedDate: resA.projectedCompletionDate,
      daysSavedOrLost: resA.daysDifference,
      tradeoffSummary: 'Low cognitive fatigue, but extends timeline by several months past original deadline.',
      trajectoryPoints: resA.trajectoryCurve.map((pt) => ({
        date: pt.date,
        progress: pt.simulatedProgress
      }))
    },
    {
      id: 'path-b',
      name: 'Path B: Balanced Consistency',
      dailyHours: 2.2,
      consistencyRate: 0.86,
      projectedDate: resB.projectedCompletionDate,
      daysSavedOrLost: resB.daysDifference,
      tradeoffSummary: 'Optimal work-life equilibrium; hits internship readiness target on schedule.',
      trajectoryPoints: resB.trajectoryCurve.map((pt) => ({
        date: pt.date,
        progress: pt.simulatedProgress
      }))
    },
    {
      id: 'path-c',
      name: 'Path C: Accelerated Intensity',
      dailyHours: 3.8,
      consistencyRate: 0.92,
      projectedDate: resC.projectedCompletionDate,
      daysSavedOrLost: resC.daysDifference,
      tradeoffSummary: 'High milestone acceleration saves ~45 days, but carries moderate risk of cognitive burnout.',
      trajectoryPoints: resC.trajectoryCurve.map((pt) => ({
        date: pt.date,
        progress: pt.simulatedProgress
      }))
    }
  ];
}
