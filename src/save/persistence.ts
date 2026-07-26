import type { BookId, WorldState } from '../domain/types';

// セーブの永続化。localStorage への読み書きと、バージョニングによる旧セーブ移行。
// シリアライズ・移行の中核は純粋関数にして、localStorage 依存を薄い層に閉じ込める。

export const SAVE_KEY = 'kashidashi-mikka/save';
export const SAVE_VERSION = 1;

/**
 * 周回を跨いで永続する分だけを保存する（設計書「4. 周回引き継ぎ」）。
 * WorldState 全体ではなく、erasedBooks / conscience / cycle に絞る。
 */
export interface SaveDataV1 {
  version: 1;
  cycle: number;
  erasedBooks: BookId[];
  conscience: number;
}

export type SaveData = SaveDataV1;

/** WorldState から保存対象の永続スライスを取り出す */
export function toSaveData(world: WorldState): SaveData {
  return {
    version: SAVE_VERSION,
    cycle: world.cycle,
    erasedBooks: [...world.erasedBooks],
    conscience: world.conscience,
  };
}

/**
 * 任意の入力を現行の SaveData へ移行する。壊れていれば null。
 * 新バージョン追加時はここに case を足し、旧版から段階的に引き上げる。
 */
export function migrate(raw: unknown): SaveData | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const data = raw as Record<string, unknown>;

  switch (data.version) {
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
