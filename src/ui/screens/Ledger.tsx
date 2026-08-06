import { useGameStore } from '../../store/gameStore';
import { getBook } from '../../content/books';
import { getVisitor } from '../../content/visitors';
import CatalogPage from '../components/CatalogPage';

// 貸出台帳。過去の貸出を淡々と並べるだけ。
// 綻びで一行が書き換わっても、ここは何の注記もせず静かに表示する（仕様）。
// 収蔵目録は独立UIを新設せず、シグネチャ要素の台帳へ一節として寄せる（規約）。
export default function Ledger() {
  const ledger = useGameStore((s) => s.world.ledger);
  const closeLedger = useGameStore((s) => s.closeLedger);

  return (
    <section className="flex flex-col gap-4 w-full max-w-xl px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl text-neutral-300">貸出台帳</h1>
        <button
          type="button"
          onClick={closeLedger}
          className="border border-neutral-700 px-3 py-1 text-sm text-neutral-400"
        >
          閉じる
        </button>
      </div>

      <CatalogPage />

      <div className="pt-2">
        <h2 className="text-lg text-neutral-300 pb-1">貸出の記録</h2>
      </div>

      {ledger.length === 0 ? (
        <p className="text-neutral-500">まだ記録はありません。</p>
      ) : (
        <ul className="flex flex-col divide-y divide-neutral-800">
          {ledger.map((entry) => (
            <li key={entry.id} className="flex justify-between gap-4 py-2">
              <span className="text-neutral-400">
                {getVisitor(entry.visitorId)?.displayName ?? entry.visitorId}
              </span>
              <span className="text-neutral-200">
                {getBook(entry.bookId)?.title ?? entry.bookId}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
