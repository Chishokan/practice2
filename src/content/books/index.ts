import type { Book, BookId } from '../../domain/types';
import { chapter1Books } from './chapter1';
import { chapter2Books } from './chapter2';

// 全書籍を集約し、id 引きできるようにする。
// 先頭9冊(chapter1)が初期書架、以降は入荷分（store 側で slice）。

export const allBooks: Book[] = [...chapter1Books, ...chapter2Books];

const bookById = new Map<BookId, Book>(allBooks.map((b) => [b.id, b]));

export function getBook(id: BookId): Book | undefined {
  return bookById.get(id);
}
