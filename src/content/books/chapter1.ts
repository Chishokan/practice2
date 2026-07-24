import type { Book } from '../../domain/types';

// 第1章の仮の蔵書データ。テキストは仮。summary は「嘘は書かないが全ては書かない」方針。
// hiddenNote / erasureEffects は Phase 2・Phase 4 で詰めるため、ここでは未設定。

export const chapter1Books: Book[] = [
  {
    id: 'b01-town-map',
    title: '街の古い地図',
    category: 'record',
    summary: '数十年前の街並みを写した一枚。今はもう無い通りの名も載っている。',
  },
  {
    id: 'b02-dragon-smith',
    title: '竜と鍛冶屋',
    author: '作者不詳',
    category: 'story',
    summary: '山に住む竜と、麓の鍛冶屋の交わりを描いた民話。',
  },
  {
    id: 'b03-herb-guide',
    title: '香草の手引き',
    category: 'magic',
    summary: '台所と薬棚のあいだにある草木の使い方。効能の但し書きが細かい。',
  },
  {
    id: 'b04-harbor-chronicle',
    title: '港の年代記',
    category: 'history',
    summary: '交易でにぎわった頃の港を、年ごとに書き留めた記録。',
  },
  {
    id: 'b05-reading-stars',
    title: '星を読む夜に',
    category: 'magic',
    summary: '季節ごとの星の並びと、そこに託された古い言い伝え。',
  },
  {
    id: 'b06-lullabies',
    title: '忘れられた童謡集',
    category: 'story',
    summary: '寝かしつけに歌われた短い唄を集めたもの。旋律の記譜はない。',
  },
  {
    id: 'b07-library-plan',
    title: '図書館の設計図',
    category: 'record',
    summary: 'この建物が建てられたときの図面。地下書庫の区画も描かれている。',
  },
  {
    id: 'b08-winter-preserves',
    title: '冬の保存食',
    category: 'record',
    summary: '寒い季節を越すための漬け方・干し方をまとめた家庭の覚書。',
  },
  {
    id: 'b09-kingdoms',
    title: '王国興亡記',
    category: 'history',
    summary: '興っては消えた小国の年表。港の年代記より前の時代を扱う。',
  },
  {
    id: 'b10-traveler-diary',
    title: '旅人の日記',
    category: 'story',
    summary: '国境をいくつも越えた者の私的な記録。地名の綴りに揺れがある。',
  },
  {
    id: 'b11-herbal-atlas',
    title: '薬草図鑑・改',
    category: 'magic',
    summary: '香草の手引きを図版で補うために編まれた続き。挿絵が豊富。',
  },
  {
    id: 'b12-mason-notes',
    title: '石工の覚書',
    category: 'record',
    summary: 'この街の壁や井戸を築いた職人の手控え。寸法の数字が並ぶ。',
  },
];
