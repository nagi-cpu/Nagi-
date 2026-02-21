import React from 'react';
import { motion } from 'motion/react';
import { Plus, X } from 'lucide-react';

interface GoalFormProps {
  onAdd: (title: string, category: string) => void;
  onClose: () => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({ onAdd, onClose }) => {
  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState('Personal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), category);
      setTitle('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-3xl p-8 w-full max-w-md relative"
    >
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
      >
        <X size={20} />
      </button>

      <h2 className="font-display text-2xl font-bold text-slate-800 mb-6">New Goal</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-2">Goal Title</label>
          <input
            autoFocus
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you want to achieve?"
            className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-800 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-2">Category</label>
          <div className="flex flex-wrap gap-2">
            {['Personal', 'Work', 'Health', 'Skill', 'Finance'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  category === cat 
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-200' 
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Create Goal
        </button>
      </form>
    </motion.div>
  );
};
