/**
 * DroneFarm Interpreter - Type definitions
 */

export type CommandType =
  | 'move_up'
  | 'move_down'
  | 'move_left'
  | 'move_right'
  | 'scan'
  | 'water'
  | 'spray'
  | 'collect_sample'
  | 'recharge'
  | 'print';

export interface Command {
  type: CommandType | 'conditional' | 'loop' | 'function_call';
  line: number;
  args?: unknown[];
  condition?: string;
  body?: Command[];
  varName?: string;
  start?: number;
  end?: number;
}

export interface InterpreterState {
  x: number;
  y: number;
  battery: number;
  samples: number;
  watered: Set<string>;
  sprayed: Set<string>;
  scanned: Set<string>;
  collected: Set<string>;
  output: string[];
  error: string | null;
  stepCount: number;
}

export interface FarmTile {
  x: number;
  y: number;
  type: 'soil' | 'crop' | 'weed' | 'water' | 'obstacle' | 'recharge' | 'sample';
  state?: 'dry' | 'healthy' | 'affected' | 'wet';
}

export interface FarmState {
  width: number;
  height: number;
  tiles: FarmTile[][];
  droneStart: { x: number; y: number };
}
