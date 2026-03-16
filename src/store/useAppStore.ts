/**
 * DroneFarm - Global app state with Zustand
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@dronefarm';

export interface MissionProgress {
  missionId: string;
  completed: boolean;
  stars: number;
  bestScore: number;
  bestSteps: number;
}

export interface UserProgress {
  completedMissions: string[];
  missionScores: Record<string, MissionProgress>;
  onboardingComplete: boolean;
  totalStars: number;
  badges: string[];
}

interface AppState {
  // Progress
  progress: UserProgress;
  setProgress: (p: Partial<UserProgress>) => void;
  completeMission: (missionId: string, score: number, steps: number) => void;
  completeOnboarding: () => void;

  // Persistence
  loadProgress: () => Promise<void>;
  saveProgress: () => Promise<void>;
}

const defaultProgress: UserProgress = {
  completedMissions: [],
  missionScores: {},
  onboardingComplete: false,
  totalStars: 0,
  badges: [],
};

export const useAppStore = create<AppState>((set, get) => ({
  progress: defaultProgress,

  setProgress: (p) =>
    set((s) => ({
      progress: { ...s.progress, ...p },
    })),

  completeMission: (missionId, score, steps) => {
    const { progress } = get();
    const existing = progress.missionScores[missionId];
    const stars = score >= 95 ? 3 : score >= 80 ? 2 : score >= 60 ? 1 : 0;
    const bestStars = Math.max(stars, existing?.stars ?? 0);
    const bestScore = Math.max(score, existing?.bestScore ?? 0);
    const bestSteps = existing ? Math.min(steps, existing.bestSteps) : steps;

    const completed = !progress.completedMissions.includes(missionId)
      ? [...progress.completedMissions, missionId]
      : progress.completedMissions;

    const missionScores = {
      ...progress.missionScores,
      [missionId]: {
        missionId,
        completed: true,
        stars: bestStars,
        bestScore,
        bestSteps,
      },
    };

    let totalStars = 0;
    for (const m of Object.values(missionScores)) {
      totalStars += m.stars;
    }

    set({
      progress: {
        ...progress,
        completedMissions: completed,
        missionScores,
        totalStars,
      },
    });
    get().saveProgress();
  },

  completeOnboarding: () => {
    set((s) => ({
      progress: { ...s.progress, onboardingComplete: true },
    }));
    get().saveProgress();
  },

  loadProgress: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        set({ progress: { ...defaultProgress, ...parsed } });
      }
    } catch {
      // ignore
    }
  },

  saveProgress: async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(get().progress));
    } catch {
      // ignore
    }
  },
}));
