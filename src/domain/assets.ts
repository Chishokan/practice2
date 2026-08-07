import type { FlagId } from './types';

// アセット解決の純粋関数（React・URL 非依存＝キー/IDのみ返す）。
// 表示（img 生成・fallback）は UI 層に置く。ここは「どのアセットか」の対応だけを持つ。

// 再訪は元の来訪者の立ち絵を使い回す（1人1枚固定・表情差分禁止）。
const RETURN_TO_BASE: Record<string, string> = {
  'v07-baker-return': 'v01-baker',
  'v13-teacher-return': 'v05-teacher',
  'v14-sailor-return': 'v02-sailor',
  'v15-antiquarian-return': 'v10-antiquarian',
  'v16-musician-return': 'v11-musician',
  'v17-child-return': 'v03-child',
};

/** 来訪者IDから立ち絵の基準ID（再訪は元の人物へ寄せる）。 */
export function portraitId(visitorId: string): string {
  return RETURN_TO_BASE[visitorId] ?? visitorId;
}

/** 妖精のフォーム。redeemed フラグが立っていれば救済の姿、道中は基本形。 */
export function guideForm(flags: Set<FlagId>, redeemedFlag: FlagId): 'base' | 'redeemed' {
  return flags.has(redeemedFlag) ? 'redeemed' : 'base';
}

/**
 * 画面に対応する背景キー（無ければ null＝背景画像なしで現行UIのまま）。
 * 受付は最終閉館日のみ西日差分、救済（TRUEエピローグ）は晴天差分。
 */
export function backgroundKey(
  screen: string,
  opts: { finalDay?: boolean } = {},
): string | null {
  switch (screen) {
    case 'reception':
      return opts.finalDay ? 'reception-dusk' : 'reception';
    case 'shelf':
      return 'shelf';
    case 'archive':
      return 'archive';
    case 'basement':
      return 'basement';
    case 'rescue':
      return 'reception-clear';
    default:
      return null;
  }
}
