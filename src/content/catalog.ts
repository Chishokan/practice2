import type { CatalogEntry } from '../domain/types';

// 収蔵目録（先代の遺した創立コレクション）。降ろす（＝収蔵する）ことで埋まる。
// 争点は「完成」——妖精にとっての完成（閉じること）と、司書にとっての完成（未完のまま
// 回り続けること）が衝突する。目録UIの文言はこの「完成」の語彙で統一する。
//
// 創立コレクションはアンカー（b07・TRUEの要）と searchBlock 標的（b09・単独維持）を含めない。
// 目録の最終盤に、現存蔵書のどれとも一致しない一冊分の枠を予約する（下記 cat-final）。
// この予約枠の正体・文言・開示は第3章執筆セッションで行う。本セッションでは器のみ。
export const catalogEntries: CatalogEntry[] = [
  { id: 'cat-b01', requiredBookId: 'b01-town-map' },
  { id: 'cat-b02', requiredBookId: 'b02-dragon-smith' },
  { id: 'cat-b03', requiredBookId: 'b03-herb-guide' },
  { id: 'cat-b04', requiredBookId: 'b04-harbor-chronicle' },
  { id: 'cat-b05', requiredBookId: 'b05-reading-stars' },
  { id: 'cat-b06', requiredBookId: 'b06-lullabies' },
  { id: 'cat-b08', requiredBookId: 'b08-winter-preserves' },
  // 第3章で使用する予約枠（現存蔵書のどれとも一致しない一冊分の器）。表示は当面「──」。
  { id: 'cat-final', requiredBookId: null },
];
