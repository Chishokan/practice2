import { describe, expect, it } from 'vitest';
import { createInitialWorldState } from './worldState';
import { applyChoice } from './choice';

function world() {
  return createInitialWorldState({ shelf: [], shelfCapacity: 0 });
}

describe('applyChoice', () => {
  it('conscienceDelta を評価値へ加える', () => {
    const next = applyChoice(world(), { id: 'c', text: '…', conscienceDelta: 2 });
    expect(next.conscience).toBe(2);
  });

  it('delta 省略時は評価値が変わらない', () => {
    expect(applyChoice(world(), { id: 'c', text: '…' }).conscience).toBe(0);
  });

  it('flags を立てる', () => {
    const next = applyChoice(world(), { id: 'c', text: '…', flags: ['f1'] });
    expect(next.flags.has('f1')).toBe(true);
  });

  it('元の state を破壊しない', () => {
    const w = world();
    applyChoice(w, { id: 'c', text: '…', conscienceDelta: 5, flags: ['f'] });
    expect(w.conscience).toBe(0);
    expect(w.flags.size).toBe(0);
  });
});
