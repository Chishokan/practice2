import { useGameStore } from '../../store/gameStore';
import { computeCatalog } from '../../domain/catalog';
import { catalogEntries } from '../../content/catalog';
import { getBook } from '../../content/books';

// 収蔵目録ページ（台帳に統合。通知UIは増やさない）。
// 文面は「完成」の語彙で統一し、無機質で善良に。脅かさない・匂わせない（絶対規則）。
// 降ろす（＝収蔵する）ことで項目が埋まる。「下ろす＝消える」の因果は一切表示しない。
export default function CatalogPage() {
  const world = useGameStore((s) => s.world);
  const catalog = computeCatalog(world, catalogEntries);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg text-neutral-300">収蔵目録</h2>
      <p className="text-sm text-neutral-400">
        目録は、あと{catalog.remaining}冊で完成します。
      </p>
      <ul className="flex flex-col gap-1 pt-1">
        {catalog.items.map((item) => {
          // 予約枠（bookId=null）は未記載として「──」を淡く置く。
          const title = item.bookId ? getBook(item.bookId)?.title ?? item.bookId : '──';
          return (
            <li
              key={item.id}
              className={`flex items-center justify-between gap-4 border-b border-neutral-800 py-1 ${
                item.filled ? 'text-neutral-200' : 'text-neutral-600'
              }`}
            >
              <span>{title}</span>
              {item.filled && <span className="text-xs text-neutral-500">収蔵済</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
