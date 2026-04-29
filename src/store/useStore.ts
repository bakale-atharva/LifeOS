import { create } from 'zustand';

interface UserState {
  xp: number;
  level: number;
  streak: number;
  addXP: (amount: number) => void;
  updateStreak: (newStreak: number) => void;
}

export const useStore = create<UserState>((set) => ({
  xp: 0,
  level: 1,
  streak: 1,
  addXP: (amount) => set((state) => {
    const newXP = state.xp + amount;
    const nextLevelXP = state.level * 1000;
    if (newXP >= nextLevelXP) {
      return { 
        xp: newXP - nextLevelXP, 
        level: state.level + 1 
      };
    }
    return { xp: newXP };
  }),
  updateStreak: (newStreak) => set({ streak: newStreak }),
}));
