import type { Scene } from '../domain/types';

// 終幕（18b）の非・妖精テキスト。妖精の台詞は guide.ts に集約（出所の一元化）。

// 最終閉館日（修正1）：最後の来訪者のあと、閉館までの自由時間。システム通知調にしない。
// この窓の中で 台帳→開示→探索→是正3→整理→地下 の既存連鎖が成立する。
export const FINAL_DAY_SCENES: Scene[] = [
  { id: 'final-day-1', text: '日が傾いて、閲覧室に西日が長く伸びている。今日は、もう誰も来ないようだ。' },
  { id: 'final-day-2', text: '……閉館まで、あなたひとりの時間。' },
];
export const CLOSE_LIBRARY_LABEL = '閉館する';
export const TIDY_SHELF_LABEL = '書架を整理する';

// 対峙の選択肢文言。司書側の反論は最大一行（TRUE の反論は言葉でなく名と絵本で示す）。
export const CONFRONT_CHOICE_COMPLETE = '目録を、完成させる。';
export const CONFRONT_CHOICE_BEQUEATH = '……ここで、止める。台帳は、次の人へ。';
export const CONFRONT_CHOICE_NAME = '彼女に、伝えたいことがある。';

// 名前入力＝最後のレファレンス。強ヒントは出さない（名は読解の証明）。
export const NAMING_PROMPT = '——彼女の名を、呼ぶ。';
export const NAMING_PLACEHOLDER = 'なまえ';
export const NAMING_SUBMIT = '呼ぶ';
export const NAMING_CANCEL = 'やめておく';

// 妖精フォームのプレースホルダ（ビジュアルは Phase D。ここでは状態の可視化のみ）。
export const GUIDE_FORM_BASE = '（妖精：基本形）';
export const GUIDE_FORM_REDEEMED = '（妖精：救済の姿）';

// TRUE エピローグ（地上・後日）。short・静か・湿らせない。目録未完は一行の情景で置く。
export const EPILOGUE_SCENES: Scene[] = [
  {
    id: 'epilogue-1',
    text: '後日。よく晴れた午後。母に手を引かれて、あの子がやってくる。',
  },
  {
    id: 'epilogue-2',
    text: 'あなたは、金色の絵本を開く。見たこともない生き物たちが、頁の上で、こちらを見ている。あなたは、静かに読み始める。',
  },
  {
    id: 'epilogue-3',
    // 目録未完を情景で（解説しない）。
    text: '台帳の目録は、あと一冊を残したまま。誰も、それを埋めようとはしない。',
  },
  {
    id: 'epilogue-4',
    speaker: '星を見る子ども',
    // child の最後の台詞（一字一句この通り）。
    text: 'ほらね。ぼく、見たもん。',
  },
];
