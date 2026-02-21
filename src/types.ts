export type Rank = 'C' | 'B' | 'A' | 'S';

export interface Milestone {
  id: string;
  text: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  rank: Rank;
  milestones: Milestone[];
  createdAt: number;
  updatedAt: number;
}

export const RANK_THRESHOLDS: Record<Rank, number> = {
  'C': 0,
  'B': 0.4,
  'A': 0.75,
  'S': 1.0
};

export const getRankFromProgress = (progress: number): Rank => {
  if (progress >= 1) return 'S';
  if (progress >= 0.75) return 'A';
  if (progress >= 0.4) return 'B';
  return 'C';
};
