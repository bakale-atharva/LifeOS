import { create } from 'zustand';

interface GameState {
  level: number;
  overallScore: number;
  gold: number;
  
  // Life Area Scores (0-100)
  goalsScore: number;
  timeScore: number;
  healthScore: number;
  relationScore: number;
  financeScore: number;

  // Actions
  updateScore: (area: 'goals' | 'time' | 'health' | 'relation' | 'finance', value: number) => void;
  addGold: (amount: number) => void;
  syncProfile: (profile: any) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  level: 1,
  overallScore: 0,
  gold: 0,
  goalsScore: 0,
  timeScore: 0,
  healthScore: 0,
  relationScore: 0,
  financeScore: 0,

  updateScore: (area, value) => {
    set((state) => {
      const newScores = {
        goalsScore: area === 'goals' ? Math.min(100, Math.max(0, value)) : state.goalsScore,
        timeScore: area === 'time' ? Math.min(100, Math.max(0, value)) : state.timeScore,
        healthScore: area === 'health' ? Math.min(100, Math.max(0, value)) : state.healthScore,
        relationScore: area === 'relation' ? Math.min(100, Math.max(0, value)) : state.relationScore,
        financeScore: area === 'finance' ? Math.min(100, Math.max(0, value)) : state.financeScore,
      };

      const overallScore = Math.round(
        (newScores.goalsScore +
          newScores.timeScore +
          newScores.healthScore +
          newScores.relationScore +
          newScores.financeScore) /
          5
      );

      // Simple leveling logic: level = overallScore / 2 (min 1)
      const level = Math.max(1, Math.floor(overallScore / 2));

      return { ...newScores, overallScore, level };
    });
  },

  addGold: (amount) => set((state) => ({ gold: state.gold + amount })),

  syncProfile: (profile) => set({
    level: profile.level,
    overallScore: profile.overallScore,
    gold: profile.gold,
    goalsScore: profile.goalsScore,
    timeScore: profile.timeScore,
    healthScore: profile.healthScore,
    relationScore: profile.relationScore,
    financeScore: profile.financeScore,
  }),
}));
