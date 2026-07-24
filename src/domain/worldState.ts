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
    townText: params.townText ?? '',
    searchBlocked: [],
  };
}
