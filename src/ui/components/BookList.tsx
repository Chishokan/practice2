import type { BookId } from '../../domain/types';
import { getBook } from '../../content/books';

interface BookListProps {
  bookIds: BookId[];
  actionLabel: string;
  onSelect: (bookId: BookId) => void;
}

// 蔵書を一覧表示し、1冊を選ばせる。書架・整理の両方で使う。
export default function BookList({ bookIds, actionLabel, onSelect }: BookListProps) {
  if (bookIds.length === 0) {
    return <p className="text-neutral-500">該当する本がありません。</p>;
  }
  return (
    <ul className="flex flex-col gap-2">
      {bookIds.map((id) => {
        const book = getBook(id);
        if (!book) return null;
        return (
          <li
            key={id}
            className="flex items-center justify-between gap-4 border border-neutral-700 px-4 py-3"
          >
            <div>
              <p className="text-neutral-200">{book.title}</p>
              <p className="text-sm text-neutral-500">{book.summary}</p>
            </div>
            <button
              type="button"
              onClick={() => onSelect(id)}
              className="shrink-0 border border-neutral-500 px-3 py-1 text-sm"
            >
              {actionLabel}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
