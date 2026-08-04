import { useGameStore } from '../../store/gameStore';
import { guideIntroScenes } from '../../content/guide';
import SceneView from '../components/SceneView';

// 着任時の案内役（妖精）登場＋大義提示。ゲーム開始時に一度だけ表示する。
// 画像は Phase 6。ここでは基本形の妖精をテキストで登場させるのみ。
export default function Intro() {
  const goTo = useGameStore((s) => s.goTo);

  return (
    <section className="flex flex-col gap-6 w-full max-w-xl px-6">
      <SceneView scenes={guideIntroScenes} />
      <div>
        <button
          type="button"
          onClick={() => goTo('reception')}
          className="border border-neutral-500 px-4 py-2"
        >
          はじめる
        </button>
      </div>
    </section>
  );
}
