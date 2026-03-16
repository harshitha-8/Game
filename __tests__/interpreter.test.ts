import { createInitialState, executeStep } from '../src/interpreter/interpreter';
import type { FarmState, Command } from '../src/interpreter/types';

const mockFarm: FarmState = {
  width: 5,
  height: 5,
  tiles: Array(5)
    .fill(null)
    .map((_, y) =>
      Array(5)
        .fill(null)
        .map((_, x) => ({
          x,
          y,
          type: 'soil' as const,
        }))
    ),
  droneStart: { x: 0, y: 0 },
};

describe('Interpreter', () => {
  it('creates initial state at drone start', () => {
    const state = createInitialState(mockFarm);
    expect(state.x).toBe(0);
    expect(state.y).toBe(0);
    expect(state.battery).toBe(100);
    expect(state.stepCount).toBe(0);
  });

  it('moves right and consumes battery', () => {
    const state = createInitialState(mockFarm);
    const { state: next } = executeStep(
      { type: 'move_right', line: 1 } as Command,
      state,
      mockFarm
    );
    expect(next.x).toBe(1);
    expect(next.y).toBe(0);
    expect(next.battery).toBe(98);
  });

  it('moves down', () => {
    const state = createInitialState(mockFarm);
    const { state: next } = executeStep(
      { type: 'move_down', line: 1 } as Command,
      state,
      mockFarm
    );
    expect(next.x).toBe(0);
    expect(next.y).toBe(1);
  });

  it('does not move out of bounds', () => {
    const state = createInitialState(mockFarm);
    const leftCmd = { type: 'move_left', line: 1 } as Command;
    const { state: next } = executeStep(leftCmd, state, mockFarm);
    expect(next.x).toBe(0);
    expect(next.y).toBe(0);
  });
});
