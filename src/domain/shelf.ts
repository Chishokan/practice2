import type { BookId, WorldState } from './types';

// 書架の追加・降ろす・容量判定。すべて (state, input) => newState の純粋関数。
// state を破壊的に変更しない。

/** 書架が容量を超えているか。超えていれば整理が要求される */
export function isShelfOverCapacity(state: WorldState): boolean {
  return state.shelf.length > state.shelfCapacity;
}

/**
 * 書架に本を1冊加える（新刊の到着など）。
 * すでに書架にある本は二重に積まない。
 */
export function addToShelf(state: WorldState, bookId: BookId): WorldState {
  if (state.shelf.includes(bookId)) return state;
  return { ...state, shelf: [...state.shelf, bookId] };
}

/**
 * 書架から本を降ろす（整理）。降ろした本は erasedBooks に累積する。
 *
 * 消去の波及処理（erasure.ts）は Phase 2 の範囲。ここでは消去済みリストへ
 * 追加するだけに留める。演出・システムメッセージはこの層では一切扱わない。
 */
export function removeFromShelf(state: WorldState, bookId: BookId): WorldState {
  if (!state.shelf.includes(bookId)) return state;
  return {
    ...state,
    shelf: state.shelf.filter((id) => id !== bookId),
    erasedBooks: state.erasedBooks.includes(bookId)
      ? state.erasedBooks
      : [...state.erasedBooks, bookId],
  };
}
