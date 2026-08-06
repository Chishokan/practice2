import { describe, expect, it } from 'vitest';
import { rpgStep, RPG_INITIAL, RPG_MAX_HP } from './rpg';

describe('読み聞かせRPG⑧', () => {
  it('はなす＝いつでも勝ち（必勝・正史の友情決着）', () => {
    expect(rpgStep(RPG_INITIAL, 'talk').outcome).toBe('win');
    expect(rpgStep({ smithHp: 1 }, 'talk').outcome).toBe('win');
  });

  it('まもる＝安全・進展なし（HP不変）', () => {
    const r = rpgStep(RPG_INITIAL, 'guard');
    expect(r.outcome).toBe('continue');
    expect(r.state.smithHp).toBe(RPG_MAX_HP);
  });

  it('たたかう連打でも詰まない：HP0で敗北→状態は最初へ戻る', () => {
    let s = RPG_INITIAL;
    const outcomes: string[] = [];
    for (let i = 0; i < RPG_MAX_HP; i++) {
      const r = rpgStep(s, 'fight');
      outcomes.push(r.outcome);
      s = r.state;
    }
    expect(outcomes[outcomes.length - 1]).toBe('lose');
    expect(s).toEqual(RPG_INITIAL); // 敗北後は最初から
  });

  it('敗北後もはなすで必ず勝てる（詰みなし）', () => {
    // 3回たたかって敗北 → 初期化 → はなす → 勝ち
    let s = RPG_INITIAL;
    for (let i = 0; i < RPG_MAX_HP; i++) s = rpgStep(s, 'fight').state;
    expect(rpgStep(s, 'talk').outcome).toBe('win');
  });
});
