import type { Scene } from '../domain/types';

// 案内役（図書館の妖精）の登場＋大義提示。第1章冒頭（着任時）に一度だけ出す。
//
// 憲法（§12.1〜12.3・厳守）：
//  - 正体（破滅を望む）は最後まで説明しない。愛らしい復興の導き手として登場。
//  - 消失・綻び・真相に一切言及しない。気づいた素振りも見せない。
//  - 担うのは表の層のみ（操作案内・大義提示・和やかな雑談）。フォームは基本形。
//  - 大義の口頭提示はこの初回のみ。以降の進捗は台帳の目録ページで静かに（Phase 6）。
//
// 二重性（説明せずに仕込む）：無邪気な励ましが、すべて「本を降ろす＝消す」方向を向く。
//  「降ろすたび目録が埋まる」「図書館は呼吸する（要らないものを下へ）」「いい司書ぶりを」
//  ——善意の助言として語られるが、構造上その達成は消失を要求する（E1＝良き司書＝最悪へ）。
export const GUIDE_SPEAKER = '妖精';

export const guideIntroScenes: Scene[] = [
  {
    id: 'guide-intro-1',
    text: '着任の朝。誰もいない閲覧室に、埃と、古い紙の匂いが漂っている。返却棚の奥で、あなたは一冊の古びた本を見つけた。',
  },
  {
    id: 'guide-intro-2',
    text: '表紙をそっと開くと——ページの隙間で、何かが、もぞ、と動いた。',
  },
  {
    id: 'guide-intro-3',
    speaker: GUIDE_SPEAKER,
    text: '……ん。……ふぁ……。あ、あれ? 起きて、しまいました……。',
  },
  {
    id: 'guide-intro-4',
    speaker: GUIDE_SPEAKER,
    text: 'こんにちは、司書さん。新しく来られた方ですね? ……ふふ、ずうっと待っていたんですよ。こんなに埃をかぶって。',
  },
  {
    id: 'guide-intro-5',
    speaker: GUIDE_SPEAKER,
    text: 'わたしは、この図書館の……ええと、留守番のようなもの。名前は、うまく思い出せなくて。好きに呼んでくださいな。',
  },
  {
    id: 'guide-intro-6',
    speaker: GUIDE_SPEAKER,
    text: '見てください、この有様。棚はぎゅうぎゅう、目録は途中のまま。先代さんは、道半ばで行ってしまわれたの。',
  },
  {
    id: 'guide-intro-7',
    speaker: GUIDE_SPEAKER,
    // 大義提示：純粋な復興目標として前向きに。
    text: 'でも、大丈夫。あなたとなら、立て直せます。先代の遺した「収蔵目録」を、二人で完成させましょう。この館を、もう一度きらめかせるんです。',
  },
  {
    id: 'guide-intro-8',
    speaker: GUIDE_SPEAKER,
    // 因果の善意化：降ろす＝目録が進む、と伝える。消えることには一切触れない。
    text: 'やり方は、とても簡単。棚が手狭になったら、古い本を地下書庫へ降ろして、整理する。それだけ。降ろすたびに、目録はひとつ、また埋まっていきますよ。',
  },
  {
    id: 'guide-intro-9',
    speaker: GUIDE_SPEAKER,
    // 二重性の締め：破壊を「呼吸」と言い換え、E1（良き司書）へ促す。
    text: '図書館は、そうやって呼吸するんです。要らないものを、そっと下へ。新しいものを、迎えるために。……さ、はじめましょう。あなたの、いい司書ぶりを、見せてくださいな。',
  },
];

// 是正3＝「一度だけの不自然」（§12.7 改訂版：金色の絵本を探して見つからない場面の直後）。
// 妖精は絵本の所在を知っているため、探す前から結果を知っていた"態度"だけが漏れる。
// 漏らすのは知識ではなく態度。何が起きたかは一切説明しない。フォーム不変・システム通知なし。
// これは intro を除く妖精の道中唯一の台詞（他所から妖精台詞を出す経路を作らない）。
export const guideFinalRemarkScenes: Scene[] = [
  {
    id: 'guide-final-remark-1',
    speaker: GUIDE_SPEAKER,
    text: '……見つかりませんでしたか。',
  },
  {
    id: 'guide-final-remark-2',
    speaker: GUIDE_SPEAKER,
    text: '……いえ、私の思い違いでしょう。',
  },
];

// 終幕・対峙（§12.7 の終着点）。妖精が初めて自分の論理を語る。厳守：
//  - 正体・破滅・消失の機序を語らない（§12.2）。嘘は一つもつかない。
//  - 語彙は彼女自身のものだけ（完成・きれい・傷まない・失われない・呼吸・いい司書）。
//    intro 原文に無い語（例：静けさ）を新たに足さない。
//  - 核心＝悪意なき不理解。「どうして」を責め口調にしない。強制しない。
export const guideConfrontScenes: Scene[] = [
  { id: 'guide-confront-1', speaker: GUIDE_SPEAKER, text: '……ご覧になったのですね。' },
  {
    id: 'guide-confront-2',
    speaker: GUIDE_SPEAKER,
    text: 'あそこでは、なにも傷みません。なにも、失われません。ずっと、きれいなまま。',
  },
  {
    id: 'guide-confront-3',
    speaker: GUIDE_SPEAKER,
    text: '目録が完成すれば、この館は、呼吸を続けられます。あなたは、いい司書でいられる。',
  },
  {
    id: 'guide-confront-4',
    speaker: GUIDE_SPEAKER,
    // 悪意なき不理解。責め口調にしない。
    text: '……先代さんも、途中で、やめてしまわれた。どうして、みなさん。……わたしには、わからないんです。',
  },
  { id: 'guide-confront-5', speaker: GUIDE_SPEAKER, text: 'あなたは、どうなさいますか。' },
];

// 名前入力中、誤入力への妖精の反応（静かに待つのみ・責めない・促しすぎない）。
export const guideNamingWaitScenes: Scene[] = [
  { id: 'guide-naming-wait-1', speaker: GUIDE_SPEAKER, text: '……はい。' },
];

// 救済（TRUE・正名で呼ばれた瞬間）。語りは最小。理由も正体も語らない。
export const guideRescueScenes: Scene[] = [
  { id: 'guide-rescue-1', speaker: GUIDE_SPEAKER, text: '……ああ。……そうでした。わたし、しおり。' },
  { id: 'guide-rescue-2', speaker: GUIDE_SPEAKER, text: '……また明日、って。言われたきりだったんです。' },
  // TRUE の幕（一字一句この通り）。
  { id: 'guide-rescue-3', speaker: GUIDE_SPEAKER, text: 'また、明日。' },
];
