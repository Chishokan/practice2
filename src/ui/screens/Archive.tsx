import { useGameStore } from '../../store/gameStore';
import BookList from '../components/BookList';

// 整理。書架が手狭になったので地下書庫へ本を降ろす。
// 淡々とした作業として提示する。警告やシステムメッセージは一切出さない（仕様）。
//
// 【意図的な非対称・バグではない】ここは searchBlocked を無視して world.shelf 全体を出す。
// Shelf（検索・一覧）で消える searchBlock 対象も、整理には現れて降ろせる。
// 「探すと無いのに整理には有る」を狙った演出。visibleShelf でフィルタしないこと。
export default function Archive() {
  const shelf = useGameStore((s) => s.world.shelf);
  const lowerFromShelf = useGameStore((s) => s.lowerFromShelf);

  return (
    <section className="flex flex-col gap-4 w-full max-w-xl px-6">
      <h1 className="text-xl text-neutral-300">書架の整理</h1>
      <p className="text-neutral-400">
        棚が少し手狭になりました。地下書庫へ降ろす本を選んでください。
      </p>
      <BookList bookIds={shelf} actionLabel="降ろす" onSelect={lowerFromShelf} />
    </section>
  );
}
