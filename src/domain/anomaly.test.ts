import { describe, expect, it } from 'vitest';
import { allBooks } from '../content/books';
import { anomalyRules, TOWN_STAGES } from '../content/anomalies';
import { createInitialWorldState } from './worldState';
import { handOver } from './visitor';
import { allVisitors } from '../content/visitors';
import { computeAnomalyLevel, evaluateAnomalies } from './anomaly';

const bookIds = new Set(allBooks.map((b) => b.id));
const baker = allVisitors[0];

function worldWithErased(count: number, chapter: 1 | 2 | 3) {
  const base = createInitialWorldState({
    shelf: allBooks.map((b) => b.id),
    shelfCapacity: allBooks.length,
    townText: TOWN_STAGES[0],
  });
  return {
    ...base,
    chapter,
    erasedBooks: allBooks.slice(0, count).map((b) => b.id),
  };
}

describe('computeAnomalyLevel', () => {
  it('第1章は Lv1 に抑えられる（序盤からバレさせない）', () => {
    expect(computeAnomalyLevel(worldWithErased(3, 1))).toBe(1);
  });
  it('章が進むと上限が上がる', () => {
    expect(computeAnomalyLevel(worldWithErased(3, 2))).toBe(3);
    expect(computeAnomalyLevel(worldWithErased(5, 3))).toBe(4);
  });
});

describe('evaluateAnomalies', () => {
  it('Lv1 で台帳の過去エントリが書き換わる（once）', () => {
    let w = worldWithErased(0, 1);
    w = handOver(w, baker, baker.acceptableBooks[0]); // 台帳に1行
    w = { ...w, erasedBooks: ['x'] }; // Lv1 相当
    const original = w.ledger[0].bookId;

    const after = evaluateAnomalies(w, anomalyRules);
    expect(after.anomalyLevel).toBe(1);
    expect(after.ledger[0].bookId).not.toBe(original);
    // 書き換え先は必ず実在する本（存在しない参照を生まない）
    expect(bookIds.has(after.ledger[0].bookId)).toBe(true);

    // 二度目の評価では再発火しない（once）
    const twice = evaluateAnomalies(after, anomalyRules);
    expect(twice.ledger[0].bookId).toBe(after.ledger[0].bookId);
  });

  it('第1章では街描写・検索ブロックは発現しない（Lv2/Lv4 未満）', () => {
    let w = worldWithErased(3, 1);
    w = { ...w, ledger: [] };
    const after = evaluateAnomalies(w, anomalyRules);
    expect(after.townText).toBe(TOWN_STAGES[0]);
    expect(after.searchBlocked).toEqual([]);
  });

  it('Lv2 以上で街描写が簡素化される', () => {
    const w = worldWithErased(3, 2); // Lv3
    const after = evaluateAnomalies(w, anomalyRules);
    expect(after.townText).not.toBe(TOWN_STAGES[0]);
    expect(after.townText.length).toBeLessThan(TOWN_STAGES[0].length);
  });

  it('Lv4 で検索ブロックが起き、対象は実在する書架の本', () => {
    const w = worldWithErased(5, 3); // Lv4
    const after = evaluateAnomalies(w, anomalyRules);
    expect(after.searchBlocked.length).toBeGreaterThan(0);
    for (const id of after.searchBlocked) {
      expect(bookIds.has(id)).toBe(true);
      expect(after.shelf.includes(id)).toBe(true);
    }
  });
});
