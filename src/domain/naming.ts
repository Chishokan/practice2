// 妖精の名の照合（§13 の最終レファレンス）。純粋関数・React 非依存。
// 正解は手記由来の「しおり」。表記ゆれ（しおり／シオリ／栞、前後空白・全半角）を吸収する。
// 正解は UI 文言・目録に一切出さない（このモジュールにのみ持つ）。

/** 前後空白（全半角）を除去し、カタカナをひらがなに寄せる正規化。 */
export function normalizeName(raw: string): string {
  const trimmed = raw.replace(/[\s　]/g, '');
  let out = '';
  for (const ch of trimmed) {
    const c = ch.codePointAt(0);
    if (c !== undefined && c >= 0x30a1 && c <= 0x30f6) {
      // カタカナ → ひらがな
      out += String.fromCodePoint(c - 0x60);
    } else {
      out += ch;
    }
  }
  return out;
}

/** 入力が妖精の名に一致するか。しおり／シオリ／栞（＋表記ゆれ）を受理する。 */
export function matchesGuideName(raw: string): boolean {
  const n = normalizeName(raw);
  return n === 'しおり' || n === '栞';
}
