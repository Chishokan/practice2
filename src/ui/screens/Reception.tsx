import { useGameStore, VISITOR_ORDER } from '../../store/gameStore';
import { getVisitor } from '../../content/visitors';
import SceneView from '../components/SceneView';

// 受付。来訪者の要望、または手渡し後の反応を表示する。
export default function Reception() {
  const visitorIndex = useGameStore((s) => s.visitorIndex);
  const pendingScenes = useGameStore((s) => s.pendingScenes);
  const characterAnswered = useGameStore((s) => s.characterAnswered);
  const townText = useGameStore((s) => s.world.townText);
  const goTo = useGameStore((s) => s.goTo);
  const chooseCharacter = useGameStore((s) => s.chooseCharacter);
  const refuseCurrent = useGameStore((s) => s.refuseCurrent);
  const proceed = useGameStore((s) => s.proceed);

  const visitor = getVisitor(VISITOR_ORDER[visitorIndex] ?? '');
  if (!visitor) return null;

  const showingReaction = pendingScenes !== null;
  // 反応表示中でなく、性格スケッチが未回答なら、要望より先に一度だけ提示する。
  const character = visitor.characterScene;
  const showingCharacter = !showingReaction && character !== undefined && !characterAnswered;

  return (
    <section className="flex flex-col gap-6 w-full max-w-xl px-6">
      {/* 窓辺の街。綻びが進むと、この描写が静かに簡素化されていく */}
      <p className="text-sm text-neutral-500 border-l border-neutral-700 pl-3">
        {townText}
      </p>

      <div className="flex items-center justify-between">
        <h1 className="text-xl text-neutral-300">{visitor.displayName}</h1>
        <button
          type="button"
          onClick={() => goTo('ledger')}
          className="text-sm text-neutral-500 underline underline-offset-4"
        >
          台帳
        </button>
      </div>

      {showingCharacter && character ? (
        <>
          <SceneView scenes={character.prompt} />
          {/* 選択は縦並び。選んでも反応は返さず、そのまま要望へ合流する */}
          <div className="flex flex-col gap-2">
            {character.choices.map((choice) => (
              <button
                key={choice.id}
                type="button"
                onClick={() => chooseCharacter(choice.id)}
                className="border border-neutral-700 px-4 py-2 text-left text-neutral-200"
              >
                {choice.text}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
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
        </>
      )}
    </section>
  );
}
