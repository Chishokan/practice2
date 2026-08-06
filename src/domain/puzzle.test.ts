import { describe, expect, it } from 'vitest';
import { isChoiceCorrect, isMatchComplete, isPairMatch, isPuzzleSolvable } from './puzzle';
import { determineEnding } from './endings';
import type { EndingConfig } from './endings';
import { createInitialWorldState } from './worldState';
import type { PuzzleSpec } from './types';
import { allVisitors } from '../content/visitors';

const ref: PuzzleSpec = { kind: 'reference', question: 'q', options: ['a', 'b', 'c'], answer: 'b' };
const gap: PuzzleSpec = { kind: 'gap', question: 'q', cells: ['2', '□'], options: ['7', '8'], answer: '8' };
const match: PuzzleSpec = { kind: 'match', pairs: [{ book: 'x', slip: 'x/loan' }] };

describe('puzzle 判定', () => {
  it('reference/gap は正解のみ true', () => {
    expect(isChoiceCorrect(ref, 'b')).toBe(true);
    expect(isChoiceCorrect(ref, 'a')).toBe(false);
    expect(isChoiceCorrect(gap, '8')).toBe(true);
    expect(isChoiceCorrect(gap, '7')).toBe(false);
  });
  it('照合は全組で完了、同組のみ一致', () => {
    expect(isMatchComplete(1, 1)).toBe(true);
    expect(isMatchComplete(1, 4)).toBe(false);
    expect(isMatchComplete(0, 0)).toBe(false);
    expect(isPairMatch(match, 0, 0)).toBe(true);
    expect(isPairMatch(match, 0, 1)).toBe(false);
  });
});

describe('遊びの層は必ず解ける（詰みなし）＝出題データの整合', () => {
  const gated = allVisitors.filter((v) => v.puzzleGate);
  it('少なくとも3人にゲートがある（sailor/clerk/antiquarian）', () => {
    expect(gated.length).toBeGreaterThanOrEqual(3);
  });
  for (const v of gated) {
    it(`${v.id}: 正解が選択肢内／組が1つ以上・ヒントが2段以上`, () => {
      const g = v.puzzleGate!;
      expect(isPuzzleSolvable(g.puzzle)).toBe(true);
      expect(g.hints.length).toBeGreaterThanOrEqual(2);
    });
  }
});

describe('ミニゲームの成績はエンド判定に影響しない（§13.2）', () => {
  const cfg: EndingConfig = {
    anchorId: 'anchor',
    conscienceThreshold: 3,
    goodLibrarianHandovers: 3,
    flags: { truthReached: 'truth-reached', choseClose: 'chose-close', choseBequeath: 'chose-bequeath' },
  };
  it('パズル解決フラグを足しても determineEnding は変わらない', () => {
    const base = createInitialWorldState({ shelf: ['anchor'], shelfCapacity: 1 });
    const before = determineEnding(base, cfg);
    const withPuzzle = { ...base, flags: new Set(['v02-sailor-puzzle', 'v09-clerk-puzzle']) };
    expect(determineEnding(withPuzzle, cfg)).toBe(before);
  });
});
