'use client';

import React, { useState } from 'react';
import { useNexus } from '@/lib/store/nexusContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Task } from '@/types/nexus';

export const NewTaskModal: React.FC = () => {
  const { isModalOpen, closeModal, addTask, activeGoal, addNotification } = useNexus();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'study' | 'project' | 'dsa' | 'review'>('study');
  const [estimatedMinutes, setEstimatedMinutes] = useState(60);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('high');

  if (!isModalOpen.newTask) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      goalId: activeGoal?.id,
      title: title.trim(),
      category,
      estimatedMinutes,
      completedMinutes: 0,
      status: 'pending',
      priority,
      dueDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    addTask(newTask);
    closeModal('newTask');
    setTitle('');
    addNotification({
      title: 'Action Item Scheduled',
      message: `"${newTask.title}" added to today's execution queue.`,
      type: 'success',
    });
  };

  return (
    <Modal
      isOpen={isModalOpen.newTask}
      onClose={() => closeModal('newTask')}
      title="Add Daily Execution Task"
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Action Item Title
          </label>
          <input
            type="text"
            required
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Build JWT auth middleware & refresh tokens"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Discipline Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              <option value="study">Theory & Concepts</option>
              <option value="project">Applied Code & Projects</option>
              <option value="dsa">DSA & Problem Solving</option>
              <option value="review">System Architecture Review</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              <option value="high">High (Deep Work)</option>
              <option value="medium">Medium</option>
              <option value="low">Low (Maintenance)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Estimated Duration (Minutes)
          </label>
          <div className="flex items-center gap-2">
            {[25, 45, 60, 90, 120].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setEstimatedMinutes(mins)}
                className={`flex-1 py-1.5 rounded text-xs font-mono border transition-all ${
                  estimatedMinutes === mins
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
          <Button variant="ghost" type="button" onClick={() => closeModal('newTask')}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Add to Queue
          </Button>
        </div>
      </form>
    </Modal>
  );
};
