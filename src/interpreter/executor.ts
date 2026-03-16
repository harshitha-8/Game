/**
 * Full program executor - runs parsed commands with loops/conditionals
 */

import type { Command, InterpreterState, FarmState } from './types';
import { executeStep } from './interpreter';

function* flattenCommands(commands: Command[]): Generator<Command> {
  for (const cmd of commands) {
    if (cmd.type === 'loop' && cmd.body && cmd.start !== undefined && cmd.end !== undefined) {
      for (let i = cmd.start; i < cmd.end; i++) {
        yield* flattenCommands(cmd.body);
      }
    } else if (cmd.type === 'conditional' && cmd.body) {
      yield* flattenCommands(cmd.body);
    } else if (cmd.body && cmd.body.length > 0) {
      yield* flattenCommands(cmd.body);
    } else if (
      ['move_up', 'move_down', 'move_left', 'move_right', 'scan', 'water', 'spray', 'collect_sample', 'recharge', 'print'].includes(cmd.type)
    ) {
      yield cmd;
    }
  }
}

export function* executeProgram(
  commands: Command[],
  initialState: InterpreterState,
  farm: FarmState
): Generator<{ state: InterpreterState; command: Command }> {
  let state = initialState;
  const flat = flattenCommands(commands);

  for (const cmd of flat) {
    if (state.error || state.battery <= 0) break;
    const result = executeStep(cmd, state, farm);
    state = result.state;
    yield { state, command: cmd };
  }
}
