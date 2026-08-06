import { useGameStore } from '../../store/gameStore';
import SceneView from './SceneView';

// 是正3（妖精の一言）の最小オーバーレイ。台詞と間のみ。システム通知や注釈は足さない。
// フォームは出さない（道中は基本形で不変・§12.2）。閉じると静かに消える。
export default function GuideRemark() {
  const guideRemark = useGameStore((s) => s.guideRemark);
  const dismiss = useGameStore((s) => s.dismissGuideRemark);
  if (!guideRemark) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/80 px-6">
      <div className="flex max-w-md flex-col gap-6">
        <SceneView scenes={guideRemark} />
        <button
          type="button"
          onClick={dismiss}
          className="self-center border border-neutral-600 px-4 py-2 text-sm text-neutral-400"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
