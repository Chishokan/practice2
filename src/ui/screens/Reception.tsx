import { useGameStore } from '../../store/gameStore';

// Phase 0: 画面名の表示と遷移ボタンのみ。中身は後フェーズで実装する。
export default function Reception() {
  const goTo = useGameStore((s) => s.goTo);

  return (
    <section className="flex flex-col items-center gap-6">
      <h1 className="text-2xl">受付</h1>
      <button
        type="button"
        onClick={() => goTo('shelf')}
        className="border border-gray-500 px-4 py-2"
      >
        書架へ
      </button>
    </section>
  );
}
