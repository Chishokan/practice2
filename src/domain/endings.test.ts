import { describe, expect, it } from 'vitest';
import type { EndingConfig } from './endings';
import { determineEnding } from './endings';
import { createInitialWorldState } from './worldState';
import type { LedgerEntry, WorldState } from './types';

const cfg: EndingConfig = {
  anchorId: 'anchor',
  conscienceThreshold: 3,
  goodLibrarianHandovers: 3,
  flags: {
    truthReached: 'truth-reached',
    choseClose: 'chose-close',
    choseBequeath: 'chose-bequeath',
  },
};

function base(): WorldState {
  return createInitialWorldState({ shelf: ['anchor', 'a', 'b'], shelfCapacity: 3 });
}

function withLedger(n: number): LedgerEntry[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `L${i + 1}`,
    cycle: 1,
    visitorId: `v${i}`,
    bookId: 'a',
  }));
}

describe('determineEnding — 全エンド到達可能', () => {
  it('E2 空の書架：ほとんど渡さなかった', () => {
    expect(determineEnding(base(), cfg)).toBe('E2');
  });

  it('E1 良き司書：多くを手渡した（最悪の結末）', () => {
    const w = { ...base(), ledger: withLedger(3) };
    expect(determineEnding(w, cfg)).toBe('E1');
  });

  it('E4 継承：台帳を遺す', () => {
    const w = { ...base(), ledger: withLedger(3), flags: new Set(['chose-bequeath']) };
    expect(determineEnding(w, cfg)).toBe('E4');
  });

  it('E3 閉架：真相に至り閉じる', () => {
    const w = { ...base(), flags: new Set(['truth-reached', 'chose-close']) };
    expect(determineEnding(w, cfg)).toBe('E3');
  });

  it('TRUE：真相＋アンカー保全＋評価値', () => {
    const w = { ...base(), conscience: 3, flags: new Set(['truth-reached']) };
    expect(determineEnding(w, cfg)).toBe('TRUE');
  });
});

describe('2段ゲート', () => {
  it('アンカーを消すと TRUE は不成立（ゲートA）', () => {
    const w = {
      ...base(),
      conscience: 5,
      erasedBooks: ['anchor'],
      flags: new Set(['truth-reached', 'chose-close']),
    };
    // 真相には至っているが救済不能 → 閉架に落ちる
    expect(determineEnding(w, cfg)).toBe('E3');
  });

  it('評価値が基準未満だと TRUE は不成立（ゲートB）', () => {
    const w = { ...base(), conscience: 2, flags: new Set(['truth-reached']) };
    expect(determineEnding(w, cfg)).not.toBe('TRUE');
  });
});
