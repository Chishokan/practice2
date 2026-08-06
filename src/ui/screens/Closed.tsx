import { useGameStore } from '../../store/gameStore';
import { determineEnding } from '../../domain/endings';
import { ENDING_CONFIG, ENDING_LABELS, ENDING_CLOSINGS } from '../../content/story';

// 周回の終端。到達したエンディングを表示し、周回・やり直しへ導く。
// エンディング判定は domain（determineEnding）に委ねる。各エンドの幕を一行添える。
export default function Closed() {
  const world = useGameStore((s) => s.world);
  const nextCycle = useGameStore((s) => s.nextCycle);
  const restart = useGameStore((s) => s.restart);

  const ending = determineEnding(world, ENDING_CONFIG);

  return (
    <section className="flex flex-col items-center gap-5 px-6 text-center">
      <p className="text-sm text-neutral-600">{world.cycle}周目 ・ 閉館</p>
      <h1 className="text-2xl text-neutral-200">{ENDING_LABELS[ending]}</h1>
      <p className="max-w-prose leading-relaxed text-neutral-400">{ENDING_CLOSINGS[ending]}</p>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={nextCycle}
          className="border border-neutral-500 px-4 py-2"
        >
          次の周回へ
        </button>
        <button
          type="button"
          onClick={restart}
          className="border border-neutral-700 px-4 py-2 text-neutral-400"
        >
          最初からやり直す
        </button>
      </div>
    </section>
  );
}
