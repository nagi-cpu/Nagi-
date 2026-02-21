import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Goal, Milestone } from '../types';
import { RankBadge } from './RankBadge';
import { CheckCircle2, Circle, MoreVertical, Trash2, Plus } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
  onUpdateMilestone: (goalId: string, milestoneId: string) => void;
  onDelete: (goalId: string) => void;
  onAddMilestone: (goalId: string, text: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ 
  goal, 
  onUpdateMilestone, 
  onDelete,
  onAddMilestone 
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [newMilestone, setNewMilestone] = React.useState('');

  const progress = goal.milestones.length > 0 
    ? (goal.milestones.filter(m => m.completed).length / goal.milestones.length) * 100
    : 0;

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMilestone.trim()) {
      onAddMilestone(goal.id, newMilestone.trim());
      setNewMilestone('');
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-3xl p-6 mb-4 overflow-hidden relative"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <RankBadge rank={goal.rank} />
          <div>
            <h3 className="font-display text-xl font-semibold text-slate-800">{goal.title}</h3>
            <p className="text-slate-500 text-sm">{goal.category}</p>
          </div>
        </div>
        <button 
          onClick={() => onDelete(goal.id)}
          className="text-slate-400 hover:text-red-500 transition-colors p-2"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={`h-full rounded-full ${
              goal.rank === 'S' ? 'rank-gradient-s' : 
              goal.rank === 'A' ? 'rank-gradient-a' : 
              goal.rank === 'B' ? 'rank-gradient-b' : 'rank-gradient-c'
            }`}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-700">Milestones</h4>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-blue-600 font-medium hover:underline"
          >
            {isExpanded ? 'Show less' : 'View all'}
          </button>
        </div>

        <AnimatePresence>
          {(isExpanded ? goal.milestones : goal.milestones.slice(0, 2)).map((milestone) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 group"
            >
              <button 
                onClick={() => onUpdateMilestone(goal.id, milestone.id)}
                className={`transition-colors ${milestone.completed ? 'text-blue-500' : 'text-slate-300 hover:text-slate-400'}`}
              >
                {milestone.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
              </button>
              <span className={`text-sm transition-all ${milestone.completed ? 'text-slate-400 line-through' : 'text-slate-600'}`}>
                {milestone.text}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {isExpanded && (
          <form onSubmit={handleAddMilestone} className="flex gap-2 mt-4">
            <input
              type="text"
              value={newMilestone}
              onChange={(e) => setNewMilestone(e.target.value)}
              placeholder="Add milestone..."
              className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-100 outline-none"
            />
            <button 
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600 transition-colors"
            >
              <Plus size={18} />
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
};
