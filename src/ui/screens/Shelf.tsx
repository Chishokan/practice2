import { useEffect, useMemo, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { visibleShelf } from '../../domain/shelf';
import { getBook } from '../../content/books';
import BookList from '../components/BookList';

// 書架。蔵書を検索し、現在の来訪者に手渡す本を選ぶ。
export default function Shelf() {
  const world = useGameStore((s) => s.world);
  const goTo = useGameStore((s) => s.goTo);
  const handOverToCurrent = useGameStore((s) => s.handOverToCurrent);
  const pendingShelfQuery = useGameStore((s) => s.pendingShelfQuery);
  const consumePendingShelfQuery = useGameStore((s) => s.consumePendingShelfQuery);
  const [query, setQuery] = useState(pendingShelfQuery ?? '');

  // 目録の「金色の絵本」導線から来た場合、その語を初期検索語として一度だけ適用する
  // （現存蔵書に無く必ず空振り＝是正3の空振りの舞台）。適用したら消費する。
  useEffect(() => {
    if (pendingShelfQuery !== null) {
      setQuery(pendingShelfQuery);
      consumePendingShelfQuery();
    }
  }, [pendingShelfQuery, consumePendingShelfQuery]);

  const filtered = useMemo(() => {
    // 綻び：searchBlock で隠れた本は visibleShelf が静かに外す。システムメッセージは出さない。
    //
    // 【意図的な非対称・バグではない】ここ（検索・一覧）から消える本も、
    // 整理画面（Archive）には引き続き現れて降ろせる。「探すと無いのに整理には有る」
    // という不気味さを狙った演出。visibleShelf を使わず shelf 全体に戻さないこと。
    const visible = visibleShelf(world);
    const q = query.trim();
    if (!q) return visible;
    return visible.filter((id) => {
      const book = getBook(id);
      if (!book) return false;
      return book.title.includes(q) || book.summary.includes(q);
    });
  }, [world, query]);

  return (
    <section className="flex flex-col gap-4 w-full max-w-xl px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl text-neutral-300">書架</h1>
        <button
          type="button"
          onClick={() => goTo('reception')}
          className="border border-neutral-700 px-3 py-1 text-sm text-neutral-400"
        >
          受付へ戻る
        </button>
      </div>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="題名・内容で探す"
        className="border border-neutral-700 bg-transparent px-3 py-2 text-neutral-100 placeholder:text-neutral-600"
      />

      <BookList bookIds={filtered} actionLabel="手渡す" onSelect={handOverToCurrent} />
    </section>
  );
}
