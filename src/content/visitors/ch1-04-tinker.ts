import type { Visitor } from '../../domain/types';

// 来訪者：町のからくり好き。第1章のユーモア枠。和やかさの上限を定める基準点。
// 陽気でテンポのよい人物だが、「反転の一言」だけは "消失そのもの"（最も重い真相）を
// さらりと落とす。プレイヤーはその場では笑って流し、後で思い返して寒くなる——という役。
// 綻び①②は担わない（baker と oldwoman が担当）。tinker は最後まで和やか。
export const tinker: Visitor = {
  id: 'v04-tinker',
  displayName: '町のからくり好き',
  chapter: 1,
  // 登場順（設計表確定）：3番手＝ユーモア枠。sailor の後、child の前。
  order: 3,
  // 性格スケッチ：大言壮語にどう付き合うか。正解は作らず、要望へ無反応で合流する。
  characterScene: {
    prompt: [
      {
        id: 'v04-char-prompt',
        speaker: '町のからくり好き',
        text: '今度の傑作はな、百年経っても語り草になる。おれの名も歴史に刻まれるってわけよ！ ……で、司書さん、どう思う？',
      },
    ],
    choices: [
      { id: 'v04-c-ground', text: '「まずは、無事に動くといいですね」' },
      { id: 'v04-c-play', text: '「完成したら、真っ先に見せてくださいね」', conscienceDelta: 1 },
      { id: 'v04-c-tech', text: '「軸の受けは、もう考えてあるんですか？」', conscienceDelta: 1 },
    ],
  },
  scenes: [
    {
      id: 'v04-req-1',
      speaker: '町のからくり好き',
      text: 'よう司書さん！ 聞いてくれ、ついに完成間近なんだ。町いちばんの水からくりがよ！',
    },
    {
      id: 'v04-req-2',
      speaker: '町のからくり好き',
      text: 'そいつの仕上げに参考書が要る。寸法がびしっと載ってるやつか、鍛冶の心意気が分かるやつを頼む。',
    },
    {
      id: 'v04-req-3',
      speaker: '町のからくり好き',
      // 反転の一言（消失そのもの）を、陽気な職人の与太話に紛れ込ませる。説明はしない。
      text: 'からくりってのは面白いぜ。誰かが「こう作った」と書き残したから、今も動く。その紙きれが消えりゃ、からくりごと最初から無かったことになる。ま、そんなこた起きやしないがな！ はは！ さ、探してくれよ！',
    },
  ],
  acceptableBooks: ['b12-mason-notes', 'b02-dragon-smith'],
  reactions: {
    'b12-mason-notes': [
      {
        id: 'v04-r-mason',
        speaker: '町のからくり好き',
        text: '石工の覚書か！ 寸法がびっしりだ……よし、これで軸がぶれねえ。あんた天才だな、司書さん！',
      },
    ],
    'b02-dragon-smith': [
      {
        id: 'v04-r-dragon',
        speaker: '町のからくり好き',
        text: '竜と鍛冶屋！ いいねえ、この鍛冶屋の意地。おれのからくりにも魂ってやつを入れなきゃな。もらってくぜ、恩に着る！',
      },
    ],
  },
  genericAcceptScene: [
    {
      id: 'v04-generic',
      speaker: '町のからくり好き',
      text: 'お、なんだか面白そうだ。これも参考にさせてもらうよ。ありがとうな、司書さん！',
    },
  ],
  refuseScene: [
    {
      id: 'v04-refuse',
      speaker: '町のからくり好き',
      text: 'つれないねえ！ ま、いいさ。自分の頭でひねり出すのも一興だ。またな、司書さん！',
    },
  ],
  flagsOnResolve: ['v04-tinker-resolved'],
};
