import { useMemo, useState } from 'react';
import type { PuzzleGate as PuzzleGateData, PuzzleSpec } from '../../domain/types';
import { isChoiceCorrect, isMatchComplete } from '../../domain/puzzle';
import { rpgStep, RPG_INITIAL, RPG_MAX_HP, type RpgCommand } from '../../domain/rpg';
import { useGameStore } from '../../store/gameStore';
import SceneView from './SceneView';

// 遊びの層（§13）のゲート表示。出題の口上→ミニゲーム→（誤答で本人の声のヒント）。
// 正解で onSolved（＝解決フラグを立てる）。成績・試行回数は conscience に影響しない。
export default function PuzzleGate({ gate, onSolved }: { gate: PuzzleGateData; onSolved: () => void }) {
  const [wrong, setWrong] = useState(0);
  const onWrong = () => setWrong((w) => w + 1);
  const hint = wrong > 0 ? gate.hints[Math.min(wrong - 1, gate.hints.length - 1)] : null;

  return (
    <div className="flex flex-col gap-4 border-l border-neutral-700 pl-3">
      <SceneView scenes={gate.intro} />
      <Puzzle spec={gate.puzzle} onSolved={onSolved} onWrong={onWrong} />
      {hint && <p className="text-sm text-neutral-500">{hint}</p>}
    </div>
  );
}

function Puzzle({ spec, onSolved, onWrong }: { spec: PuzzleSpec; onSolved: () => void; onWrong: () => void }) {
  if (spec.kind === 'match') return <MatchPuzzle spec={spec} onSolved={onSolved} onWrong={onWrong} />;
  if (spec.kind === 'rpg') return <RpgPuzzle spec={spec} onSolved={onSolved} />;

  // reference / gap：選択式。正解で解決、誤答でヒントを一段進める。
  const question = spec.question;
  const options = spec.options;
  return (
    <div className="flex flex-col gap-3">
      {'cells' in spec && (
        <div className="flex gap-2 text-neutral-300">
          {spec.cells.map((c, i) => (
            <span key={i} className="border border-neutral-800 px-3 py-1">
              {c}
            </span>
          ))}
        </div>
      )}
      <p className="text-neutral-300">{question}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => (isChoiceCorrect(spec, opt) ? onSolved() : onWrong())}
            className="border border-neutral-600 px-4 py-2 text-neutral-200"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// 照合（対合わせ）：本カード列と貸出票カード列。本→票の順に選び、同じ組なら固定、違えば戻す。
function MatchPuzzle({
  spec,
  onSolved,
  onWrong,
}: {
  spec: Extract<PuzzleSpec, { kind: 'match' }>;
  onSolved: () => void;
  onWrong: () => void;
}) {
  const books = spec.pairs.map((p, i) => ({ i, face: p.book }));
  // 票は本と別の並びにする（正解が横並びで揃わないように逆順で固定）。乱数は使わない。
  const slips = useMemo(() => spec.pairs.map((p, i) => ({ i, face: p.slip })).reverse(), [spec]);
  const [selBook, setSelBook] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[]>([]);

  const pickSlip = (slipIndex: number) => {
    if (selBook === null || matched.includes(slipIndex)) return;
    if (selBook === slipIndex) {
      const nm = [...matched, slipIndex];
      setMatched(nm);
      setSelBook(null);
      if (isMatchComplete(nm.length, spec.pairs.length)) onSolved();
    } else {
      onWrong();
      setSelBook(null);
    }
  };

  return (
    <div className="flex gap-6">
      <ul className="flex flex-1 flex-col gap-2">
        {books.map((b) => (
          <li key={b.i}>
            <button
              type="button"
              disabled={matched.includes(b.i)}
              onClick={() => setSelBook(b.i)}
              className={`w-full border px-3 py-2 text-left text-sm ${
                matched.includes(b.i)
                  ? 'border-neutral-800 text-neutral-600'
                  : selBook === b.i
                    ? 'border-neutral-300 text-neutral-100'
                    : 'border-neutral-600 text-neutral-200'
              }`}
            >
              {b.face}
              {matched.includes(b.i) && ' ✓'}
            </button>
          </li>
        ))}
      </ul>
      <ul className="flex flex-1 flex-col gap-2">
        {slips.map((s) => (
          <li key={s.i}>
            <button
              type="button"
              disabled={matched.includes(s.i)}
              onClick={() => pickSlip(s.i)}
              className={`w-full border px-3 py-2 text-left text-sm ${
                matched.includes(s.i)
                  ? 'border-neutral-800 text-neutral-600'
                  : 'border-neutral-600 text-neutral-200'
              }`}
            >
              {s.face}
              {matched.includes(s.i) && ' ✓'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 読み聞かせRPG⑧：b02『竜と鍛冶屋』。勝ち筋＝はなす（正史の友情）。たたかう連打でも詰まない。
// 在（b02が書架にある）＝一緒に読む（地の文寄り）／不在（降ろし済み）＝child が GM（語り寄り）。
// 進行・正誤・再挑戦はすべて child の声（＋最小の地の文）。システム通知調ゼロ。
function RpgPuzzle({ spec, onSolved }: { spec: Extract<PuzzleSpec, { kind: 'rpg' }>; onSolved: () => void }) {
  const erasedBooks = useGameStore((s) => s.world.erasedBooks);
  const read = !erasedBooks.includes(spec.bookId); // 在＝読む／不在＝語り（GM）

  const opening = read
    ? '（本を開くと、山の上の竜が、鍛冶屋を見下ろしている。）'
    : 'はい、しょうぶ! やまのうえに、りゅうがいるよ。たたかう? まもる? はなす?';
  const msg = (kind: 'fight' | 'guard' | 'win' | 'lose') => {
    const table = {
      read: {
        fight: '（鍛冶屋は槌を構えた。）「ちがうよ! りゅうはね、わるいりゅうじゃないんだよ!」',
        guard: '（鍛冶屋は身をかまえた。）「そう、まもって……そのあいだに、はなしかけてみて!」',
        win: '（鍛冶屋は槌を置いて、竜に話しかけた。）「そう! それでね、りゅうとね、ともだちになるの!」',
        lose: '「あーあ、まけちゃった! ……いいの、もういっかい! さいしょから、よもう!」',
      },
      recite: {
        fight: '「たたかう? ……でもね、りゅうはおこってないよ。ちがうちがう!」',
        guard: '「まもる! ……そのあいだに、はなしかけるんだよ!」',
        win: '「はなす! ……そうだよ! りゅうとね、ともだちになるんだ。さいごは、ずっと、なかよし!」',
        lose: '「あーあ、まけちゃった! もういっかい、さいしょから!」',
      },
    };
    return table[read ? 'read' : 'recite'][kind];
  };

  const [state, setState] = useState(RPG_INITIAL);
  const [line, setLine] = useState(opening);
  const [won, setWon] = useState(false);

  const act = (cmd: RpgCommand) => {
    const r = rpgStep(state, cmd);
    if (r.outcome === 'win') {
      setLine(msg('win'));
      setWon(true);
    } else if (r.outcome === 'lose') {
      setState(r.state);
      setLine(msg('lose'));
    } else {
      setState(r.state);
      setLine(msg(cmd === 'fight' ? 'fight' : 'guard'));
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-neutral-500">鍛冶屋 {'♥'.repeat(state.smithHp)}{'♡'.repeat(RPG_MAX_HP - state.smithHp)}</p>
      <p className="leading-relaxed text-neutral-300">{line}</p>
      {won ? (
        <button type="button" onClick={onSolved} className="self-start border border-neutral-500 px-4 py-2 text-neutral-100">
          よめた!
        </button>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => act('fight')} className="border border-neutral-600 px-4 py-2 text-neutral-200">
            たたかう
          </button>
          <button type="button" onClick={() => act('guard')} className="border border-neutral-600 px-4 py-2 text-neutral-200">
            まもる
          </button>
          <button type="button" onClick={() => act('talk')} className="border border-neutral-600 px-4 py-2 text-neutral-200">
            はなす
          </button>
        </div>
      )}
    </div>
  );
}
