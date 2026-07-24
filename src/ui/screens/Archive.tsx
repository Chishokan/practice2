import { useGameStore } from '../../store/gameStore';
import BookList from '../components/BookList';

// 整理。書架が手狭になったので地下書庫へ本を降ろす。
// 淡々とした作業として提示する。警告やシステムメッセージは一切出さない（仕様）。
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
