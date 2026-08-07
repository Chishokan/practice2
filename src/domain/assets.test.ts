import { describe, expect, it } from 'vitest';
import { portraitId, guideForm, backgroundKey } from './assets';

describe('portraitId（再訪は元の立ち絵へ）', () => {
  it('新規来訪者はそのまま', () => {
    expect(portraitId('v02-sailor')).toBe('v02-sailor');
    expect(portraitId('v09-clerk')).toBe('v09-clerk');
  });
  it('再訪は元の人物IDに寄せる', () => {
    expect(portraitId('v13-teacher-return')).toBe('v05-teacher');
    expect(portraitId('v17-child-return')).toBe('v03-child');
    expect(portraitId('v07-baker-return')).toBe('v01-baker');
  });
});

describe('guideForm（救済で一度だけ redeemed）', () => {
  it('フラグ無し＝基本形', () => {
    expect(guideForm(new Set(), 'guide-redeemed')).toBe('base');
  });
  it('フラグ有り＝救済の姿', () => {
    expect(guideForm(new Set(['guide-redeemed']), 'guide-redeemed')).toBe('redeemed');
  });
});

describe('backgroundKey', () => {
  it('受付は通常/最終閉館日で差分', () => {
    expect(backgroundKey('reception')).toBe('reception');
    expect(backgroundKey('reception', { finalDay: true })).toBe('reception-dusk');
  });
  it('書架・整理・地下・救済（晴天）', () => {
    expect(backgroundKey('shelf')).toBe('shelf');
    expect(backgroundKey('archive')).toBe('archive');
    expect(backgroundKey('basement')).toBe('basement');
    expect(backgroundKey('rescue')).toBe('reception-clear');
  });
  it('背景を持たない画面は null（現行UIのまま）', () => {
    expect(backgroundKey('title')).toBeNull();
    expect(backgroundKey('intro')).toBeNull();
    expect(backgroundKey('confront')).toBeNull();
    expect(backgroundKey('closed')).toBeNull();
  });
});
