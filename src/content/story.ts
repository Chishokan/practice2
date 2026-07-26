import type { BookId, FlagId } from '../domain/types';

// メインストーリーの定数（設計書「12.」）。数値・IDの一元管理。
// 表示テキストとロジックを分けるため、domain はこれらを引数で受け取る。

/**
 * アンカー「最初の一冊」。館の創立の一冊で、周回永続の唯一の例外。
 * 案内役が潜んでいた本とは別（設計書 12.2/12.4）。
 */
export const ANCHOR_BOOK_ID: BookId = 'b07-library-plan';

/** トゥルーの意志ゲート（B）の基準値。conscience がこれ以上で成立 */
export const CONSCIENCE_THRESHOLD = 3;

// エンディング分岐を表すフラグ。物語シーンが立てる（Phase 4/6 で配線）。
export const FLAG_TRUTH_REACHED: FlagId = 'truth-reached';
export const FLAG_CHOSE_CLOSE: FlagId = 'chose-close';
export const FLAG_CHOSE_BEQUEATH: FlagId = 'chose-bequeath';

/** E1「良き司書」に至る手渡し数の目安（全来訪者を満足させた水準） */
export const GOOD_LIBRARIAN_HANDOVERS = 3;
