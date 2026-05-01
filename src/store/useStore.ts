import { create } from 'zustand';

interface UserProfile {
  displayName: string;
  profileImage: string;
  xp: number;
  level: number;
  xpToNextLevel: number;
  streak: number;
  skillPoints: Record<string, number>;
  unlockedSkills: string[];
  combatState: {
    bossName: string;
    bossHP: number;
    bossMaxHP: number;
    battleLog: { id: string; message: string; type: 'player' | 'boss' | 'system' }[];
  };
}

interface UserState extends UserProfile {
  setProfile: (profile: Partial<UserProfile>) => void;
  addXP: (amount: number) => void;
  updateStreak: (newStreak: number) => void;
  dealDamage: (amount: number, actionName: string) => void;
  addLogMessage: (message: string, type: 'player' | 'boss' | 'system') => void;
}

const calculateNextLevelXP = (level: number) => {
  // Base 100 per level + random variance (0-50)
  return (level * 100) + Math.floor(Math.random() * 50);
};

export const useStore = create<UserState>((set, get) => ({
  displayName: 'Player One',
  profileImage: '',
  xp: 0,
  level: 1,
  xpToNextLevel: 100,
  streak: 1,
  skillPoints: {
    'Engineering': 0,
    'Physical Fitness': 0,
    'Content Creation': 0,
    'Mental Fortitude': 0,
  },
  unlockedSkills: [],
  combatState: {
    bossName: 'Procrastination Demon',
    bossHP: 500,
    bossMaxHP: 500,
    battleLog: [
      { id: '1', message: 'A new threat has emerged from the digital void.', type: 'system' }
    ],
  },

  setProfile: (profile) => set((state) => ({ ...state, ...profile })),

  addXP: (amount) => set((state) => {
    let newXP = state.xp + amount;
    let newLevel = state.level;
    let currentXPToNext = state.xpToNextLevel;

    while (newXP >= currentXPToNext) {
      newXP -= currentXPToNext;
      newLevel += 1;
      currentXPToNext = calculateNextLevelXP(newLevel);
    }

    return { 
      xp: newXP, 
      level: newLevel,
      xpToNextLevel: currentXPToNext
    };
  }),

  updateStreak: (newStreak) => set({ streak: newStreak }),

  dealDamage: async (amount, actionName) => {
    const state = get();
    const newHP = Math.max(0, state.combatState.bossHP - amount);
    
    // Initial message
    const playerMessage = {
      id: Math.random().toString(36).substr(2, 9),
      message: `Critical Hit! ${actionName} deals ${amount} damage.`,
      type: 'player' as const
    };

    set((state) => ({
      combatState: {
        ...state.combatState,
        bossHP: newHP,
        battleLog: [...state.combatState.battleLog, playerMessage].slice(-50)
      }
    }));

    // Trigger AI Narrative
    try {
      const response = await fetch('/api/narrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionName,
          damage: amount,
          bossName: state.combatState.bossName,
          bossHP: newHP
        })
      });
      const data = await response.json();
      
      if (data.message) {
        set((state) => ({
          combatState: {
            ...state.combatState,
            battleLog: [...state.combatState.battleLog, { 
              id: Math.random().toString(36).substr(2, 9), 
              message: data.message, 
              type: 'boss' as const 
            }].slice(-50)
          }
        }));
      }
    } catch (error) {
      console.error("Narrator failed:", error);
    }

    // If boss defeated, reset with more HP
    if (newHP === 0) {
      setTimeout(() => {
        set((state) => {
          const nextMax = state.combatState.bossMaxHP + 250;
          return {
            combatState: {
              ...state.combatState,
              bossName: 'Void Architect', 
              bossHP: nextMax,
              bossMaxHP: nextMax,
              battleLog: [
                ...state.combatState.battleLog,
                { id: Math.random().toString(36).substr(2, 9), message: `${state.combatState.bossName} has been terminated! A stronger foe approaches...`, type: 'system' as const }
              ].slice(-50)
            }
          };
        });
      }, 2000);
    }
  },

  addLogMessage: (message, type) => set((state) => ({
    combatState: {
      ...state.combatState,
      battleLog: [...state.combatState.battleLog, { id: Math.random().toString(36).substr(2, 9), message, type }].slice(-50)
    }
  })),
}));
