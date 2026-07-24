import { describe, expect, it } from 'vitest';
import { allBooks, getBook } from '../content/books';
import { allVisitors } from '../content/visitors';
import { createInitialWorldState } from './worldState';
import { canAccept, handOver, selectReaction } from './visitor';

const baker = allVisitors.find((v) => v.id === 'v01-baker')!;

function world() {
  return createInitialWorldState({
    shelf: allBooks.map((b) => b.id),
    shelfCapacity: allBooks.length,
  });
}

describe('visitor resolution', () => {
  it('acceptableBooks は受理される', () => {
    expect(canAccept(baker, 'b08-winter-preserves')).toBe(true);
    expect(canAccept(baker, 'b01-town-map')).toBe(false);
  });

  it('個別反応があればそれを、無ければ generic を返す', () => {
    expect(selectReaction(baker, 'b08-winter-preserves')[0].id).toBe('v01-r-preserves');
    expect(selectReaction(baker, 'b01-town-map')).toBe(baker.genericAcceptScene);
  });

  it('手渡すと台帳・フラグ・評判が更新される', () => {
    const next = handOver(world(), baker, 'b08-winter-preserves');
    expect(next.ledger).toHaveLength(1);
    expect(next.ledger[0]).toMatchObject({
      visitorId: 'v01-baker',
      bookId: 'b08-winter-preserves',
    });
    expect(next.flags.has('v01-baker-resolved')).toBe(true);
    expect(next.reputation).toBe(1);
  });

  it('元の state を破壊しない', () => {
    const w = world();
    handOver(w, baker, 'b08-winter-preserves');
    expect(w.ledger).toHaveLength(0);
    expect(w.reputation).toBe(0);
  });
});

// 仮データの整合性：参照ミスを機械的に検出する（設計書の意図）。
describe('content integrity', () => {
  it('全来訪者の acceptableBooks は実在する', () => {
    for (const v of allVisitors) {
      for (const bookId of v.acceptableBooks) {
        expect(getBook(bookId), `${v.id} -> ${bookId}`).toBeDefined();
      }
    }
  });

  it('反応が定義された本も実在する', () => {
    for (const v of allVisitors) {
      for (const bookId of Object.keys(v.reactions)) {
        expect(getBook(bookId), `${v.id} reaction -> ${bookId}`).toBeDefined();
      }
    }
  });
});
