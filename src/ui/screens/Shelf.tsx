import { useGameStore } from '../../store/gameStore';

// Phase 0: 画面名の表示と遷移ボタンのみ。中身は後フェーズで実装する。
export default function Shelf() {
  const goTo = useGameStore((s) => s.goTo);

  return (
    <section className="flex flex-col items-center gap-6">
      <h1 className="text-2xl">書架</h1>
      <button
        type="button"
        onClick={() => goTo('reception')}
        className="border border-gray-500 px-4 py-2"
      >
        受付へ戻る
      </button>
    </section>
  );
}
