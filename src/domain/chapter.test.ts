import { describe, expect, it } from 'vitest';
import { chapterTransition } from './chapter';

// 来訪者の章割当（モック）：1-6=第1章、7-12=第2章、13+=第3章。
const CHAPTERS = [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2]; // 12人（第3章来訪者は未執筆）
const TOTAL = CHAPTERS.length;
const chapterAt = (i: number): number | null => (i < TOTAL ? CHAPTERS[i] : null);

function step(currentChapter: number, nextIndex: number) {
  return chapterTransition({
    currentChapter,
    nextIndex,
    total: TOTAL,
    nextVisitorChapter: chapterAt(nextIndex),
  });
}

describe('chapterTransition', () => {
  it('同章内の移動では幕間を挟まない', () => {
    expect(step(1, 3)).toEqual({ interlude: false, chapter: 1, done: false });
  });

  it('第1章→第2章（6人目の後）で幕間', () => {
    expect(step(1, 6)).toEqual({ interlude: true, chapter: 2, done: false });
  });

  it('第2章→第3章（12人目の後・末尾越え）で幕間（空章の器へ）', () => {
    expect(step(2, 12)).toEqual({ interlude: true, chapter: 3, done: false });
  });

  it('第3章で来訪者が尽きたら終端', () => {
    // 第3章に来訪者を1人モックで足したケース
    const withCh3 = chapterTransition({
      currentChapter: 3,
      nextIndex: 13,
      total: 13,
      nextVisitorChapter: null,
    });
    expect(withCh3).toEqual({ interlude: false, chapter: 3, done: true });
  });

  it('第3章の来訪者間では幕間なし（モック）', () => {
    const t = chapterTransition({
      currentChapter: 3,
      nextIndex: 13,
      total: 15,
      nextVisitorChapter: 3,
    });
    expect(t).toEqual({ interlude: false, chapter: 3, done: false });
  });
});
