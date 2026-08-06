import { useGameStore } from '../../store/gameStore';
import BookList from '../components/BookList';
import { FLAG_GUIDE_FINAL_REMARK } from '../../content/story';
import { BASEMENT_ENTRANCE_LINE } from '../../content/basement';

// 整理。書架が手狭になったので地下書庫へ本を降ろす。
// 淡々とした作業として提示する。警告やシステムメッセージは一切出さない（仕様）。
//
// 【意図的な非対称・バグではない】ここは searchBlocked を無視して world.shelf 全体を出す。
// Shelf（検索・一覧）で消える searchBlock 対象も、整理には現れて降ろせる。
// 「探すと無いのに整理には有る」を狙った演出。visibleShelf でフィルタしないこと。
export default function Archive() {
  const shelf = useGameStore((s) => s.world.shelf);
  const lowerFromShelf = useGameStore((s) => s.lowerFromShelf);
  const descendToBasement = useGameStore((s) => s.descendToBasement);
  // 是正3 発火後にのみ、地下への入口が開く（システム通知なし・冷たい風の一行だけ）。
  const entranceOpen = useGameStore((s) => s.world.flags.has(FLAG_GUIDE_FINAL_REMARK));

  return (
    <section className="flex flex-col gap-4 w-full max-w-xl px-6">
      <h1 className="text-xl text-neutral-300">書架の整理</h1>
      <p className="text-neutral-400">
        棚が少し手狭になりました。地下書庫へ降ろす本を選んでください。
      </p>
      <BookList bookIds={shelf} actionLabel="降ろす" onSelect={lowerFromShelf} />

      {entranceOpen && (
        <div className="mt-6 flex flex-col items-start gap-2 border-t border-neutral-800 pt-4">
          <p className="text-sm text-neutral-500">{BASEMENT_ENTRANCE_LINE}</p>
          <button
            type="button"
            onClick={descendToBasement}
            className="border border-neutral-700 px-4 py-2 text-neutral-400"
          >
            降りてみる
          </button>
        </div>
      )}
    </section>
  );
}
