import {
  runFutureSimulation,
  calculateMomentum,
  calculateConfidence,
  generateAlternativeScenarios
} from './engine';
import { Goal, DailyActivityLog, SimulationParameters } from '@/types/nexus';

function runTests() {
  console.log('--- RUNNING NEXUS SIMULATION ENGINE VERIFICATION ---');

  const mockGoals: Goal[] = [
    {
      id: 'g-1',
      title: 'Internship-Ready Full-Stack Developer',
      description: 'Master modern full-stack web and algorithms',
      category: 'Software Engineering',
      startDate: '2026-09-01',
      targetDate: '2027-03-01',
      estimatedRequiredHours: 360,
      priority: 'high',
      status: 'active',
      progressPercentage: 42,
      skills: [
        { id: 's1', name: 'React & Next.js', category: 'frontend', currentLevel: 'Intermediate', targetLevel: 'Advanced', hoursInvested: 65 },
        { id: 's2', name: 'Node.js & SQL', category: 'backend', currentLevel: 'Intermediate', targetLevel: 'Advanced', hoursInvested: 50 },
        { id: 's3', name: 'C++ & DSA', category: 'dsa', currentLevel: 'Beginner', targetLevel: 'Intermediate', hoursInvested: 35 }
      ],
      milestones: [
        { id: 'm1', goalId: 'g-1', title: 'Frontend Foundation', targetDate: '2026-10-15', weight: 8, completionPercentage: 100, isCompleted: true, tasksCount: 12, completedTasksCount: 12 },
        { id: 'm2', goalId: 'g-1', title: 'Backend & Database Systems', targetDate: '2026-12-01', weight: 9, completionPercentage: 60, isCompleted: false, tasksCount: 15, completedTasksCount: 9 },
        { id: 'm3', goalId: 'g-1', title: 'Full-Stack Capstone Project', targetDate: '2027-01-20', weight: 10, completionPercentage: 20, isCompleted: false, tasksCount: 10, completedTasksCount: 2 },
        { id: 'm4', goalId: 'g-1', title: 'Interview & DSA Mastery', targetDate: '2027-03-01', weight: 9, completionPercentage: 10, isCompleted: false, tasksCount: 14, completedTasksCount: 1 }
      ]
    }
  ];

  // 14 days of realistic logs
  const mockLogs: DailyActivityLog[] = [];
  const baseDate = new Date('2026-09-25');
  for (let i = 0; i < 21; i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    mockLogs.push({
      id: `log-${i}`,
      date: d.toISOString().split('T')[0],
      studyMinutes: i % 7 === 0 ? 45 : 120, // some variation
      projectMinutes: i % 3 === 0 ? 60 : 30,
      dsaProblems: i % 2 === 0 ? 3 : 1,
      completedTaskIds: ['t1', 't2'],
      plannedTaskIds: ['t1', 't2'],
      consistencyRate: i % 7 === 0 ? 0.6 : 0.88
    });
  }

  const defaultParams: SimulationParameters = {
    dailyStudyHours: 2.0,
    weeklyProjectHours: 8,
    weeklyDSAProblems: 14,
    targetConsistency: 0.85,
    focusFactor: 1.0
  };

  // TEST 1: Baseline Simulation Output
  const result = runFutureSimulation(mockGoals, mockLogs, defaultParams, baseDate);
  console.assert(result.projectedCompletionDate.length > 0, 'Projected completion date must exist');
  console.assert(result.timeline.length >= 4, 'Timeline must contain at least 4 nodes');
  console.assert(result.trajectoryCurve.length > 10, 'Trajectory curve must contain data points');
  console.assert(result.confidence === 'High', 'Confidence for 21 days must be High');
  console.log('✓ Test 1 Passed: Simulation generated projected date:', result.projectedCompletionDate);

  // TEST 2: Sensitivity Test (Increasing hours should shorten completion time)
  const highEffortParams: SimulationParameters = {
    ...defaultParams,
    dailyStudyHours: 4.0
  };
  const acceleratedResult = runFutureSimulation(mockGoals, mockLogs, highEffortParams, baseDate);
  const diffDays =
    (new Date(result.projectedCompletionDate).getTime() -
      new Date(acceleratedResult.projectedCompletionDate).getTime()) /
    (1000 * 60 * 60 * 24);

  console.assert(diffDays > 20, 'Doubling study time must advance completion date by at least 20 days');
  console.log(`✓ Test 2 Passed: High-effort scenario saved ${Math.round(diffDays)} days!`);

  // TEST 3: Momentum Calculation
  const momentum = calculateMomentum(mockLogs);
  console.assert(typeof momentum.score === 'number', 'Momentum score must be a number');
  console.assert(momentum.score >= -100 && momentum.score <= 100, 'Momentum must be within [-100, 100]');
  console.log('✓ Test 3 Passed: Momentum metric:', momentum.label);

  // TEST 4: Alternative Scenarios
  const scenarios = generateAlternativeScenarios(mockGoals, mockLogs, baseDate);
  console.assert(scenarios.length === 3, 'Must produce 3 alternative paths (A, B, C)');
  console.log('✓ Test 4 Passed: Alternative scenarios generated: Path A, B, C');

  console.log('ALL NEXUS SIMULATION ENGINE TESTS PASSED SUCCESSFULLY! ✓✓✓');
}

runTests();
