import { useMemo, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { getBook } from '../../content/books';
import BookList from '../components/BookList';

// 書架。蔵書を検索し、現在の来訪者に手渡す本を選ぶ。
export default function Shelf() {
  const shelf = useGameStore((s) => s.world.shelf);
  const goTo = useGameStore((s) => s.goTo);
  const handOverToCurrent = useGameStore((s) => s.handOverToCurrent);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return shelf;
    return shelf.filter((id) => {
      const book = getBook(id);
      if (!book) return false;
      return book.title.includes(q) || book.summary.includes(q);
    });
  }, [shelf, query]);

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
