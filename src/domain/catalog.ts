import type { BookId, CatalogEntry, WorldState } from './types';

// 収蔵目録の進捗計算（設計書「12.3」）。純粋関数（React・content 非依存）。
// 「降ろす（＝収蔵する）」ことで項目が埋まる。完成には特定の本を降ろすことを要求する。
// 「降ろす＝消える」の因果はここでは一切扱わない（表示はあくまで収蔵の進捗）。

export interface CatalogItemView {
  id: string;
  /** この項目に対応する本。null は予約枠（表示は未記載） */
  bookId: BookId | null;
  /** 収蔵済みか（対応する本が erasedBooks に含まれる） */
  filled: boolean;
}

export interface CatalogView {
  items: CatalogItemView[];
  /** まだ埋まっていない項目数（「あと◯冊で完成」の◯） */
  remaining: number;
  total: number;
}

/**
 * 現在の状態から目録の進捗を導く。
 * 予約枠（requiredBookId === null）は決して埋まらない＝常に remaining に残る。
 * 後の章で項目の差し替え・非表示ができるよう、id を保った view を返す。
 */
export function computeCatalog(state: WorldState, entries: CatalogEntry[]): CatalogView {
  const items: CatalogItemView[] = entries.map((e) => ({
    id: e.id,
    bookId: e.requiredBookId,
    filled: e.requiredBookId !== null && state.erasedBooks.includes(e.requiredBookId),
  }));
  return {
    items,
    remaining: items.filter((i) => !i.filled).length,
    total: entries.length,
  };
}
