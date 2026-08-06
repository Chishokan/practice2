import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import SceneView from '../components/SceneView';
import { guideRescueScenes } from '../../content/guide';
import { EPILOGUE_SCENES, GUIDE_FORM_REDEEMED } from '../../content/finale';

// 救済（TRUE）→ エピローグ。妖精フォームは redeemed（救済の姿）＝一度切りの切替（§12.2）。
// システム通知は出さない。救済＝「明日が再開すること」として描く。
export default function Rescue() {
  const goTo = useGameStore((s) => s.goTo);
  const [step, setStep] = useState(0);

  if (step === 0) {
    return (
      <section className="flex w-full max-w-xl flex-col gap-6 px-6">
        {/* フォーム切替（ビジュアルは Phase D。ここでは状態の可視化のみ） */}
        <p className="text-xs text-neutral-400">{GUIDE_FORM_REDEEMED}</p>
        <SceneView scenes={guideRescueScenes} />
        <button type="button" onClick={() => setStep(1)} className="self-start border border-neutral-600 px-4 py-2 text-neutral-300">
          ……
        </button>
      </section>
    );
  }

  return (
    <section className="flex w-full max-w-xl flex-col gap-6 px-6">
      <SceneView scenes={EPILOGUE_SCENES} />
      <button type="button" onClick={() => goTo('closed')} className="self-start border border-neutral-600 px-4 py-2 text-neutral-300">
        （了）
      </button>
    </section>
  );
}
