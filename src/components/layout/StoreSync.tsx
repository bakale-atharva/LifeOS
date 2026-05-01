'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { getDocument, setDocument } from '@/lib/firestoreUtils';

export default function StoreSync() {
  const store = useStore();
  const isInitialMount = useRef(true);
  const isSyncingFromDB = useRef(false);

  // 1. Initial Load from Firestore
  useEffect(() => {
    async function loadProfile() {
      isSyncingFromDB.current = true;
      try {
        const profile = await getDocument('user', 'profile') as any;
        if (profile) {
          store.setProfile({
            displayName: profile.displayName ?? 'Player One',
            profileImage: profile.profileImage ?? '',
            xp: profile.xp ?? 0,
            level: profile.level ?? 1,
            xpToNextLevel: profile.xpToNextLevel ?? 100,
            streak: profile.streak ?? 1,
            skillPoints: profile.skillPoints ?? {
              'Engineering': 0,
              'Physical Fitness': 0,
              'Content Creation': 0,
              'Mental Fortitude': 0,
            },
            unlockedSkills: profile.unlockedSkills ?? [],
            combatState: profile.combatState ?? {
              bossName: 'Procrastination Demon',
              bossHP: 500,
              bossMaxHP: 500,
              battleLog: [{ id: '1', message: 'A new threat has emerged from the digital void.', type: 'system' }],
            },
          });
        } else {
          // Initialize profile in DB if it doesn't exist
          const initialData = {
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
              battleLog: [{ id: '1', message: 'A new threat has emerged from the digital void.', type: 'system' }],
            },
          };
          await setDocument('user', 'profile', initialData);
        }
      } catch (error) {
        console.error("Failed to load profile from Firestore:", error);
      } finally {
        isSyncingFromDB.current = false;
        isInitialMount.current = false;
      }
    }

    loadProfile();
  }, []);

  // 2. Sync changes back to Firestore
  useEffect(() => {
    // Skip initial mount and updates triggered by DB sync
    if (isInitialMount.current || isSyncingFromDB.current) return;

    const unsubscribe = useStore.subscribe((state) => {
      // Logic to prevent redundant writes or loops
      if (isSyncingFromDB.current) return;

      const profileData = {
        displayName: state.displayName,
        profileImage: state.profileImage,
        xp: state.xp,
        level: state.level,
        xpToNextLevel: state.xpToNextLevel,
        streak: state.streak,
        skillPoints: state.skillPoints,
        unlockedSkills: state.unlockedSkills,
        combatState: state.combatState,
      };

      setDocument('user', 'profile', profileData).catch(err => {
        console.error("Failed to sync store to Firestore:", err);
      });
    });

    return () => unsubscribe();
  }, []);

  return null; // This component doesn't render anything
}
