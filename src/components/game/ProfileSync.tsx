"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";

export function ProfileSync() {
  const syncProfile = useGameStore((state) => state.syncProfile);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const profile = await response.json();
          syncProfile(profile);
        }
      } catch (error) {
        console.error("Failed to sync profile:", error);
      }
    }

    fetchProfile();
  }, [syncProfile]);

  return null;
}
