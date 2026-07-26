import { describe, expect, it } from 'vitest';
import { allBooks } from '../content/books';
import { anomalyRules, SEARCH_BLOCK_TARGET } from '../content/anomalies';
import { ANCHOR_BOOK_ID } from '../content/story';
import { createInitialWorldState } from './worldState';
import { evaluateAnomalies } from './anomaly';
import { visibleShelf } from './shelf';

// searchBlock が Lv4 で発動する第3章相当の状態を作る。
function ch3WithSearchBlock() {
  const base = createInitialWorldState({
    shelf: allBooks.map((b) => b.id),
    shelfCapacity: allBooks.length,
  });
  const w = { ...base, chapter: 3 as const, erasedBooks: allBooks.slice(0, 5).map((b) => b.id) };
  return evaluateAnomalies(w, anomalyRules); // Lv4 → searchBlock 発動
}

describe('アンカーと searchBlock の分離', () => {
  it('ANCHOR_BOOK_ID と SEARCH_BLOCK_TARGET は別の本', () => {
    expect(SEARCH_BLOCK_TARGET).not.toBe(ANCHOR_BOOK_ID);
  });

  it('searchBlock が発動してもアンカーは searchBlocked に入らない', () => {
    const w = ch3WithSearchBlock();
    expect(w.searchBlocked).toContain(SEARCH_BLOCK_TARGET); // 発動している前提
    expect(w.searchBlocked).not.toContain(ANCHOR_BOOK_ID);
  });

  it('searchBlock が発動してもアンカーは Shelf 一覧（visibleShelf）に残る', () => {
    const w = ch3WithSearchBlock();
    expect(visibleShelf(w)).toContain(ANCHOR_BOOK_ID);
  });
});

describe('意図的な非対称：探すと無いのに整理には有る', () => {
  it('searchBlock 対象は Shelf 一覧（visibleShelf）から除外される', () => {
    const w = ch3WithSearchBlock();
    expect(visibleShelf(w)).not.toContain(SEARCH_BLOCK_TARGET);
  });

  it('searchBlock 対象は Archive（world.shelf 全体）には残る', () => {
    const w = ch3WithSearchBlock();
    // Archive は shelf 全体を扱う（フィルタしない）
    expect(w.shelf).toContain(SEARCH_BLOCK_TARGET);
  });
});
