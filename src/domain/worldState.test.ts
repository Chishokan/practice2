import { describe, expect, it } from 'vitest';
import { createInitialWorldState, startNextCycle } from './worldState';
import type { WorldState } from './types';

const BASE_SHELF = ['anchor', 'a', 'b', 'c'];
const params = { baseShelf: BASE_SHELF, shelfCapacity: 4, anchorId: 'anchor' };

function endedCycle(overrides: Partial<WorldState>): WorldState {
  return {
    ...createInitialWorldState({ shelf: BASE_SHELF, shelfCapacity: 4 }),
    ...overrides,
  };
}

describe('startNextCycle', () => {
  it('erasedBooks と conscience は周回を跨いで永続する', () => {
    const prev = endedCycle({ erasedBooks: ['a', 'b'], conscience: 4, cycle: 1 });
    const next = startNextCycle(prev, params);
    expect(next.cycle).toBe(2);
    expect(next.erasedBooks).toEqual(['a', 'b']);
    expect(next.conscience).toBe(4);
  });

  it('前周で消した本は書架から欠ける（周回で痩せる）', () => {
    const prev = endedCycle({ erasedBooks: ['a', 'b'] });
    const next = startNextCycle(prev, params);
    expect(next.shelf).toEqual(['anchor', 'c']);
  });

  it('アンカーは消していても書架に戻り、erasedBooks からも外れる', () => {
    const prev = endedCycle({ erasedBooks: ['anchor', 'a'] });
    const next = startNextCycle(prev, params);
    expect(next.shelf).toContain('anchor');
    expect(next.erasedBooks).toEqual(['a']);
  });

  it('その他の状態は初期化される', () => {
    const prev = endedCycle({
      erasedBooks: ['a'],
      reputation: 5,
      anomalyLevel: 3,
      flags: new Set(['x']),
      ledger: [{ id: 'L1', cycle: 1, visitorId: 'v', bookId: 'a' }],
    });
    const next = startNextCycle(prev, params);
    expect(next.reputation).toBe(0);
    expect(next.anomalyLevel).toBe(0);
    expect(next.flags.size).toBe(0);
    expect(next.ledger).toEqual([]);
    expect(next.chapter).toBe(1);
  });
});
