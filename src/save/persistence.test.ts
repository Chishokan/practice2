import { describe, expect, it } from 'vitest';
import { createInitialWorldState } from '../domain/worldState';
import { deserialize, migrate, serialize, toSaveData } from './persistence';

describe('persistence — シリアライズ', () => {
  it('保存対象は永続スライスに絞られる', () => {
    const w = {
      ...createInitialWorldState({ shelf: ['a'], shelfCapacity: 1 }),
      cycle: 2,
      erasedBooks: ['x', 'y'],
      conscience: 3,
    };
    const data = toSaveData(w);
    expect(data).toEqual({ version: 1, cycle: 2, erasedBooks: ['x', 'y'], conscience: 3 });
  });

  it('round-trip で保たれる', () => {
    const data = toSaveData(
      createInitialWorldState({ shelf: [], shelfCapacity: 0 }),
    );
    expect(deserialize(serialize(data))).toEqual(data);
  });
});

describe('persistence — バージョニング/堅牢性', () => {
  it('現行バージョンは読める', () => {
    const v1 = { version: 1, cycle: 1, erasedBooks: [], conscience: 0 };
    expect(migrate(v1)).toEqual(v1);
  });

  it('未知バージョンは読まない（前方互換は求めない）', () => {
    expect(migrate({ version: 99, cycle: 1, erasedBooks: [], conscience: 0 })).toBeNull();
  });

  it('壊れた形は null（例外を投げない）', () => {
    expect(migrate({ version: 1, cycle: 'x' })).toBeNull();
    expect(migrate(null)).toBeNull();
    expect(deserialize('{ not json')).toBeNull();
  });
});
