import { describe, expect, it } from 'vitest';
import { allBooks } from '../content/books';
import { ANCHOR_BOOK_ID } from '../content/story';
import { createInitialWorldState, startNextCycle } from './worldState';
import type { WorldState } from './types';

// gameStore の INITIAL_SHELF / CYCLE_PARAMS と同じ実構成を再現して検証する
// （store は localStorage/subscribe を伴うため、周回ロジックのみを純粋に測る）。
const BASE_SHELF = allBooks.slice(0, 9).map((b) => b.id);
const params = {
  baseShelf: BASE_SHELF,
  shelfCapacity: BASE_SHELF.length,
  anchorId: ANCHOR_BOOK_ID,
};

function endedCycleWith(erased: string[]): WorldState {
  return {
    ...createInitialWorldState({ shelf: BASE_SHELF, shelfCapacity: BASE_SHELF.length }),
    erasedBooks: erased,
    cycle: 1,
  };
}

describe('アンカー復活（実構成での検証）', () => {
  it('前提：アンカーは baseShelf に含まれる（filter 実装の成立条件）', () => {
    // これが崩れると「能動 push なし」の filter 実装はアンカーを復活できない。
    // 将来アンカーや初期書架を変える人への早期警告としてのガード。
    expect(BASE_SHELF).toContain(ANCHOR_BOOK_ID);
  });

  it('1周目でアンカーを降ろしても、2周目の書架にアンカーが存在する', () => {
    const next = startNextCycle(endedCycleWith([ANCHOR_BOOK_ID, 'b01-town-map']), params);
    expect(next.shelf).toContain(ANCHOR_BOOK_ID);
  });

  it('アンカー以外の消去済みの本は、2周目の書架に存在しない', () => {
    const next = startNextCycle(endedCycleWith([ANCHOR_BOOK_ID, 'b01-town-map']), params);
    expect(next.shelf).not.toContain('b01-town-map');
  });

  it('アンカーは erasedBooks からも外れる（この周回では未消去＝ゲートA成立可能）', () => {
    const next = startNextCycle(endedCycleWith([ANCHOR_BOOK_ID, 'b01-town-map']), params);
    expect(next.erasedBooks).not.toContain(ANCHOR_BOOK_ID);
    expect(next.erasedBooks).toContain('b01-town-map');
  });
});

describe('アンカーが戻っても、失われたものは戻らない（損失は永続）', () => {
  // 設計 §12.4：戻るのは本だけ。それが支えた記憶・記録は戻らない。
  // 実装上、損失の源である erasedBooks（アンカー以外）は永続し、世界は痩せたまま。
  it('他の消去済みの本は erasedBooks に残り、書架から欠けたまま', () => {
    const next = startNextCycle(
      endedCycleWith([ANCHOR_BOOK_ID, 'b02-dragon-smith', 'b03-herb-guide']),
      params,
    );
    expect(next.erasedBooks).toEqual(['b02-dragon-smith', 'b03-herb-guide']);
    expect(next.shelf).not.toContain('b02-dragon-smith');
    expect(next.shelf).not.toContain('b03-herb-guide');
  });

  it('消した本の数（アンカー除く）は減らない＝世界は痩せ続ける', () => {
    const erased = [ANCHOR_BOOK_ID, 'b02-dragon-smith', 'b03-herb-guide', 'b04-harbor-chronicle'];
    const next = startNextCycle(endedCycleWith(erased), params);
    expect(next.erasedBooks.length).toBe(3);
  });

  // searchBlock / ledgerRewrite（目録の欠落）は周回開始時点では派生状態として
  // 初期化されるが、損失源の erasedBooks が永続するため、新周回の整理進行で
  // 再発現し得る。アンカーの復活はこの損失を healing しない。
  it('周回開始時、綻びの派生状態は初期化されるが損失源は残る', () => {
    const prev = {
      ...endedCycleWith([ANCHOR_BOOK_ID, 'b02-dragon-smith']),
      searchBlocked: ['b09-kingdoms'],
      anomalyLevel: 4,
    };
    const next = startNextCycle(prev, params);
    // 派生状態（表示）はリセットされる
    expect(next.searchBlocked).toEqual([]);
    expect(next.anomalyLevel).toBe(0);
    // だが損失源は残るので、綻びは再発現し得る（世界は回復しない）
    expect(next.erasedBooks).toContain('b02-dragon-smith');
  });
});
