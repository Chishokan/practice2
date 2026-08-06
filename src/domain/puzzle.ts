import type { PuzzleSpec } from './types';

// 遊びの層（§13）の判定。純粋関数・React 非依存。
// 加点を一切持たない＝ミニゲームの成績は conscience／エンド判定に影響しない（§13.2）。

/** レファレンス／欠番：選んだ答えが正解か。 */
export function isChoiceCorrect(spec: PuzzleSpec, choice: string): boolean {
  if (spec.kind === 'reference' || spec.kind === 'gap') return choice === spec.answer;
  return false;
}

/** 照合（対合わせ）：全組が揃ったか。 */
export function isMatchComplete(matchedCount: number, total: number): boolean {
  return total > 0 && matchedCount >= total;
}

/** 本カードと貸出票カードが同じ組か（照合の1手の正否）。 */
export function isPairMatch(spec: PuzzleSpec, bookIndex: number, slipIndex: number): boolean {
  return spec.kind === 'match' && bookIndex === slipIndex;
}

/**
 * 出題データの整合性（詰みなしの前提）：正解が選択肢に含まれる／ヒントが1段以上ある等。
 * 実際の来訪者データをテストで機械検証するために使う。
 */
export function isPuzzleSolvable(spec: PuzzleSpec): boolean {
  if (spec.kind === 'reference') return spec.options.includes(spec.answer);
  if (spec.kind === 'gap') return spec.options.includes(spec.answer);
  if (spec.kind === 'match') return spec.pairs.length > 0;
  return true; // rpg：はなす＝必勝（詳細は domain/rpg.ts）
}
