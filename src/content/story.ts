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

// child 再訪（v17）の解決フラグ。cat-final 開示の前提（v17 完了後に開示する）。
export const FLAG_V17_RESOLVED: FlagId = 'v17-child-return-resolved';
// 収蔵目録の予約枠（cat-final）の正体開示フラグ。v17 完了後、次に目録を開いたとき立つ。
export const FLAG_CATALOG_FINAL_REVEALED: FlagId = 'catalog-final-revealed';
// 是正3（妖精の「……見つかりませんでしたか」）を一度だけにするためのフラグ。
export const FLAG_GUIDE_FINAL_REMARK: FlagId = 'guide-final-remark-shown';

/** 予約枠のエントリ id（開示対象の特定に使う） */
export const CATALOG_FINAL_ID = 'cat-final';

// 地下探索（beat 18a）で立つフラグ。
/** ⑦地下の錠を解いた（保存庫が開いた）。再入時に錠をやり直させないため永続化する */
export const FLAG_BASEMENT_UNLOCKED: FlagId = 'basement-unlocked';
/** 金色の絵本を手に取った（持ち出す/読む/戻すの決断は 18b） */
export const FLAG_GOLDEN_BOOK_FOUND: FlagId = 'golden-book-found';
/**
 * 開示後の cat-final 行の表示題（ディレクター確定）。
 * 目録は絵本を「記述」できても「名指せ」ない——名は目録に載らない原則を目録自身に演じさせる。
 */
export const CATALOG_FINAL_REVEAL_LABEL = '金色の絵本（題不詳）';

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
