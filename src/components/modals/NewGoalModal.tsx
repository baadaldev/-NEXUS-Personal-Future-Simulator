'use client';

import React, { useState } from 'react';
import { useNexus } from '@/lib/store/nexusContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Target, Sparkles, Calendar, Clock, BookOpen } from 'lucide-react';
import { Goal, Milestone } from '@/types/nexus';

export const NewGoalModal: React.FC = () => {
  const { isModalOpen, closeModal, addGoal, addNotification } = useNexus();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'career' | 'health' | 'learning' | 'finance'>('career');
  const [targetDate, setTargetDate] = useState('2026-11-30');
  const [estimatedHours, setEstimatedHours] = useState(300);
  const [dailyHours, setDailyHours] = useState(2.5);
  const [skills, setSkills] = useState('TypeScript, React, Node.js, PostgreSQL');

  if (!isModalOpen.newGoal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const skillList = skills.split(',').map(s => s.trim()).filter(Boolean);

    // Generate 3 standard milestones based on estimated hours
    const ms1Hours = Math.round(estimatedHours * 0.3);
    const ms2Hours = Math.round(estimatedHours * 0.4);
    const ms3Hours = estimatedHours - ms1Hours - ms2Hours;

    const milestones: Milestone[] = [
      {
        id: `ms-${Date.now()}-1`,
        title: 'Core Fundamentals & Prototype',
        description: 'Complete foundational architecture and initial working models.',
        targetHours: ms1Hours,
        completedHours: 0,
        order: 1,
        isCompleted: false,
        skillsCovered: skillList.slice(0, 2),
      },
      {
        id: `ms-${Date.now()}-2`,
        title: 'Production Build & Applied Integration',
        description: 'Implement end-to-end features, testing, and performance optimization.',
        targetHours: ms2Hours,
        completedHours: 0,
        order: 2,
        isCompleted: false,
        skillsCovered: skillList.slice(1, 3),
      },
      {
        id: `ms-${Date.now()}-3`,
        title: 'Deployment, Polish & Capstone Verification',
        description: 'Final verification, documentation, and production launch.',
        targetHours: ms3Hours,
        completedHours: 0,
        order: 3,
        isCompleted: false,
        skillsCovered: skillList,
      },
    ];

    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Comprehensive strategic objective.',
      category,
      targetCompletionDate: targetDate,
      estimatedHoursTotal: estimatedHours,
      completedHoursTotal: 0,
      requiredDailyHours: dailyHours,
      skillsToAcquire: skillList,
      milestones,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    addGoal(newGoal);
    closeModal('newGoal');
    setTitle('');
    setDescription('');
    addNotification({
      title: 'Goal Registered',
      message: `"${newGoal.title}" is now anchoring your future simulation trajectory.`,
      type: 'success',
    });
  };

  return (
    <Modal
      isOpen={isModalOpen.newGoal}
      onClose={() => closeModal('newGoal')}
      title="Create Simulation Objective"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Goal Objective Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Master AI Engineering & Build 3 Scaled LLM Products"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Rationale & Outcome Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Why does this matter? What concrete capabilities will you demonstrate upon completion?"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              <option value="career">Career & Engineering</option>
              <option value="learning">Academic / Deep Learning</option>
              <option value="health">Fitness & Health</option>
              <option value="finance">Financial Mastery</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Target Date
            </label>
            <input
              type="date"
              required
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Total Estimated Hours
            </label>
            <input
              type="number"
              min={10}
              max={3000}
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Target Daily Hours
            </label>
            <input
              type="number"
              step={0.5}
              min={0.5}
              max={12}
              value={dailyHours}
              onChange={(e) => setDailyHours(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Key Competencies (Comma-separated)
          </label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. Next.js, FastAPI, Vector Databases, System Design"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono text-xs"
          />
        </div>

        <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
          <Button variant="ghost" type="button" onClick={() => closeModal('newGoal')}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Anchor Goal & Simulate
          </Button>
        </div>
      </form>
    </Modal>
  );
};
