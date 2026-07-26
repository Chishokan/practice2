import type { Visitor } from '../../domain/types';

// 来訪者3：星を見るのが好きな子ども。素朴な相談。テキストは仮。
export const child: Visitor = {
  id: 'v03-child',
  displayName: '星を見る子ども',
  chapter: 1,
  order: 3,
  // 性格スケッチ：優しさ vs 厳密な正直さ。どちらも正解にしない。
  characterScene: {
    prompt: [
      {
        id: 'v03-char-prompt',
        speaker: '星を見る子ども',
        text: 'あのね、あの星、ぼくが見つけたんだよ。だからぼくの星なんだ。……だめかな?',
      },
    ],
    choices: [
      { id: 'v03-c-wonder', text: 'しゃがんで目線を合わせ、一緒に不思議がる', conscienceDelta: 1 },
      { id: 'v03-c-send', text: '本を渡して、そっと見送る' },
      { id: 'v03-c-poem', text: '「その星、君だけの名前をつけていいんだよ」', conscienceDelta: 1 },
    ],
  },
  scenes: [
    { id: 'v03-req-1', speaker: '星を見る子ども', text: 'ねえ、司書さん。夜のこと、わかる本ある？' },
    {
      id: 'v03-req-2',
      speaker: '星を見る子ども',
      text: 'こないだ屋根の上で見た星の並びに、名前があるんだって。それが知りたいの。',
    },
  ],
  acceptableBooks: ['b05-reading-stars', 'b06-lullabies'],
  reactions: {
    'b05-reading-stars': [
      {
        id: 'v03-r-stars',
        speaker: '星を見る子ども',
        text: 'わあ、あった！ これ、この形！ 名前もちゃんと載ってる。ありがとう！',
      },
    ],
    'b06-lullabies': [
      {
        id: 'v03-r-lullaby',
        speaker: '星を見る子ども',
        text: 'この唄、おばあちゃんが歌ってた……星のこと、唄になってたんだ。',
      },
    ],
  },
  genericAcceptScene: [
    {
      id: 'v03-generic',
      speaker: '星を見る子ども',
      text: 'うーん、むずかしいけど、読んでみる。ありがとう！',
    },
  ],
  refuseScene: [
    {
      id: 'v03-refuse',
      speaker: '星を見る子ども',
      text: 'そっか……じゃあ、またね。',
    },
  ],
  flagsOnResolve: ['v03-child-resolved'],
};
