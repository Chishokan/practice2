import type { Visitor } from '../../domain/types';

// 来訪者2：引退した船乗り。昔語りの相談。テキストは仮。
export const sailor: Visitor = {
  id: 'v02-sailor',
  displayName: '引退した船乗り',
  chapter: 1,
  order: 2,
  // 性格スケッチ：脱線への忍耐・好奇。正解は作らない。
  characterScene: {
    prompt: [
      {
        id: 'v02-char-prompt',
        speaker: '引退した船乗り',
        text: '……ああ、すまん。歳を取ると、つい昔話が長くなっていかん。',
      },
    ],
    choices: [
      { id: 'v02-c-listen', text: '「いえ、もっと聞かせてください」', conscienceDelta: 1 },
      { id: 'v02-c-work', text: '「まず、お探しの本ですね」' },
      { id: 'v02-c-probe', text: '「その船は、沈んだんですか?」' },
    ],
  },
  scenes: [
    { id: 'v02-req-1', speaker: '引退した船乗り', text: 'よう、司書さん。年寄りの頼みをひとつ聞いてくれ。' },
    {
      id: 'v02-req-2',
      speaker: '引退した船乗り',
      text: 'わしが若い頃の港は、そりゃあ賑やかでな。あの頃のことを、活字で確かめたいんだ。',
    },
  ],
  acceptableBooks: ['b04-harbor-chronicle', 'b09-kingdoms'],
  reactions: {
    'b04-harbor-chronicle': [
      {
        id: 'v02-r-harbor',
        speaker: '引退した船乗り',
        text: 'ああ、この年の入港数……間違いない、わしが乗ってた船も載ってる。懐かしいな。',
      },
    ],
    'b09-kingdoms': [
      {
        id: 'v02-r-kingdoms',
        speaker: '引退した船乗り',
        text: '港より前の話か。なるほど、あの防波堤はこの国の時代のものだったのか。',
      },
    ],
  },
  genericAcceptScene: [
    {
      id: 'v02-generic',
      speaker: '引退した船乗り',
      text: 'ふむ、これはこれで読み応えがありそうだ。もらっていくよ。',
    },
  ],
  refuseScene: [
    {
      id: 'v02-refuse',
      speaker: '引退した船乗り',
      text: 'なに、気にするな。また寄らせてもらう。',
    },
  ],
  flagsOnResolve: ['v02-sailor-resolved'],
};
