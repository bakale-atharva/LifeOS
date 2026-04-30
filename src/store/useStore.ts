import { create } from 'zustand';

interface UserProfile {
  xp: number;
  level: number;
  streak: number;
  skillPoints: Record<string, number>;
  unlockedSkills: string[];
}

interface UserState extends UserProfile {
  setProfile: (profile: Partial<UserProfile>) => void;
  addXP: (amount: number) => void;
  updateStreak: (newStreak: number) => void;
}

export const useStore = create<UserState>((set) => ({
  xp: 0,
  level: 1,
  streak: 1,
  skillPoints: {
    'Engineering': 0,
    'Physical Fitness': 0,
    'Content Creation': 0,
    'Mental Fortitude': 0,
  },
  unlockedSkills: [],

  setProfile: (profile) => set((state) => ({ ...state, ...profile })),

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
