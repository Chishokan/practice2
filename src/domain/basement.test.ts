import { describe, expect, it } from 'vitest';
import { createInitialWorldState } from './worldState';
import { applyDescent, addFlag, isLockSolved } from './basement';

const TRUTH = 'truth-reached';

function world() {
  return createInitialWorldState({ shelf: [], shelfCapacity: 0 });
}

describe('applyDescent', () => {
  it('初回の降下で truth-reached と conscience+1 が同居する', () => {
    const s = applyDescent(world(), TRUTH);
    expect(s.flags.has(TRUTH)).toBe(true);
    expect(s.conscience).toBe(1);
  });

  it('二度目の降下では conscience を再加算しない（冪等）', () => {
    const once = applyDescent(world(), TRUTH);
    const twice = applyDescent(once, TRUTH);
    expect(twice.conscience).toBe(1);
    expect(twice).toBe(once); // 変化なし＝同一参照
  });
});

describe('addFlag', () => {
  it('未設定なら立て、設定済みなら同一参照を返す', () => {
    const s = addFlag(world(), 'basement-unlocked');
    expect(s.flags.has('basement-unlocked')).toBe(true);
    expect(addFlag(s, 'basement-unlocked')).toBe(s);
  });
});

describe('isLockSolved（⑦地下の錠）', () => {
  const correct = ['a', 'b', 'c'];
  it('目録の並び順に一致すれば解ける', () => {
    expect(isLockSolved(['a', 'b', 'c'], correct)).toBe(true);
  });
  it('順序違いは解けない', () => {
    expect(isLockSolved(['a', 'c', 'b'], correct)).toBe(false);
  });
  it('途中までは解けない', () => {
    expect(isLockSolved(['a', 'b'], correct)).toBe(false);
  });
});
