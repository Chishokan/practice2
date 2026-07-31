import type { Visitor } from '../../domain/types';

// 来訪者3：星を見るのが好きな子ども。第1章で最も純度の高い「無垢の温度」。
// 綻びは担わない（①②は baker と oldwoman のみ）。悲劇にしない。明るく純粋なまま。
// 反転の一言（searchBlock「確かに見た」）は、子どもの譲らない確信から自然に出す。
// 大人は「見間違いかな」と譲るが、子どもは譲らない。その譲らなさが不穏を残す。
// モチーフ（星を見る＝記録に無いものを確かに見た）と真相（見たのに検索に出ない）が二重に結ばれる。
export const child: Visitor = {
  id: 'v03-child',
  displayName: '星を見る子ども',
  chapter: 1,
  order: 3,
  // 性格スケッチ：子ども相手の対応で人柄が出る。優しさ vs 厳密さ。正解は作らない。
  characterScene: {
    prompt: [
      {
        id: 'v03-char-prompt',
        speaker: '星を見る子ども',
        text: 'あのね、あの星、ぼくが見つけたんだよ。だからぼくの星なんだ。……だめかな？',
      },
    ],
    choices: [
      { id: 'v03-c-wonder', text: 'しゃがんで目線を合わせ、一緒に不思議がる', conscienceDelta: 1 },
      { id: 'v03-c-send', text: '本を渡して、そっと見送る' },
      { id: 'v03-c-poem', text: '「その星、君だけの名前をつけていいんだよ」', conscienceDelta: 1 },
    ],
  },
  scenes: [
    {
      id: 'v03-req-1',
      speaker: '星を見る子ども',
      text: 'ねえ、司書さん！ 夜のこと、星のことがわかる本、ある？ ぼく、字はまだ苦手だけど、絵があれば読めるよ。',
    },
    {
      id: 'v03-req-2',
      speaker: '星を見る子ども',
      text: 'こないだ屋根の上で見たんだ。星が、こう、ひしゃくみたいに並んでた。あれ、名前があるんでしょ？ それが知りたいの。',
    },
    {
      id: 'v03-req-3',
      speaker: '星を見る子ども',
      // 反転の一言（searchBlock）：大人は譲るが子どもは譲らない。「確かに見た」を疑いなく差し出す。
      text: 'あのね、大人はみんな「そんな星ないよ」って言うの。地図にも載ってないって。……でも、ぼく、確かに見たもん。あの並び、ちゃんとあったんだから。見間違いなんかじゃないよ。',
    },
  ],
  acceptableBooks: ['b05-reading-stars', 'b06-lullabies'],
  reactions: {
    'b05-reading-stars': [
      {
        id: 'v03-r-stars',
        speaker: '星を見る子ども',
        text: 'わあ、あった！ これ、この形！ ほら、ぼくの言ったとおりだ。名前もちゃんと載ってる。ね、嘘じゃなかったでしょ？ ありがとう、司書さん！',
      },
    ],
    'b06-lullabies': [
      {
        id: 'v03-r-lullaby',
        speaker: '星を見る子ども',
        text: 'この唄、知ってる……おばあちゃんが歌ってた！ そっか、あの星のこと、唄になってたんだ。今夜さっそく、屋根の上で歌ってみる！',
      },
    ],
  },
  genericAcceptScene: [
    {
      id: 'v03-generic',
      speaker: '星を見る子ども',
      text: 'うーん、ちょっとむずかしそう。でも、絵のところだけでも読んでみる！ ありがとう、司書さん！',
    },
  ],
  refuseScene: [
    {
      id: 'v03-refuse',
      speaker: '星を見る子ども',
      text: 'そっか、今日はないのか……。いいよ、また来る。星は逃げないもん。じゃあね、司書さん！',
    },
  ],
  flagsOnResolve: ['v03-child-resolved'],
};
