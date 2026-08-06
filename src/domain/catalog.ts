import type { BookId, CatalogEntry, FlagId, WorldState } from './types';

// 収蔵目録の進捗計算（設計書「12.3」）。純粋関数（React・content 非依存）。
// 「降ろす（＝収蔵する）」ことで項目が埋まる。完成には特定の本を降ろすことを要求する。
// 「降ろす＝消える」の因果はここでは一切扱わない（表示はあくまで収蔵の進捗）。

export interface CatalogItemView {
  id: string;
  /** この項目に対応する本。null は予約枠（表示は未記載／開示後のみ絵本として記述） */
  bookId: BookId | null;
  /** 収蔵済みか（対応する本が erasedBooks に含まれる） */
  filled: boolean;
  /** 予約枠か（requiredBookId === null）。決して埋まらない＝完成不能の器 */
  reserved: boolean;
  /** 予約枠の正体が開示済みか（開示後も filled にはならない＝欠落は戻らない） */
  revealed: boolean;
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
 *
 * finalRevealed: 予約枠の正体（金色の絵本）が開示済みか。開示は表示の変化のみで、
 * remaining の数え方も filled も変えない（開示後も埋まらない＝完成不能を維持）。
 */
export function computeCatalog(
  state: WorldState,
  entries: CatalogEntry[],
  finalRevealed = false,
): CatalogView {
  const items: CatalogItemView[] = entries.map((e) => {
    const reserved = e.requiredBookId === null;
    return {
      id: e.id,
      bookId: e.requiredBookId,
      filled: e.requiredBookId !== null && state.erasedBooks.includes(e.requiredBookId),
      reserved,
      revealed: reserved && finalRevealed,
    };
  });
  return {
    items,
    remaining: items.filter((i) => !i.filled).length,
    total: entries.length,
  };
}

/**
 * cat-final の正体を開示すべきなら開示フラグを立てた state を返す（純粋・冪等）。
 * 条件：v17（child 再訪）が解決済み、かつ未開示。開示は「開いたら変わっている」だけ。
 */
export function revealCatalogFinalIfDue(
  state: WorldState,
  v17ResolvedFlag: FlagId,
  revealedFlag: FlagId,
): WorldState {
  if (!state.flags.has(v17ResolvedFlag) || state.flags.has(revealedFlag)) return state;
  return { ...state, flags: new Set([...state.flags, revealedFlag]) };
}

/**
 * 是正3（妖精の一言）を発火してよいか。開示済み、かつ未発火のときだけ true。
 */
export function shouldFireGuideFinalRemark(
  state: WorldState,
  revealedFlag: FlagId,
  remarkFlag: FlagId,
): boolean {
  return state.flags.has(revealedFlag) && !state.flags.has(remarkFlag);
}

/** 是正3 を発火済みにする（再発火防止・純粋）。 */
export function markGuideFinalRemarkFired(state: WorldState, remarkFlag: FlagId): WorldState {
  if (state.flags.has(remarkFlag)) return state;
  return { ...state, flags: new Set([...state.flags, remarkFlag]) };
}
