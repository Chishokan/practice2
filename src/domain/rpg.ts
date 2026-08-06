// 読み聞かせRPG⑧（§13）の戦闘ロジック。純粋関数・React 非依存。
// b02『竜と鍛冶屋』の正史＝竜と鍛冶屋が友になる。勝ち筋は「はなす」（必勝）。
// 「たたかう」連打でも詰まない：敗北しても最初からやり直せる（ゲームオーバーなし）。
// 成績・試行回数は conscience／エンド判定に影響しない（このモジュールは加点を持たない）。

export type RpgCommand = 'talk' | 'fight' | 'guard';

export interface RpgState {
  smithHp: number;
}

export const RPG_MAX_HP = 3;
export const RPG_INITIAL: RpgState = { smithHp: RPG_MAX_HP };

export interface RpgResult {
  state: RpgState;
  outcome: 'win' | 'continue' | 'lose';
}

/**
 * 1手を解決する。
 * - talk（はなす）＝正史どおり友情で決着＝勝ち（いつでも・必勝）。
 * - guard（まもる）＝竜は手を出さない＝安全・進展なし（はなすへの布石）。
 * - fight（たたかう）＝竜が構え鍛冶屋のHPが減る（友情の物語ゆえ勝てない）。
 *   HP0 で敗北だが、状態は初期へ戻る＝「最初から」やり直せる（詰みなし）。
 */
export function rpgStep(state: RpgState, cmd: RpgCommand): RpgResult {
  if (cmd === 'talk') return { state, outcome: 'win' };
  if (cmd === 'guard') return { state, outcome: 'continue' };
  const smithHp = state.smithHp - 1;
  if (smithHp <= 0) return { state: RPG_INITIAL, outcome: 'lose' };
  return { state: { smithHp }, outcome: 'continue' };
}
