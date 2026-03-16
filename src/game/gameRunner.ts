/**
 * Game runner - connects parser, interpreter, and mission
 */

import { parse } from '@/src/interpreter/parser';
import {
  createInitialState,
  executeStep,
} from '@/src/interpreter/interpreter';
import type { Command, FarmState } from '@/src/interpreter/types';
import { parseMissionToFarm } from './farmUtils';
import type { Mission } from '@/src/data/missions';

function missionToFarmState(mission: Mission): FarmState {
  const farm = parseMissionToFarm(mission);
  const tiles = farm.tiles.map((row) =>
    row.map((t) => ({
      x: t.x,
      y: t.y,
      type: (t.type === 'target' ? 'soil' : t.type) as FarmState['tiles'][0][0]['type'],
      state: t.state,
    }))
  );
  return {
    width: farm.width,
    height: farm.height,
    tiles,
    droneStart: farm.droneStart,
  };
}

export interface RunResult {
  success: boolean;
  score: number;
  steps: number;
  error: string | null;
  output: string[];
}

export function runMission(
  mission: Mission,
  code: string
): { commands: Command[]; errors: string[] } {
  return parse(code);
}

export function createFarmState(mission: Mission): FarmState {
  return missionToFarmState(mission);
}

export function executeCommand(
  command: Command,
  state: ReturnType<typeof createInitialState>,
  farm: FarmState
) {
  return executeStep(command, state, farm);
}

export { createInitialState } from '@/src/interpreter/interpreter';

export function computeScore(
  mission: Mission,
  steps: number,
  error: string | null,
  reachedTarget: boolean
): number {
  if (error) return 0;
  if (!reachedTarget && mission.targetPosition) return Math.min(50, steps);

  const maxSteps = mission.maxSteps;
  const stepScore = Math.max(0, 100 - (steps / maxSteps) * 30);
  const completionBonus = reachedTarget || !mission.targetPosition ? 30 : 0;
  return Math.min(100, Math.round(stepScore + completionBonus));
}

export function checkMissionComplete(
  mission: Mission,
  state: { x: number; y: number }
): boolean {
  const target = mission.targetPosition;
  if (!target) return true;
  return state.x === target.x && state.y === target.y;
}
