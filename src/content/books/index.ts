import type { Book, BookId } from '../../domain/types';
import { chapter1Books } from './chapter1';

// 全書籍を集約し、id 引きできるようにする。

export const allBooks: Book[] = [...chapter1Books];

const bookById = new Map<BookId, Book>(allBooks.map((b) => [b.id, b]));

export function getBook(id: BookId): Book | undefined {
  return bookById.get(id);
}
