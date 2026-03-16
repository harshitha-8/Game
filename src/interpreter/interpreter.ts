/**
 * DroneFarm Interpreter - Executes Python-like commands
 */

import type { Command, InterpreterState, FarmState } from './types';

const MAX_BATTERY = 100;
const MOVE_COST = 2;
const SCAN_COST = 3;
const WATER_COST = 5;
const SPRAY_COST = 4;
const COLLECT_COST = 3;
const RECHARGE_AMOUNT = 25;

function getTileKey(x: number, y: number): string {
  return `${x},${y}`;
}

function evalCondition(
  cond: string,
  state: InterpreterState,
  farm: FarmState
): boolean {
  const s = cond.trim().toLowerCase();
  if (s === 'crop_is_dry' || s === 'crop_is_dry()') {
    const tile = farm.tiles[state.y]?.[state.x];
    return tile?.state === 'dry' ?? false;
  }
  if (s === 'weed_detected' || s === 'weed_detected()') {
    const tile = farm.tiles[state.y]?.[state.x];
    return tile?.type === 'weed' ?? false;
  }
  const batteryMatch = s.match(/battery\s*([><=]+)\s*(\d+)/);
  if (batteryMatch) {
    const op = batteryMatch[1];
    const val = parseInt(batteryMatch[2], 10);
    if (op === '>') return state.battery > val;
    if (op === '<') return state.battery < val;
    if (op === '>=') return state.battery >= val;
    if (op === '<=') return state.battery <= val;
    if (op === '==') return state.battery === val;
  }
  return false;
}

export function createInitialState(farm: FarmState): InterpreterState {
  return {
    x: farm.droneStart.x,
    y: farm.droneStart.y,
    battery: MAX_BATTERY,
    samples: 0,
    watered: new Set(),
    sprayed: new Set(),
    scanned: new Set(),
    collected: new Set(),
    output: [],
    error: null,
    stepCount: 0,
  };
}

export function executeStep(
  command: Command,
  state: InterpreterState,
  farm: FarmState
): { state: InterpreterState; done: boolean } {
  const newState = { ...state };
  newState.watered = new Set(state.watered);
  newState.sprayed = new Set(state.sprayed);
  newState.scanned = new Set(state.scanned);
  newState.collected = new Set(state.collected);
  newState.output = [...state.output];
  newState.stepCount = state.stepCount + 1;

  if (newState.battery <= 0) {
    newState.error = 'Battery depleted!';
    return { state: newState, done: true };
  }

  const consumeBattery = (amount: number) => {
    newState.battery = Math.max(0, newState.battery - amount);
  };

  const tile = farm.tiles[newState.y]?.[newState.x];
  const key = getTileKey(newState.x, newState.y);

  switch (command.type) {
    case 'move_up':
      if (newState.y > 0) {
        consumeBattery(MOVE_COST);
        newState.y--;
      }
      break;
    case 'move_down':
      if (newState.y < farm.height - 1) {
        consumeBattery(MOVE_COST);
        newState.y++;
      }
      break;
    case 'move_left':
      if (newState.x > 0) {
        consumeBattery(MOVE_COST);
        newState.x--;
      }
      break;
    case 'move_right':
      if (newState.x < farm.width - 1) {
        consumeBattery(MOVE_COST);
        newState.x++;
      }
      break;
    case 'scan':
      consumeBattery(SCAN_COST);
      newState.scanned.add(key);
      break;
    case 'water':
      consumeBattery(WATER_COST);
      newState.watered.add(key);
      break;
    case 'spray':
      consumeBattery(SPRAY_COST);
      newState.sprayed.add(key);
      break;
    case 'collect_sample':
      consumeBattery(COLLECT_COST);
      if (tile?.type === 'sample') {
        newState.collected.add(key);
        newState.samples++;
      }
      break;
    case 'recharge':
      if (tile?.type === 'recharge') {
        newState.battery = Math.min(MAX_BATTERY, newState.battery + RECHARGE_AMOUNT);
      }
      break;
    case 'print':
      newState.output.push((command.args?.[0] ?? '').toString());
      break;
    default:
      break;
  }

  return { state: newState, done: true };
}
