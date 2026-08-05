import { useGameStore } from '../../store/gameStore';
import { CHAPTER_INTERLUDES } from '../../content/story';

// 章の幕間。静かに「第◯章」と地の文1行だけ。大げさな演出はしない。
export default function Interlude() {
  const chapter = useGameStore((s) => s.world.chapter);
  const proceedInterlude = useGameStore((s) => s.proceedInterlude);
  const interlude = CHAPTER_INTERLUDES[chapter];
  if (!interlude) return null;

  return (
    <section className="flex flex-col items-center gap-6 px-6 text-center">
      <h1 className="text-2xl tracking-widest text-neutral-300">{interlude.title}</h1>
      <p className="max-w-prose leading-relaxed text-neutral-400">{interlude.line}</p>
      <button
        type="button"
        onClick={proceedInterlude}
        className="border border-neutral-500 px-4 py-2"
      >
        進む
      </button>
    </section>
  );
}
