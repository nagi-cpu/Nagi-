/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Goal, Rank, getRankFromProgress } from './types';
import { GoalCard } from './components/GoalCard';
import { GoalForm } from './components/GoalForm';
import { Plus, Target, Trophy, Sparkles, LayoutGrid } from 'lucide-react';

export default function App() {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('ascend-goals');
    return saved ? JSON.parse(saved) : [];
  });
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('ascend-goals', JSON.stringify(goals));
  }, [goals]);

  const addGoal = (title: string, category: string) => {
    const newGoal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description: '',
      category,
      currentValue: 0,
      targetValue: 100,
      unit: '%',
      rank: 'C',
      milestones: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setGoals([newGoal, ...goals]);
    setIsFormOpen(false);
  };

  const deleteGoal = (goalId: string) => {
    setGoals(goals.filter(g => g.id !== goalId));
  };

  const updateMilestone = (goalId: string, milestoneId: string) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map(m => 
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const progress = updatedMilestones.length > 0 ? completedCount / updatedMilestones.length : 0;
        
        return {
          ...goal,
          milestones: updatedMilestones,
          rank: getRankFromProgress(progress),
          updatedAt: Date.now()
        };
      }
      return goal;
    }));
  };

  const addMilestone = (goalId: string, text: string) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const newMilestone = {
          id: Math.random().toString(36).substr(2, 9),
          text,
          completed: false
        };
        const updatedMilestones = [...goal.milestones, newMilestone];
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const progress = updatedMilestones.length > 0 ? completedCount / updatedMilestones.length : 0;

        return {
          ...goal,
          milestones: updatedMilestones,
          rank: getRankFromProgress(progress),
          updatedAt: Date.now()
        };
      }
      return goal;
    }));
  };

  const totalGoals = goals.length;
  const sRankCount = goals.filter(g => g.rank === 'S').length;
  const averageProgress = goals.length > 0 
    ? goals.reduce((acc, g) => {
        const p = g.milestones.length > 0 
          ? (g.milestones.filter(m => m.completed).length / g.milestones.length)
          : 0;
        return acc + p;
      }, 0) / goals.length
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="flex items-center justify-between mb-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Target size={24} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-800">Ascend</h1>
            <p className="text-slate-500 text-sm font-medium">Master your potential</p>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFormOpen(true)}
          className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-2xl shadow-sm border border-blue-50 flex items-center gap-2 hover:bg-blue-50 transition-colors"
        >
          <Plus size={20} />
          New Goal
        </motion.button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard 
          icon={<LayoutGrid className="text-blue-500" size={20} />}
          label="Active Goals"
          value={totalGoals.toString()}
          delay={0.1}
        />
        <StatCard 
          icon={<Sparkles className="text-amber-500" size={20} />}
          label="Overall Mastery"
          value={`${Math.round(averageProgress * 100)}%`}
          delay={0.2}
        />
        <StatCard 
          icon={<Trophy className="text-purple-500" size={20} />}
          label="S-Rank Achievements"
          value={sRankCount.toString()}
          delay={0.3}
        />
      </div>

      {/* Goals List */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {goals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                <Target size={40} />
              </div>
              <h3 className="text-xl font-display font-semibold text-slate-700 mb-2">No goals yet</h3>
              <p className="text-slate-500 max-w-xs mx-auto mb-8">
                Start your journey by defining your first goal and reaching for S-Rank.
              </p>
              <button
                onClick={() => setIsFormOpen(true)}
                className="text-blue-600 font-semibold hover:underline"
              >
                Create your first goal
              </button>
            </motion.div>
          ) : (
            goals.map((goal) => (
              <GoalCard 
                key={goal.id} 
                goal={goal} 
                onUpdateMilestone={updateMilestone}
                onDelete={deleteGoal}
                onAddMilestone={addMilestone}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            />
            <GoalForm 
              onAdd={addGoal} 
              onClose={() => setIsFormOpen(false)} 
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon, label, value, delay }: { icon: React.ReactNode, label: string, value: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass rounded-3xl p-6 flex items-center gap-4"
    >
      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-display font-bold text-slate-800">{value}</p>
      </div>
    </motion.div>
  );
}
