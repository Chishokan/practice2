import type { BookId, FlagId, WorldState } from './types';

// エンディング判定（設計書「6.」＋「12.6」の2段ゲート）。純粋関数・React非依存。
// 表示名は content 側に置き、ここは EndingId のみ返す（識別子は英語）。

export type EndingId = 'E1' | 'E2' | 'E3' | 'E4' | 'TRUE';

export interface EndingConfig {
  /** アンカー「最初の一冊」。ゲートAの対象 */
  anchorId: BookId;
  /** ゲートBの基準（conscience >= threshold） */
  conscienceThreshold: number;
  /** E1「良き司書」に至る手渡し数の目安 */
  goodLibrarianHandovers: number;
  flags: {
    truthReached: FlagId;
    choseClose: FlagId;
    choseBequeath: FlagId;
  };
}

/** ゲートA：この周回でアンカーを消していない（結果の軸） */
export function isAnchorPreserved(state: WorldState, anchorId: BookId): boolean {
  return !state.erasedBooks.includes(anchorId);
}

/** ゲートB：累積の人柄が基準に達している（意志の軸） */
export function meetsConscienceGate(state: WorldState, threshold: number): boolean {
  return state.conscience >= threshold;
}

/**
 * 現在の状態からエンディングを決める。
 * 優先順位：救済(TRUE) → 閉架(E3) → 継承(E4) → 良き司書(E1) → 空の書架(E2)。
 * E1 が「最も多く消した＝最悪」である反転構造は設計書「6.」のまま。
 */
export function determineEnding(state: WorldState, cfg: EndingConfig): EndingId {
  const truth = state.flags.has(cfg.flags.truthReached);
  const anchorSafe = isAnchorPreserved(state, cfg.anchorId);
  const conscienceOk = meetsConscienceGate(state, cfg.conscienceThreshold);

  // TRUE：真相に至り、両ゲート成立で案内役の救済が入る。
  if (truth && anchorSafe && conscienceOk) return 'TRUE';

  // E3 閉架：真相に至り、図書館を閉じることを選ぶ。
  if (truth && state.flags.has(cfg.flags.choseClose)) return 'E3';

  // E4 継承：台帳を次の司書に遺す（2周目への導線）。
  if (state.flags.has(cfg.flags.choseBequeath)) return 'E4';

  // E1 良き司書：多くの来訪者を満足させた＝最も多く消した最悪の結末。
  if (state.ledger.length >= cfg.goodLibrarianHandovers) return 'E1';

  // E2 空の書架：ほとんど渡さなかった。誰も救えないが世界は残る。
  return 'E2';
}
