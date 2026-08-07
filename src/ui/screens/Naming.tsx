import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { matchesGuideName } from '../../domain/naming';
import SceneView from '../components/SceneView';
import GuideForm from '../components/GuideForm';
import { guideConfrontScenes, guideNamingWaitScenes } from '../../content/guide';
import { NAMING_PROMPT, NAMING_PLACEHOLDER, NAMING_SUBMIT, NAMING_CANCEL } from '../../content/finale';
import { FLAG_GUIDE_REDEEMED } from '../../content/story';

// 名前入力＝最後のレファレンス。正解「しおり」は手記由来のみ（ここには出さない）。
// 詰みなし：再試行無制限＋いつでも「やめておく」で対峙へ戻れる（TRUE を逃してもエンドへ抜けられる）。
// 誤入力は妖精が静かに待つのみ。成績・試行回数は conscience に影響しない（照合に加点を持たせない）。
export default function Naming() {
  const goTo = useGameStore((s) => s.goTo);
  const markFlag = useGameStore((s) => s.markFlag);
  const [value, setValue] = useState('');
  const [tried, setTried] = useState(false);

  const submit = () => {
    if (matchesGuideName(value)) {
      // 正名で呼ばれた瞬間＝救済。フォーム切替は救済シーンで一度だけ。
      markFlag(FLAG_GUIDE_REDEEMED);
      goTo('rescue');
    } else {
      setTried(true);
    }
  };

  return (
    <section className="flex w-full max-w-xl flex-col gap-6 px-6">
      <GuideForm />
      {/* 対峙の余韻を薄く残す（強ヒントは出さない） */}
      <SceneView scenes={guideConfrontScenes.slice(-1)} />
      <p className="text-neutral-300">{NAMING_PROMPT}</p>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={NAMING_PLACEHOLDER}
          className="border border-neutral-700 bg-transparent px-3 py-2 text-neutral-100 placeholder:text-neutral-600"
        />
        <button type="button" onClick={submit} className="border border-neutral-500 px-4 py-2 text-neutral-100">
          {NAMING_SUBMIT}
        </button>
        <button type="button" onClick={() => goTo('confront')} className="border border-neutral-800 px-3 py-2 text-sm text-neutral-500">
          {NAMING_CANCEL}
        </button>
      </div>
      {tried && <SceneView scenes={guideNamingWaitScenes} />}
    </section>
  );
}
