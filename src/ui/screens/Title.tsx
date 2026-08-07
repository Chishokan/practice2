import { useGameStore } from '../../store/gameStore';
import Asset from '../components/Asset';

// タイトル画面。起動時に必ず表示。セーブがあれば「つづきから」、無ければ「はじめる」。
// キーアートは未配置ならタイトル表記のみで成立（fallback）。
export default function Title() {
  const resumeScreen = useGameStore((s) => s.resumeScreen);
  const continueGame = useGameStore((s) => s.continueGame);
  const restart = useGameStore((s) => s.restart);
  const fresh = resumeScreen === 'intro';

  return (
    <section className="flex w-full max-w-xl flex-col items-center gap-8 px-6 text-center">
      <Asset src="/assets/cg/title.webp" alt="" className="max-h-[40vh] w-full object-contain" />
      <h1 className="text-3xl tracking-widest text-neutral-200">貸出は三日まで</h1>
      <div className="flex flex-col gap-3">
        {fresh ? (
          <button type="button" onClick={continueGame} className="border border-neutral-500 px-6 py-2 text-neutral-100">
            はじめる
          </button>
        ) : (
          <>
            <button type="button" onClick={continueGame} className="border border-neutral-500 px-6 py-2 text-neutral-100">
              つづきから
            </button>
            <button type="button" onClick={restart} className="border border-neutral-700 px-6 py-2 text-sm text-neutral-400">
              最初から
            </button>
          </>
        )}
      </div>
    </section>
  );
}
