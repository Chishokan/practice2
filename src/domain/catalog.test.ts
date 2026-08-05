import { describe, expect, it } from 'vitest';
import type { CatalogEntry } from './types';
import { createInitialWorldState } from './worldState';
import { computeCatalog } from './catalog';

const entries: CatalogEntry[] = [
  { id: 'e1', requiredBookId: 'a' },
  { id: 'e2', requiredBookId: 'b' },
  { id: 'final', requiredBookId: null },
];

function world(erased: string[]) {
  return { ...createInitialWorldState({ shelf: [], shelfCapacity: 0 }), erasedBooks: erased };
}

describe('computeCatalog', () => {
  it('初期は誰も収蔵されておらず、全項目が残る', () => {
    const v = computeCatalog(world([]), entries);
    expect(v.total).toBe(3);
    expect(v.remaining).toBe(3);
    expect(v.items.map((i) => i.filled)).toEqual([false, false, false]);
  });

  it('降ろした本の項目が埋まる', () => {
    const v = computeCatalog(world(['a']), entries);
    expect(v.items[0].filled).toBe(true);
    expect(v.remaining).toBe(2);
  });

  it('予約枠（requiredBookId=null）は決して埋まらない＝完成しきれない', () => {
    const v = computeCatalog(world(['a', 'b']), entries);
    expect(v.items[0].filled).toBe(true);
    expect(v.items[1].filled).toBe(true);
    expect(v.items[2].filled).toBe(false); // 予約枠
    expect(v.remaining).toBe(1); // 常に1以上残る
  });
});
