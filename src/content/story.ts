import type { BookId, FlagId } from '../domain/types';
import type { EndingConfig, EndingId } from '../domain/endings';

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

/** エンディング判定に渡す設定（domain は content 非依存のため引数で受ける） */
export const ENDING_CONFIG: EndingConfig = {
  anchorId: ANCHOR_BOOK_ID,
  conscienceThreshold: CONSCIENCE_THRESHOLD,
  goodLibrarianHandovers: GOOD_LIBRARIAN_HANDOVERS,
  flags: {
    truthReached: FLAG_TRUTH_REACHED,
    choseClose: FLAG_CHOSE_CLOSE,
    choseBequeath: FLAG_CHOSE_BEQUEATH,
  },
};

/** エンディングの表示名（識別子は英語、表示テキストは日本語） */
export const ENDING_LABELS: Record<EndingId, string> = {
  E1: '良き司書',
  E2: '空の書架',
  E3: '閉架',
  E4: '継承',
  TRUE: '最初の一冊',
};

// 章の幕間（静かに。大げさな演出はしない。地の文1行）。文言は仮（ディレクター承認対象）。
export const CHAPTER_INTERLUDES: Record<number, { title: string; line: string }> = {
  2: { title: '第二章', line: '季節がひとつ、めぐった。図書館の日々は、変わらず続いていく。' },
  3: { title: '第三章', line: 'また季節がめぐる。目録は、少しずつ埋まっていく。' },
};
