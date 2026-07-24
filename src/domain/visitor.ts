import type { BookId, Scene, Visitor, WorldState } from './types';

// 来訪者への手渡し判定・反応選択・解決処理。すべて純粋関数（React非依存）。

/** その本が来訪者の要望に応え得るか */
export function canAccept(visitor: Visitor, bookId: BookId): boolean {
  return visitor.acceptableBooks.includes(bookId);
}

/**
 * 手渡した本に対する反応シーンを選ぶ。
 * 本ごとの個別反応があればそれを、無ければ generic にフォールバックする。
 */
export function selectReaction(visitor: Visitor, bookId: BookId): Scene[] {
  return visitor.reactions[bookId] ?? visitor.genericAcceptScene;
}

/**
 * 来訪者に本を手渡して解決する。
 * 台帳に1行を加え、解決フラグを立て、評判を上げた新しい state を返す。
 * 反応テキストの表示は UI 層の責務。ここでは状態のみを扱う。
 */
export function handOver(
  state: WorldState,
  visitor: Visitor,
  bookId: BookId,
): WorldState {
  const entry = {
    id: `L${state.ledger.length + 1}`,
    cycle: state.cycle,
    visitorId: visitor.id,
    bookId,
  };
  return {
    ...state,
    ledger: [...state.ledger, entry],
    flags: new Set([...state.flags, ...visitor.flagsOnResolve]),
    reputation: state.reputation + 1,
  };
}
