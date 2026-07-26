import { describe, expect, it } from 'vitest';
import type { SaveDataV2 } from './persistence';
import { deserialize, migrate, serialize } from './persistence';

function v2(overrides: Partial<SaveDataV2['world']> = {}): SaveDataV2 {
  return {
    version: 2,
    world: {
      cycle: 2,
      chapter: 1,
      shelf: ['a', 'b'],
      shelfCapacity: 9,
      erasedBooks: ['x'],
      flags: ['truth-reached'],
      anomalyLevel: 1,
      ledger: [],
      reputation: 0,
      conscience: 3,
      townText: '街',
      searchBlocked: [],
      ...overrides,
    },
    visitorIndex: 1,
    donationQueue: ['c'],
    donationIndex: 0,
    handedOver: false,
    characterAnswered: true,
    pendingScenes: null,
    screen: 'reception',
  };
}

describe('persistence v2 — セッション・スナップショット', () => {
  it('round-trip で実行状態が保たれる', () => {
    const data = v2();
    expect(deserialize(serialize(data))).toEqual(data);
  });

  it('conscience が round-trip で失われない（修正1の要点）', () => {
    const data = v2({ conscience: 5 });
    const restored = deserialize(serialize(data)) as SaveDataV2;
    expect(restored.world.conscience).toBe(5);
  });

  it('flags は配列として保存され復元できる', () => {
    const restored = deserialize(serialize(v2())) as SaveDataV2;
    expect(restored.world.flags).toEqual(['truth-reached']);
  });
});

describe('persistence — バージョニング/堅牢性', () => {
  it('現行 v2 は読める', () => {
    expect(migrate(v2())).toEqual(v2());
  });

  it('旧 v1 も読める（周回開始点として復元するのは store 側）', () => {
    const v1 = { version: 1, cycle: 1, erasedBooks: [], conscience: 0 };
    expect(migrate(v1)).toEqual(v1);
  });

  it('未知バージョンは読まない', () => {
    expect(migrate({ version: 99 })).toBeNull();
  });

  it('壊れた形は null（例外を投げない）', () => {
    expect(migrate({ version: 2, visitorIndex: 'x' })).toBeNull();
    expect(migrate({ version: 1, cycle: 'x' })).toBeNull();
    expect(migrate(null)).toBeNull();
    expect(deserialize('{ not json')).toBeNull();
  });
});
