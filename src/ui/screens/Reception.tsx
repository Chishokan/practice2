import { useGameStore, VISITOR_ORDER } from '../../store/gameStore';
import { getVisitor } from '../../content/visitors';
import SceneView from '../components/SceneView';

// 受付。来訪者の要望、または手渡し後の反応を表示する。
export default function Reception() {
  const visitorIndex = useGameStore((s) => s.visitorIndex);
  const pendingScenes = useGameStore((s) => s.pendingScenes);
  const goTo = useGameStore((s) => s.goTo);
  const refuseCurrent = useGameStore((s) => s.refuseCurrent);
  const proceed = useGameStore((s) => s.proceed);

  const visitor = getVisitor(VISITOR_ORDER[visitorIndex] ?? '');
  if (!visitor) return null;

  const showingReaction = pendingScenes !== null;

  return (
    <section className="flex flex-col gap-6 w-full max-w-xl px-6">
      <h1 className="text-xl text-neutral-300">{visitor.displayName}</h1>

      <SceneView scenes={showingReaction ? pendingScenes : visitor.scenes} />

      <div className="flex gap-3">
        {showingReaction ? (
          <button type="button" onClick={proceed} className="border border-neutral-500 px-4 py-2">
            次へ
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => goTo('shelf')}
              className="border border-neutral-500 px-4 py-2"
            >
              本を選ぶ
            </button>
            <button
              type="button"
              onClick={refuseCurrent}
              className="border border-neutral-700 px-4 py-2 text-neutral-400"
            >
              お断りする
            </button>
          </>
        )}
      </div>
    </section>
  );
}
