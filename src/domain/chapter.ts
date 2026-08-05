// 章進行の境界判定。純粋関数（React・content 非依存）。
// 来訪者列を章ごとに区切り、章が上がる境界で幕間（interlude）を挟む。
// 第3章に来訪者が未執筆でも、第2章の後に第3章へ入る境界を通す（器＝Lv解放のため）。

export interface ChapterTransitionInput {
  /** 現在プレイ中の章 */
  currentChapter: number;
  /** 次に処理する来訪者の位置 */
  nextIndex: number;
  /** 来訪者の総数 */
  total: number;
  /** 次の来訪者の章。nextIndex が総数以上なら null（末尾を越えた） */
  nextVisitorChapter: number | null;
}

export interface ChapterTransitionResult {
  /** 幕間を挟むか（章が上がる） */
  interlude: boolean;
  /** 遷移後の章 */
  chapter: number;
  /** これ以上来訪者がおらず、幕間も無いなら終端 */
  done: boolean;
}

/** 章の最大数（全3章） */
export const MAX_CHAPTER = 3;

/**
 * 次の来訪者へ進む際の章遷移を判定する。
 * - 次の来訪者の章が現在より上なら幕間（その章へ）。
 * - 末尾を越えた場合、まだ最終章に達していなければ次章へ幕間（空章の器）。
 * - それ以外は幕間なし。来訪者が尽きていれば終端。
 */
export function chapterTransition(input: ChapterTransitionInput): ChapterTransitionResult {
  const { currentChapter, nextIndex, total, nextVisitorChapter } = input;

  const targetChapter =
    nextVisitorChapter ??
    (currentChapter < MAX_CHAPTER ? currentChapter + 1 : currentChapter);

  if (targetChapter > currentChapter) {
    return { interlude: true, chapter: targetChapter, done: false };
  }
  return { interlude: false, chapter: currentChapter, done: nextIndex >= total };
}
