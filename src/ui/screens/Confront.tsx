import { useGameStore } from '../../store/gameStore';
import SceneView from '../components/SceneView';
import { guideConfrontScenes } from '../../content/guide';
import { GUIDE_FORM_BASE, CONFRONT_CHOICE_COMPLETE, CONFRONT_CHOICE_BEQUEATH, CONFRONT_CHOICE_NAME } from '../../content/finale';
import {
  FLAG_TRUTH_REACHED,
  FLAG_CHOSE_CLOSE,
  FLAG_CHOSE_BEQUEATH,
  ANCHOR_BOOK_ID,
  CONSCIENCE_THRESHOLD,
} from '../../content/story';

// 終幕・対峙。妖精が初めて論理を語り、司書に委ねる。フォームは基本形のまま（救済まで不変）。
// 第三の道（名を伝える）は、救済＝TRUE の3条件が揃うときだけ提示する。
// （表示条件を TRUE 条件に一致させることで、正名入力→救済→TRUE が必ず整合する。）
export default function Confront() {
  const world = useGameStore((s) => s.world);
  const goTo = useGameStore((s) => s.goTo);
  const markFlag = useGameStore((s) => s.markFlag);

  const truth = world.flags.has(FLAG_TRUTH_REACHED);
  const anchorSafe = !world.erasedBooks.includes(ANCHOR_BOOK_ID);
  const conscienceOk = world.conscience >= CONSCIENCE_THRESHOLD;
  const canName = truth && anchorSafe && conscienceOk;

  const complete = () => {
    markFlag(FLAG_CHOSE_CLOSE);
    goTo('closed');
  };
  const bequeath = () => {
    markFlag(FLAG_CHOSE_BEQUEATH);
    goTo('closed');
  };

  return (
    <section className="flex w-full max-w-xl flex-col gap-6 px-6">
      <p className="text-xs text-neutral-600">{GUIDE_FORM_BASE}</p>
      <SceneView scenes={guideConfrontScenes} />
      <div className="flex flex-col gap-2">
        <button type="button" onClick={complete} className="border border-neutral-700 px-4 py-2 text-left text-neutral-200">
          {CONFRONT_CHOICE_COMPLETE}
        </button>
        <button type="button" onClick={bequeath} className="border border-neutral-700 px-4 py-2 text-left text-neutral-200">
          {CONFRONT_CHOICE_BEQUEATH}
        </button>
        {canName && (
          <button type="button" onClick={() => goTo('naming')} className="border border-neutral-500 px-4 py-2 text-left text-neutral-100">
            {CONFRONT_CHOICE_NAME}
          </button>
        )}
      </div>
    </section>
  );
}
