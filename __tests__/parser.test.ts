import { parse } from '../src/interpreter/parser';

describe('Parser', () => {
  it('parses simple move commands', () => {
    const { commands, errors } = parse('move_right()\nmove_up()');
    expect(errors).toHaveLength(0);
    expect(commands).toHaveLength(2);
    expect(commands[0].type).toBe('move_right');
    expect(commands[1].type).toBe('move_up');
  });

  it('parses for loop with range', () => {
    const { commands, errors } = parse('for i in range(5):\n    move_right()');
    expect(errors).toHaveLength(0);
    expect(commands).toHaveLength(1);
    expect(commands[0].type).toBe('loop');
    expect(commands[0].start).toBe(0);
    expect(commands[0].end).toBe(5);
    expect(commands[0].body).toHaveLength(1);
    expect(commands[0].body![0].type).toBe('move_right');
  });

  it('parses for loop with range(start, end)', () => {
    const { commands, errors } = parse('for i in range(2, 5):\n    move_right()');
    expect(errors).toHaveLength(0);
    expect(commands[0].type).toBe('loop');
    expect(commands[0].start).toBe(2);
    expect(commands[0].end).toBe(5);
  });

  it('rejects unknown commands', () => {
    const { errors } = parse('unknown_cmd()');
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('Unknown command');
  });

  it('ignores comments', () => {
    const { commands, errors } = parse('# comment\nmove_right()');
    expect(errors).toHaveLength(0);
    expect(commands).toHaveLength(1);
  });
});
