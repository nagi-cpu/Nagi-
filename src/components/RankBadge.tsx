import React from 'react';
import { motion } from 'motion/react';
import { Rank } from '../types';

interface RankBadgeProps {
  rank: Rank;
  size?: 'sm' | 'md' | 'lg';
}

export const RankBadge: React.FC<RankBadgeProps> = ({ rank, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-2xl',
  };

  const gradientClasses = {
    S: 'rank-gradient-s shadow-purple-200',
    A: 'rank-gradient-a shadow-blue-200',
    B: 'rank-gradient-b shadow-emerald-200',
    C: 'rank-gradient-c shadow-slate-200',
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        ${sizeClasses[size]} 
        ${gradientClasses[rank]} 
        rounded-full flex items-center justify-center font-display font-bold text-white shadow-lg
      `}
    >
      {rank}
    </motion.div>
  );
};
