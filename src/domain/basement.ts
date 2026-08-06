import type { FlagId, WorldState } from './types';

// 地下探索（beat 18a）の純粋関数。React・content 非依存。

/**
 * 「降りてみる」＝真相到達の契機（§12.6・A-1裁定）。
 * truth-reached フラグと conscience+1 を同居させる。ただし二重加算しない：
 * 既に真相到達済みなら状態を変えない（再入で conscience が増え続けない）。
 */
export function applyDescent(state: WorldState, truthFlag: FlagId): WorldState {
  if (state.flags.has(truthFlag)) return state;
  return {
    ...state,
    flags: new Set([...state.flags, truthFlag]),
    conscience: state.conscience + 1,
  };
}

/** フラグを立てる（冪等）。地下の進行マーカー（錠解除・絵本発見）に使う。 */
export function addFlag(state: WorldState, flag: FlagId): WorldState {
  if (state.flags.has(flag)) return state;
  return { ...state, flags: new Set([...state.flags, flag]) };
}

/**
 * ⑦地下の錠の判定（§13）。正解＝収蔵目録の並び順。
 * 成績・試行回数は conscience に一切影響させない（判定はここに閉じ、加点を持たない）。
 */
export function isLockSolved(arrangement: string[], correctOrder: string[]): boolean {
  if (arrangement.length !== correctOrder.length) return false;
  return arrangement.every((id, i) => id === correctOrder[i]);
}
