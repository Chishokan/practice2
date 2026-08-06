import { useGameStore } from '../../store/gameStore';
import { computeCatalog } from '../../domain/catalog';
import { catalogEntries } from '../../content/catalog';
import { getBook } from '../../content/books';
import { FLAG_CATALOG_FINAL_REVEALED, CATALOG_FINAL_REVEAL_LABEL } from '../../content/story';

// 収蔵目録ページ（台帳に統合。通知UIは増やさない）。
// 文面は「完成」の語彙で統一し、無機質で善良に。脅かさない・匂わせない（絶対規則）。
// 降ろす（＝収蔵する）ことで項目が埋まる。「下ろす＝消える」の因果は一切表示しない。
//
// 予約枠（cat-final）の正体開示：v17 完了後に目録を開くと、開示フラグが静かに立ち、
// 「──」が「金色の絵本（題不詳）」に変わる（演出・通知なし＝開いたら変わっている）。
// 開示後の行は「探す」導線になり、書架での空振り→是正3（妖精の一言）に繋がる。
export default function CatalogPage() {
  const world = useGameStore((s) => s.world);
  const seekCatalogFinal = useGameStore((s) => s.seekCatalogFinal);
  const revealed = world.flags.has(FLAG_CATALOG_FINAL_REVEALED);
  const catalog = computeCatalog(world, catalogEntries, revealed);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg text-neutral-300">収蔵目録</h2>
      <p className="text-sm text-neutral-400">
        目録は、あと{catalog.remaining}冊で完成します。
      </p>
      <ul className="flex flex-col gap-1 pt-1">
        {catalog.items.map((item) => {
          // 予約枠：未開示は「──」を淡く。開示後は絵本として記述するが名指せない。
          const title = item.reserved
            ? item.revealed
              ? CATALOG_FINAL_REVEAL_LABEL
              : '──'
            : getBook(item.bookId ?? '')?.title ?? item.bookId;
          const rowClass = `flex items-center justify-between gap-4 border-b border-neutral-800 py-1 ${
            item.filled ? 'text-neutral-200' : 'text-neutral-600'
          }`;

          // 開示後の予約枠は「探す」導線（書架で空振り→是正3）。UIは最小＝行自体をボタンに。
          if (item.reserved && item.revealed) {
            return (
              <li key={item.id} className={rowClass}>
                <button
                  type="button"
                  onClick={seekCatalogFinal}
                  className="text-left text-neutral-400 underline underline-offset-4"
                >
                  {title}
                </button>
              </li>
            );
          }

          return (
            <li key={item.id} className={rowClass}>
              <span>{title}</span>
              {item.filled && <span className="text-xs text-neutral-500">収蔵済</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
