import missionsData from './missions.json';

export type MissionCategory = 'tutorial' | 'advanced';

export interface Mission {
  id: string;
  title: string;
  description: string;
  objective: string;
  hint: string;
  sampleSolution: string;
  gridWidth: number;
  gridHeight: number;
  tiles: string[][];
  droneStart: { x: number; y: number };
  targetPosition: { x: number; y: number } | null;
  scoreTarget: number;
  maxSteps: number;
}

export const tutorialMissions: Mission[] = missionsData.tutorial as Mission[];
export const advancedMissions: Mission[] = missionsData.advanced as Mission[];
export const allMissions: Mission[] = [...tutorialMissions, ...advancedMissions];

export function getMission(id: string): Mission | undefined {
  return allMissions.find((m) => m.id === id);
}
