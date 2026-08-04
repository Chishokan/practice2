import type { Book } from '../../domain/types';

// 第2章で追加する蔵書。第1章は既存12冊で足りたが、第2章の書記（行政記録の照合）は
// 個人的・文化的な既存12冊のどれにも合わないため、公的記録の一冊を新設する。
export const chapter2Books: Book[] = [
  {
    id: 'b13-townhall-register',
    title: '町役場の記録簿',
    category: 'record',
    // 出入りを几帳面に記す公の帳面。だが「記録は正しい」という前提が、後で軋む。
    summary: '生まれた者、移り住んだ者、収めた蔵書——町のあらゆる出入りを記した公の帳面。余白のない几帳面な筆跡。',
  },
];
