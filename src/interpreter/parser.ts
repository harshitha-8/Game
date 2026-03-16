/**
 * DroneFarm Interpreter - Parser for Python-like syntax
 */

import type { Command } from './types';

const KEYWORDS = new Set([
  'if', 'else', 'elif', 'for', 'while', 'def', 'return',
  'and', 'or', 'not', 'in', 'range', 'True', 'False',
]);

const BUILTINS = new Set([
  'move_up', 'move_down', 'move_left', 'move_right',
  'scan', 'water', 'spray', 'collect_sample', 'recharge', 'print',
  'crop_is_dry', 'weed_detected', 'battery', 'get_x', 'get_y',
]);

function tokenize(source: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  const lines = source.split('\n');

  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const line = lines[lineNum];
    let j = 0;
    while (j < line.length) {
      const c = line[j];
      if (/\s/.test(c)) {
        j++;
        continue;
      }
      if (c === '#') {
        break; // comment to end of line
      }
      if (c === '"' || c === "'") {
        const quote = c;
        let str = '';
        j++;
        while (j < line.length && line[j] !== quote) {
          str += line[j];
          j++;
        }
        j++;
        tokens.push(quote + str + quote);
        continue;
      }
      if (/[a-zA-Z_][a-zA-Z0-9_]*/.test(c)) {
        let ident = '';
        while (j < line.length && /[a-zA-Z0-9_]/.test(line[j])) {
          ident += line[j];
          j++;
        }
        tokens.push(ident);
        continue;
      }
      if (/\d/.test(c)) {
        let num = '';
        while (j < line.length && /\d/.test(line[j])) {
          num += line[j];
          j++;
        }
        tokens.push(num);
        continue;
      }
      if ('()[]:,.'.includes(c)) {
        tokens.push(c);
        j++;
        continue;
      }
      if (c === '=' && line[j + 1] !== '=') {
        tokens.push('=');
        j++;
        continue;
      }
      if (c === '=' && line[j + 1] === '=') {
        tokens.push('==');
        j += 2;
        continue;
      }
      if ('<>!'.includes(c) && line[j + 1] === '=') {
        tokens.push(c + '=');
        j += 2;
        continue;
      }
      if ('<>'.includes(c)) {
        tokens.push(c);
        j++;
        continue;
      }
      j++;
    }
  }
  return tokens;
}

function parseExpression(tokens: string[], pos: { i: number }): string | number | null {
  if (pos.i >= tokens.length) return null;
  const t = tokens[pos.i];
  if (t === 'True' || t === 'False') {
    pos.i++;
    return t === 'True';
  }
  if (/^\d+$/.test(t)) {
    pos.i++;
    return parseInt(t, 10);
  }
  if (/^["'].*["']$/.test(t)) {
    pos.i++;
    return t.slice(1, -1);
  }
  if (BUILTINS.has(t) || /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(t)) {
    pos.i++;
    return t;
  }
  return null;
}

function parseCondition(tokens: string[], pos: { i: number }): string | null {
  const start = pos.i;
  const parts: string[] = [];
  while (pos.i < tokens.length && tokens[pos.i] !== ':') {
    parts.push(tokens[pos.i]);
    pos.i++;
  }
  return parts.length > 0 ? parts.join(' ') : null;
}

export function parse(source: string): { commands: Command[]; errors: string[] } {
  const errors: string[] = [];
  const lines = source.split('\n');
  const commands: Command[] = [];
  const blockStack: { indent: number; body: Command[] }[] = [];

  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const line = lines[lineNum];
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const indent = line.search(/\S/);
    if (indent < 0) continue;

    // Pop blocks we've exited
    while (blockStack.length > 0 && indent <= blockStack[blockStack.length - 1].indent) {
      blockStack.pop();
    }

    const tokens = line.trim().split(/\s+/);
    const first = tokens[0];

    const addCommand = (cmd: Command) => {
      if (blockStack.length > 0) {
        blockStack[blockStack.length - 1].body.push(cmd);
      } else {
        commands.push(cmd);
      }
    };

    if (first === 'if' || first === 'elif') {
      const cond = line.replace(/^\s*if\s+/, '').replace(/^\s*elif\s+/, '').split(':')[0].trim();
      const cmd: Command = { type: 'conditional', line: lineNum + 1, condition: cond, body: [] };
      addCommand(cmd);
      blockStack.push({ indent, body: cmd.body! });
      continue;
    }

    if (first === 'else' && tokens.length === 1) {
      const cmd: Command = { type: 'conditional', line: lineNum + 1, condition: 'else', body: [] };
      addCommand(cmd);
      blockStack.push({ indent, body: cmd.body! });
      continue;
    }

    if (first === 'for') {
      const match = trimmed.match(/for\s+(\w+)\s+in\s+range\s*\(\s*(\d+)\s*(?:,\s*(\d+))?\s*\)\s*:/);
      if (match) {
        const start = match[3] ? parseInt(match[2], 10) : 0;
        const end = match[3] ? parseInt(match[3], 10) : parseInt(match[2], 10);
        const cmd: Command = {
          type: 'loop',
          line: lineNum + 1,
          varName: match[1],
          start,
          end,
          body: [],
        };
        addCommand(cmd);
        blockStack.push({ indent, body: cmd.body! });
      } else {
        errors.push(`Line ${lineNum + 1}: Invalid for loop syntax`);
      }
      continue;
    }

    if (first === 'while') {
      const cond = line.replace(/^\s*while\s+/, '').split(':')[0].trim();
      const cmd: Command = { type: 'loop', line: lineNum + 1, condition: cond, body: [] };
      addCommand(cmd);
      blockStack.push({ indent, body: cmd.body! });
      continue;
    }

    if (first === 'def') {
      const match = trimmed.match(/def\s+(\w+)\s*\(\s*\)\s*:/);
      if (match) {
        const cmd: Command = { type: 'function_call', line: lineNum + 1, varName: match[1], body: [] };
        addCommand(cmd);
        blockStack.push({ indent, body: cmd.body! });
      }
      continue;
    }

    // Simple command: move_up(), water(), etc.
    const cmdMatch = trimmed.match(/^(\w+)\s*\(\s*(.*)\s*\)\s*$/);
    if (cmdMatch) {
      const [, name, argsStr] = cmdMatch;
      if (BUILTINS.has(name)) {
        const args = argsStr ? argsStr.split(',').map((a) => a.trim().replace(/^["']|["']$/g, '')) : [];
        addCommand({ type: name as Command['type'], line: lineNum + 1, args });
      } else {
        errors.push(`Line ${lineNum + 1}: Unknown command '${name}'`);
      }
    }
  }

  return { commands, errors };
}
