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
        const profile = await getDocument('user', 'profile');
        if (profile) {
          store.setProfile({
            xp: profile.xp ?? 0,
            level: profile.level ?? 1,
            streak: profile.streak ?? 1,
            skillPoints: profile.skillPoints ?? {
              'Engineering': 0,
              'Physical Fitness': 0,
              'Content Creation': 0,
              'Mental Fortitude': 0,
            },
            unlockedSkills: profile.unlockedSkills ?? [],
          });
        } else {
          // Initialize profile in DB if it doesn't exist
          await setDocument('user', 'profile', {
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
          });
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
        xp: state.xp,
        level: state.level,
        streak: state.streak,
        skillPoints: state.skillPoints,
        unlockedSkills: state.unlockedSkills,
      };

      setDocument('user', 'profile', profileData).catch(err => {
        console.error("Failed to sync store to Firestore:", err);
      });
    });

    return () => unsubscribe();
  }, []);

  return null; // This component doesn't render anything
}
