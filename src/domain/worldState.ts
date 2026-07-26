import type { BookId, WorldState } from './types';

// WorldState の生成・初期化。React に依存させない（domain の規約）。

export interface InitialWorldParams {
  shelf: BookId[];
  shelfCapacity: number;
  /** 窓外の街の初期描写。テキストは content 側から渡す（domain は文言を持たない） */
  townText?: string;
}

/**
 * 新規周回の初期状態を作る。
 * erasedBooks は本来 1周目を跨いで永続するが（設計書「4.」）、
 * その引き継ぎは Phase 3 の範囲。ここでは常に空から始める。
 */
export function createInitialWorldState(params: InitialWorldParams): WorldState {
  return {
    cycle: 1,
    chapter: 1,
    shelf: [...params.shelf],
    shelfCapacity: params.shelfCapacity,
    erasedBooks: [],
    flags: new Set(),
    anomalyLevel: 0,
    ledger: [],
    reputation: 0,
    conscience: 0,
    townText: params.townText ?? '',
    searchBlocked: [],
  };
}

export interface NextCycleParams {
  /** その周回の初期書架（消去分を差し引く前の全体） */
  baseShelf: BookId[];
  shelfCapacity: number;
  /** アンカー「最初の一冊」。毎周必ず書架へ戻る唯一の例外 */
  anchorId: BookId;
  townText?: string;
}

/**
 * 次の周回を始める（設計書「12.4」「4. 周回引き継ぎ」）。
 *
 * - erasedBooks と conscience だけが周回を跨いで永続する。
 * - アンカーは例外：たとえ前周で消していても、書架へ戻し erasedBooks からも外す。
 *   （戻るのは本だけ。それが支えた記憶・記録の回復は扱わない）
 * - その他（ledger・flags・anomaly・reputation・shelf構成）は初期化する。
 */
export function startNextCycle(prev: WorldState, params: NextCycleParams): WorldState {
  // アンカーは消去済み扱いを解く＝再び書架に並ぶ。
  const carriedErased = prev.erasedBooks.filter((id) => id !== params.anchorId);
  // 前周で消した本は書架から欠ける＝周回するほど痩せる。
  const thinnedShelf = params.baseShelf.filter((id) => !carriedErased.includes(id));

  const fresh = createInitialWorldState({
    shelf: thinnedShelf,
    shelfCapacity: params.shelfCapacity,
    townText: params.townText,
  });

  return {
    ...fresh,
    cycle: prev.cycle + 1,
    erasedBooks: carriedErased,
    conscience: prev.conscience,
  };
}
