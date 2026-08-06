import { describe, expect, it } from 'vitest';
import { normalizeName, matchesGuideName } from './naming';

describe('matchesGuideName（妖精の名の照合）', () => {
  it('ひらがな「しおり」を受理する', () => {
    expect(matchesGuideName('しおり')).toBe(true);
  });
  it('カタカナ「シオリ」を受理する（ひらがなへ正規化）', () => {
    expect(matchesGuideName('シオリ')).toBe(true);
  });
  it('漢字「栞」を受理する', () => {
    expect(matchesGuideName('栞')).toBe(true);
  });
  it('前後の空白（半角・全角）を吸収する', () => {
    expect(matchesGuideName('  しおり ')).toBe(true);
    expect(matchesGuideName('　栞　')).toBe(true);
  });
  it('別の名は受理しない', () => {
    expect(matchesGuideName('ほたる')).toBe(false);
    expect(matchesGuideName('')).toBe(false);
    expect(matchesGuideName('しお')).toBe(false);
  });
});

describe('normalizeName', () => {
  it('カタカナをひらがなへ、空白を除去する', () => {
    expect(normalizeName(' シ オ リ ')).toBe('しおり');
  });
});
