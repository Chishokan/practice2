import { describe, expect, it } from 'vitest';
import type { CatalogEntry } from './types';
import { createInitialWorldState } from './worldState';
import {
  computeCatalog,
  revealCatalogFinalIfDue,
  shouldFireGuideFinalRemark,
  markGuideFinalRemarkFired,
} from './catalog';

const entries: CatalogEntry[] = [
  { id: 'e1', requiredBookId: 'a' },
  { id: 'e2', requiredBookId: 'b' },
  { id: 'final', requiredBookId: null },
];

const V17 = 'v17-child-return-resolved';
const REVEALED = 'catalog-final-revealed';
const REMARK = 'guide-final-remark-shown';

function world(erased: string[]) {
  return { ...createInitialWorldState({ shelf: [], shelfCapacity: 0 }), erasedBooks: erased };
}

function worldWithFlags(flags: string[]) {
  return { ...createInitialWorldState({ shelf: [], shelfCapacity: 0 }), flags: new Set(flags) };
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

  it('開示前後で予約枠の filled と remaining は不変（開示は表示のみ）', () => {
    const before = computeCatalog(world(['a', 'b']), entries, false);
    const after = computeCatalog(world(['a', 'b']), entries, true);
    expect(before.items[2].reserved).toBe(true);
    expect(before.items[2].revealed).toBe(false);
    expect(after.items[2].revealed).toBe(true); // 表示だけ変わる
    expect(after.items[2].filled).toBe(false); // 収蔵済にはならない
    expect(after.remaining).toBe(before.remaining); // 完成不能は維持
  });
});

describe('revealCatalogFinalIfDue', () => {
  it('v17 未解決なら開示しない', () => {
    const s = revealCatalogFinalIfDue(worldWithFlags([]), V17, REVEALED);
    expect(s.flags.has(REVEALED)).toBe(false);
  });

  it('v17 解決済み・未開示なら開示フラグを立てる', () => {
    const s = revealCatalogFinalIfDue(worldWithFlags([V17]), V17, REVEALED);
    expect(s.flags.has(REVEALED)).toBe(true);
  });

  it('冪等：既に開示済みなら同一参照を返す（二重処理しない）', () => {
    const w = worldWithFlags([V17, REVEALED]);
    expect(revealCatalogFinalIfDue(w, V17, REVEALED)).toBe(w);
  });
});

describe('是正3（guide final remark）ゲート', () => {
  it('開示済み・未発火なら発火してよい', () => {
    expect(shouldFireGuideFinalRemark(worldWithFlags([REVEALED]), REVEALED, REMARK)).toBe(true);
  });

  it('未開示なら発火しない', () => {
    expect(shouldFireGuideFinalRemark(worldWithFlags([]), REVEALED, REMARK)).toBe(false);
  });

  it('一度発火したら二度と発火しない', () => {
    const fired = markGuideFinalRemarkFired(worldWithFlags([REVEALED]), REMARK);
    expect(fired.flags.has(REMARK)).toBe(true);
    expect(shouldFireGuideFinalRemark(fired, REVEALED, REMARK)).toBe(false);
  });
});
