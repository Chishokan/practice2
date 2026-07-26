import type { BookId, FlagId, Scene, WorldState } from '../domain/types';

// セーブの永続化。localStorage への読み書きと、バージョニングによる旧セーブ移行。
// シリアライズ・移行の中核は純粋関数にして、localStorage 依存を薄い層に閉じ込める。
//
// v2 でセッション・スナップショット方式に移行：周回途中も含む実行状態を丸ごと保存し、
// 中断地点から再開できるようにする（v1 は周回境界のみを保存する旧形式）。

export const SAVE_KEY = 'kashidashi-mikka/save';
export const SAVE_VERSION = 2;

/**
 * 旧 v1：周回を跨いで永続する分だけを保存していた（周回開始点チェックポイント）。
 * 読込時のみ受け付け、周回開始点として復元する（migrate 参照）。
 */
export interface SaveDataV1 {
  version: 1;
  cycle: number;
  erasedBooks: BookId[];
  conscience: number;
}

/** flags(Set) は JSON 化できないため配列で持つ。それ以外は WorldState と同一 */
export interface SerializedWorld extends Omit<WorldState, 'flags'> {
  flags: FlagId[];
}

/**
 * v2：中断地点から再開するためのセッション全体のスナップショット。
 * conscience を含む実行状態がそのまま復元され、途中リロードでも失われない。
 */
export interface SaveDataV2 {
  version: 2;
  world: SerializedWorld;
  visitorIndex: number;
  donationQueue: BookId[];
  donationIndex: number;
  handedOver: boolean;
  characterAnswered: boolean;
  pendingScenes: Scene[] | null;
  screen: string;
}

export type SaveData = SaveDataV1 | SaveDataV2;

/**
 * 任意の入力を読み込める SaveData へ検証する。壊れていれば null。
 * v1/v2 の双方を受け付ける（v1 は store 側で周回開始点として復元される）。
 */
export function migrate(raw: unknown): SaveData | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const data = raw as Record<string, unknown>;

  switch (data.version) {
    case 2:
      return isValidV2(data) ? (data as unknown as SaveDataV2) : null;
    case 1:
      return isValidV1(data) ? (data as unknown as SaveDataV1) : null;
    default:
      // 未知／将来のバージョンは読み込まない（前方互換は求めない）。
      return null;
  }
}

function isValidV1(data: Record<string, unknown>): boolean {
  return (
    typeof data.cycle === 'number' &&
    typeof data.conscience === 'number' &&
    Array.isArray(data.erasedBooks) &&
    data.erasedBooks.every((id) => typeof id === 'string')
  );
}

function isValidV2(data: Record<string, unknown>): boolean {
  if (typeof data.visitorIndex !== 'number') return false;
  if (typeof data.donationIndex !== 'number') return false;
  const world = data.world;
  if (typeof world !== 'object' || world === null) return false;
  const w = world as Record<string, unknown>;
  return (
    typeof w.cycle === 'number' &&
    typeof w.conscience === 'number' &&
    Array.isArray(w.erasedBooks) &&
    Array.isArray(w.flags)
  );
}

/** JSON 文字列へ */
export function serialize(data: SaveData): string {
  return JSON.stringify(data);
}

/** JSON 文字列から。壊れていれば null（例外を投げない） */
export function deserialize(json: string): SaveData | null {
  try {
    return migrate(JSON.parse(json));
  } catch {
    return null;
  }
}

// --- localStorage 依存の薄い層（テスト対象外）。非ブラウザ環境では安全に no-op。

function hasStorage(): boolean {
  return typeof localStorage !== 'undefined';
}

export function loadSave(): SaveData | null {
  if (!hasStorage()) return null;
  const json = localStorage.getItem(SAVE_KEY);
  return json === null ? null : deserialize(json);
}

export function writeSave(data: SaveData): void {
  if (!hasStorage()) return;
  localStorage.setItem(SAVE_KEY, serialize(data));
}

export function clearSave(): void {
  if (!hasStorage()) return;
  localStorage.removeItem(SAVE_KEY);
}
