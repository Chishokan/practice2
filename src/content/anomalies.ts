import type { AnomalyRule } from '../domain/anomaly';
import type { BookId, WorldState } from '../domain/types';
import { allBooks, getBook } from './books';

// 綻びの具体的な演出を宣言的に定義する。エンジン（domain/anomaly.ts）から評価される。
// テキストの改変対象や文言はここに集約し、個別シーンにハードコードしない。

// 窓外の街の描写。上から順に、綻びが進むほど簡素になる（段階的短縮）。
// TOWN_STAGES[0] は正常時。第2章以降で下の段へ落ちていく。
export const TOWN_STAGES: string[] = [
  '窓の外では、石畳の広場を荷車が横切り、パン屋の煙と潮の匂いが風に混じっている。子どもたちの声も遠くに聞こえる。',
  '窓の外では、石畳の広場を荷車が横切っている。パン屋の煙が風に混じる。',
  '窓の外に、石畳の広場が見える。荷車がひとつ。',
  '窓の外に、広場がある。',
];

/**
 * 記憶違いと錯覚できる範囲で、別の実在する本にすり替える。
 * 同じ分類の本を優先することで「地図だっけ、保存食だっけ」と迷わせる。
 * 参照先は必ず実在する本に限る（存在しない参照を生まない）。
 */
function plausibleSwap(bookId: BookId): BookId {
  const current = getBook(bookId);
  const sameCategory = allBooks.find(
    (b) => b.id !== bookId && b.category === current?.category,
  );
  const fallback = allBooks.find((b) => b.id !== bookId);
  return (sameCategory ?? fallback ?? allBooks[0]).id;
}

// Lv1: 貸出台帳の最初の一行が、プレイヤーの記憶と食い違う。
const ledgerRewrite: AnomalyRule = {
  id: 'ledger-rewrite',
  threshold: 1,
  once: true,
  apply: (state): WorldState => {
    if (state.ledger.length === 0) return state;
    const [first, ...rest] = state.ledger;
    const rewritten = { ...first, bookId: plausibleSwap(first.bookId) };
    return { ...state, ledger: [rewritten, ...rest] };
  },
};

// Lv2: 窓外の街の描写が、少しずつ簡素になる。
const townSimplify: AnomalyRule = {
  id: 'town-simplify',
  threshold: 2,
  once: false,
  apply: (state): WorldState => {
    // anomalyLevel 2→段1, 3→段2, 4→段3。正常時（段0）へは戻さない。
    const stage = Math.min(state.anomalyLevel - 1, TOWN_STAGES.length - 1);
    return { ...state, townText: TOWN_STAGES[stage] };
  },
};

// Lv4: 書架にあるのに検索に出ない本が生まれる。
// 「確かに見たのに」と思わせる、消失の最終段階。対象は実在かつ書架にある本に限る。
const SEARCH_BLOCK_TARGET: BookId = 'b07-library-plan';
const searchBlock: AnomalyRule = {
  id: 'search-block',
  threshold: 4,
  once: false,
  apply: (state): WorldState => {
    if (
      !state.shelf.includes(SEARCH_BLOCK_TARGET) ||
      state.searchBlocked.includes(SEARCH_BLOCK_TARGET)
    ) {
      return state;
    }
    return { ...state, searchBlocked: [...state.searchBlocked, SEARCH_BLOCK_TARGET] };
  },
};

// 評価順は威力の弱い順。台帳→街→検索。
export const anomalyRules: AnomalyRule[] = [ledgerRewrite, townSimplify, searchBlock];
