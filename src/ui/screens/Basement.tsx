import { useEffect, useMemo, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { isLockSolved } from '../../domain/basement';
import { catalogEntries } from '../../content/catalog';
import { getBook } from '../../content/books';
import {
  FLAG_BASEMENT_UNLOCKED,
  FLAG_GOLDEN_BOOK_FOUND,
} from '../../content/story';
import {
  LOCK_PROMPT,
  LOCK_HINTS,
  BASEMENT_INTRO,
  BASEMENT_SHELF_FILLED_LINE,
  BASEMENT_SHELF_EMPTY_LINE,
  GOLDEN_BOOK_SCENES,
  PREDECESSOR_JOURNAL,
  BASEMENT_OUTRO,
} from '../../content/basement';
import SceneView from '../components/SceneView';
import Asset from '../components/Asset';

// 地下書庫（beat 18a）。錠（⑦）→保存庫→金色の絵本→先代の手記→気配→地上復帰。
// 妖精はこの画面に登場しない・台詞ゼロ（道中台詞は是正3のみの規約）。18b には着手しない。
export default function Basement() {
  const world = useGameStore((s) => s.world);
  const markFlag = useGameStore((s) => s.markFlag);
  const openLedger = useGameStore((s) => s.openLedger);
  const returnFromBasement = useGameStore((s) => s.returnFromBasement);
  const unlocked = world.flags.has(FLAG_BASEMENT_UNLOCKED);

  if (!unlocked) {
    return <Lock onSolved={() => markFlag(FLAG_BASEMENT_UNLOCKED)} onSeeLedger={() => openLedger('basement')} />;
  }
  return <Explore erasedBooks={world.erasedBooks} onFindBook={() => markFlag(FLAG_GOLDEN_BOOK_FOUND)} onExit={returnFromBasement} />;
}

// ⑦地下の錠：正解＝収蔵目録の並び順。紋章（創立コレクションの実本）を目録順に選ぶ。
// 詰みなし＝誤りは静かに戻り、段階ヒントが進む。成績・試行回数は conscience に影響しない。
function Lock({ onSolved, onSeeLedger }: { onSolved: () => void; onSeeLedger: () => void }) {
  const correctOrder = useMemo(
    () =>
      catalogEntries
        .filter((e) => e.requiredBookId !== null)
        .map((e) => e.requiredBookId as string),
    [],
  );
  // 初期の紋章並びは正解と異なる固定順（逆順）。乱数は使わない。
  const pool = useMemo(() => [...correctOrder].reverse(), [correctOrder]);
  const [selected, setSelected] = useState<string[]>([]);
  const [wrong, setWrong] = useState(0);
  const remaining = pool.filter((id) => !selected.includes(id));

  const tap = (id: string) => {
    const next = [...selected, id];
    if (next.length < correctOrder.length) {
      setSelected(next);
      return;
    }
    // 全紋を置いた＝判定。正解なら開錠、誤りは静かに戻してヒントを一段進める。
    if (isLockSolved(next, correctOrder)) {
      onSolved();
    } else {
      setWrong((w) => w + 1);
      setSelected([]);
    }
  };

  const hint = wrong > 0 ? LOCK_HINTS[Math.min(wrong - 1, LOCK_HINTS.length - 1)] : null;

  return (
    <section className="flex w-full max-w-xl flex-col gap-4 px-6">
      <h1 className="text-xl text-neutral-300">地下書庫の扉</h1>
      <p className="text-neutral-400">{LOCK_PROMPT}</p>

      {/* 選んだ並び */}
      <div className="flex min-h-[2.5rem] flex-wrap gap-2 border border-neutral-800 p-2">
        {selected.length === 0 ? (
          <span className="text-sm text-neutral-600">紋を、順に選ぶ。</span>
        ) : (
          selected.map((id, i) => (
            <span key={id} className="text-sm text-neutral-300">
              {i + 1}. {getBook(id)?.title ?? id}
            </span>
          ))
        )}
      </div>

      {/* 未選択の紋章 */}
      <div className="flex flex-wrap gap-2">
        {remaining.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => tap(id)}
            className="border border-neutral-700 px-3 py-2 text-sm text-neutral-200"
          >
            {getBook(id)?.title ?? id}
          </button>
        ))}
      </div>

      {hint && <p className="text-sm text-neutral-500">{hint}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => setSelected([])}
          className="border border-neutral-800 px-3 py-1 text-sm text-neutral-500"
        >
          やり直す
        </button>
        <button
          type="button"
          onClick={onSeeLedger}
          className="border border-neutral-800 px-3 py-1 text-sm text-neutral-500"
        >
          台帳を確かめる
        </button>
      </div>
    </section>
  );
}

// 保存庫→金色の絵本→手記→気配→地上。地の文は最小・冷たく。説明語を書かない。
function Explore({
  erasedBooks,
  onFindBook,
  onExit,
}: {
  erasedBooks: string[];
  onFindBook: () => void;
  onExit: () => void;
}) {
  const [step, setStep] = useState(0);

  // 金色の絵本に到達した時点で「手に取った」＝ golden-book-found を立てる（決断は 18b）。
  useEffect(() => {
    if (step === 1) onFindBook();
  }, [step, onFindBook]);

  return (
    <section className="flex w-full max-w-xl flex-col gap-6 px-6">
      {step === 0 && (
        <>
          <SceneView scenes={BASEMENT_INTRO} />
          {/* 保存庫：降ろした本の実データを無傷で表示（多いほど棚は豊か／空でも成立） */}
          <ul className="flex flex-col gap-1">
            {erasedBooks.map((id) => (
              <li key={id} className="border-b border-neutral-800 py-1 text-neutral-300">
                {getBook(id)?.title ?? id}
              </li>
            ))}
          </ul>
          <p className="text-sm text-neutral-500">
            {erasedBooks.length > 0 ? BASEMENT_SHELF_FILLED_LINE : BASEMENT_SHELF_EMPTY_LINE}
          </p>
          <button type="button" onClick={() => setStep(1)} className="self-start border border-neutral-600 px-4 py-2 text-neutral-300">
            奥へ進む
          </button>
        </>
      )}

      {step === 1 && (
        <>
          <Asset src="/assets/cg/golden-book.webp" alt="" className="max-h-[45vh] w-full rounded object-cover" />
          <SceneView scenes={GOLDEN_BOOK_SCENES} />
          <button type="button" onClick={() => setStep(2)} className="self-start border border-neutral-600 px-4 py-2 text-neutral-300">
            傍らの手記を開く
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <SceneView scenes={PREDECESSOR_JOURNAL} />
          <button type="button" onClick={() => setStep(3)} className="self-start border border-neutral-600 px-4 py-2 text-neutral-300">
            読み終える
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <SceneView scenes={BASEMENT_OUTRO} />
          <button type="button" onClick={onExit} className="self-start border border-neutral-600 px-4 py-2 text-neutral-300">
            階段を上る
          </button>
        </>
      )}
    </section>
  );
}
