import type { Visitor } from '../../domain/types';

// 来訪者1：パン屋の見習い。和やかな日常の相談。テキストは仮。
export const baker: Visitor = {
  id: 'v01-baker',
  displayName: 'パン屋の見習い',
  chapter: 1,
  order: 1,
  // 性格スケッチ：人へ向く温度を見る。どれも要望へ合流し、反応は返さない。
  characterScene: {
    prompt: [
      {
        id: 'v01-char-prompt',
        speaker: 'パン屋の見習い',
        text: '祖母は無口な人で……でも、台所にいるときだけはよく喋ったな。',
      },
    ],
    choices: [
      { id: 'v01-c-listen', text: '「覚えてる範囲で、お祖母さんの話を聞かせて」', conscienceDelta: 1 },
      { id: 'v01-c-work', text: '「では、それらしい本を探しますね」' },
      { id: 'v01-c-quiet', text: '「……いい思い出だね」とだけ返す', conscienceDelta: 1 },
    ],
  },
  scenes: [
    { id: 'v01-req-1', speaker: 'パン屋の見習い', text: 'こんにちは。ちょっと、探している本があって。' },
    {
      id: 'v01-req-2',
      speaker: 'パン屋の見習い',
      text: '去年亡くなった祖母が、冬になると変わった漬物を作っていたんです。あの味を、もう一度。',
    },
  ],
  acceptableBooks: ['b08-winter-preserves', 'b03-herb-guide'],
  reactions: {
    'b08-winter-preserves': [
      {
        id: 'v01-r-preserves',
        speaker: 'パン屋の見習い',
        text: 'これ……ページの隅の書き込み、祖母の字にそっくりだ。ありがとう、司書さん。',
      },
    ],
    'b03-herb-guide': [
      {
        id: 'v01-r-herb',
        speaker: 'パン屋の見習い',
        text: '香草の配合……そうか、あの香りはこれだったのかも。試してみます。',
      },
    ],
  },
  genericAcceptScene: [
    {
      id: 'v01-generic',
      speaker: 'パン屋の見習い',
      text: 'ありがとう。これも、何かの手がかりになるかもしれない。',
    },
  ],
  refuseScene: [
    {
      id: 'v01-refuse',
      speaker: 'パン屋の見習い',
      text: 'そうですか……また今度、出直します。',
    },
  ],
  flagsOnResolve: ['v01-baker-resolved'],
};
