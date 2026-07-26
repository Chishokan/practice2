import type { Choice, WorldState } from './types';

// 性格スケッチ選択の適用。純粋関数（React非依存）。
// 効果は不可視のものに限る（conscience 加算・フラグ付与）。本筋・書架には触れない。

/**
 * 選択を state に反映する。
 * conscienceDelta を評価値へ加え、あれば flags を立てた新しい state を返す。
 * フィードバックや本の正誤には一切影響しない（合流の原則）。
 */
export function applyChoice(state: WorldState, choice: Choice): WorldState {
  return {
    ...state,
    conscience: state.conscience + (choice.conscienceDelta ?? 0),
    flags: choice.flags ? new Set([...state.flags, ...choice.flags]) : state.flags,
  };
}
