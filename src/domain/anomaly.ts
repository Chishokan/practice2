import type { WorldState } from './types';

// 綻びのルールエンジン。宣言的な AnomalyRule を評価して WorldState に静かな異常を注入する。
// 個々の演出（何を書き換えるか）は content/anomalies.ts に置き、ここは汎用の評価器に徹する。
// この層は演出テキストを一切持たない（React・content 非依存）。

export interface AnomalyRule {
  /** ルールの識別子。once 判定の記録キーに使う */
  id: string;
  /** anomalyLevel がこの値以上で発火する */
  threshold: number;
  /** 一度きりで発火するか（true なら適用後は再発火しない） */
  once: boolean;
  /** 発火時の状態変換。純粋関数であること */
  apply: (state: WorldState) => WorldState;
}

// 章ごとの綻びの上限。序盤からバレないよう、第1章は Lv1 に抑える（設計書の温度設計）。
export const CHAPTER_ANOMALY_CAP: Record<1 | 2 | 3, number> = {
  1: 1,
  2: 3,
  3: 4,
};

/**
 * 現在の綻びの強さ（anomalyLevel）を求める。
 * 消した本の数だけ世界が痩せるが、章ごとの上限で発現を抑える。
 */
export function computeAnomalyLevel(state: WorldState): number {
  return Math.min(state.erasedBooks.length, CHAPTER_ANOMALY_CAP[state.chapter]);
}

/** once ルールが適用済みかを記録するフラグキー。通常のフラグ空間と衝突させない */
function appliedKey(ruleId: string): string {
  return `anomaly:${ruleId}`;
}

/**
 * 綻びルールを評価する。章遷移時と整理実行時に呼ぶ。
 * anomalyLevel を更新し、閾値に達したルールを順に適用する。
 * once ルールは flags に適用済みマークを残し、二度は発火しない。
 */
export function evaluateAnomalies(
  state: WorldState,
  rules: AnomalyRule[],
): WorldState {
  let next: WorldState = { ...state, anomalyLevel: computeAnomalyLevel(state) };

  for (const rule of rules) {
    if (next.anomalyLevel < rule.threshold) continue;
    const key = appliedKey(rule.id);
    if (rule.once && next.flags.has(key)) continue;

    next = rule.apply(next);

    if (rule.once) {
      next = { ...next, flags: new Set([...next.flags, key]) };
    }
  }

  return next;
}
