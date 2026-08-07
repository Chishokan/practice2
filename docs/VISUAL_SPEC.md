# ビジュアル仕様書（『貸出は三日まで』）＋AI生成プロンプト集

> プロンプトD1 の成果物。**この文書は仕様と生成プロンプトのみ**。画像の生成はD2（ユーザー）、
> 組み込みはD3（別セッション）。制作順序の原則（§7）どおり、絵は最後。★＝ディレクター確認点。
>
> ★**枚数の確認：** 立ち絵の実制作は **11枚**（来訪枠は12だが `baker再訪` が baker の絵を使い回すため）。
> プロンプト本文は「12枚」だが、ロスター上の**独立した来訪者は11人**（baker/sailor/child/tinker/teacher/
> oldwoman/peddler/clerk/antiquarian/musician/mother）。12枚を要する場合は、どの人物を追加するかご指示ください。

---

## 1. スタイルアンカー（全アセット共通・生成プロンプト先頭に付す）

すべての生成プロンプトの先頭に、次の英語ブロックを共通で付ける。

```
STYLE ANCHOR (prepend to every prompt):
quiet storybook illustration, muted low-saturation palette, thin delicate ink linework,
soft gentle watercolor shading, European translated-fantasy port town, calm and still mood,
restrained warmth, flat even light, subtle paper texture; NOT photorealistic, NOT anime,
no glossy specular highlights, no harsh contrast, no heavy black shadows.
```

共通ネガティブ（全アセット末尾に付す）：

```
NEGATIVE (append to every prompt):
text, letters, captions, watermark, signature, logo, ui, frame border,
high contrast, neon colors, saturated colors, glossy highlights, photorealism,
exaggerated facial expression, open-mouth shouting, extra limbs, deformed hands, blurry.
```

- **色彩の芯：** 低彩度・くすんだ生成り／セピア寄り。第2章より前に `--erasure`（消失の紫）を画面に出さない（§演出規則5）。紫は妖精 redeemed とエピローグ以外では使わない。
- **表情：** 立ち絵は感情を「持ち物・姿勢」で語る（表情差分禁止・CLAUDE.md）。穏やかな中間表情に固定。
- **線と陰影：** 細い線・柔らかい陰影。アニメ的ハイライト／強コントラスト／写実肌を避ける。

---

## 2. キャラシート（独立来訪者11人・全シート承認対象）

各シート＝**本文の手掛かり（出典）／新規確定する外見／禁止事項**。持ち物で人柄を示す（表情に頼らない）。

### 2.1 baker ／ パン屋の見習い（ch1-01, 再訪 ch2-01）
- **出典：** 「パン屋の見習い」（`ch1-01` displayName）。「新しいパンを任される」「香草をパンに合わせたい」「祖母がそういうのが得意だった」（`ch2-01` req）。若い見習い。
- **新規確定：** 10代後半〜20代前半。粉のついた前掛け、腕まくり、短めの髪、頬に少し粉。手には布巾で包んだ小さなパン、または香草の小枝。健康的で気さくな体格。
- **禁止：** 年配・熟練職人風。高級店の装い。祖母本人を描かない（伝聞のみ）。

### 2.2 sailor ／ 引退した船乗り（ch1-02, 再訪 ch3-02）
- **出典：** 「引退した船乗り」「わし」（一人称）。船「海燕」。「岸の目印を覚えて帰る」（`ch1-02` req-3）。老齢。
- **新規確定：** 60〜70代。日焼けと皺、白髪交じりの短い顎鬚、厚手の古いピーコート風上着、ニット帽。手にパイプか、丸めた海図。がっしりした背。
- **禁止：** 現役の華やかな制服。若さ。船そのものを大きく描かない（人物立ち絵）。

### 2.3 child ／ 星を見る子ども（ch1-03, 再訪 ch3-05）
- **出典：** 男の子。「字はまだ苦手だけど絵があれば読める」「屋根の上で星を見た」「ぼく」。第3章で「少し背がのびた」（`ch3-05`）。
- **新規確定：** 7〜9歳の男の子。1枚のみ（成長はテキストが語る）。少しくたびれた普段着、膝小僧、寝癖。手に星を指すしぐさ、または小さな金色の紙片（金色の絵本の伏線・文字は書かない）。
- **禁止：** 幼すぎ／大人びすぎ。成長後の別絵。怯えた表情。

### 2.4 tinker ／ 町のからくり好き（ch1-04）
- **出典：** 「町いちばんの水からくり」を作る発明家気質。「おれ」。陽気（`ch1-04` req/`はは！`）。「石工の覚書」の寸法を喜ぶ。
- **新規確定：** 30〜40代。油染みのエプロン、道具を差した革ベルト、まくった袖、跳ねた髪。手に歯車か螺子回し。前のめりの姿勢。
- **禁止：** 陰気・神経質。魔法使い風。清潔すぎる装い。

### 2.5 teacher ／ 村を出る教師（ch1-05, 再訪 ch3-01「教師」）
- **出典：** 女性。「来月この街を離れ、遠い村の学校へ移る」。「子どもたち」に街の地図を残したい。温かく少し切ない。再訪時は「二年、村の学校で教えている」。
- **新規確定：** 30代女性。落ち着いた色のロングスカートとショール、まとめ髪、丸メガネか無地の襟。手に地図の巻物か、数冊を紐で束ねた本。穏やかで芯のある立ち姿。
- **禁止：** 華美・若作り。生徒を一緒に描く。旅装すぎる大荷物。

### 2.6 oldwoman ／ 常連の老女（ch1-06）
- **出典：** 「常連の老女」。年配女性。「覚えていたはずのことが最初から無かったみたいに」＝記憶の綻びを老いで流す（`ch1-06`）。
- **新規確定：** 70代。編み込みショールと厚手の外套、杖、丸眼鏡を鼻先に。手に読みかけの本か毛糸。背は少し丸く、穏やかな常連の佇まい。
- **禁止：** 不気味・魔女風。過度に弱々しい病人描写。

### 2.7 peddler ／ 行商人（ch2-02）
- **出典：** 街から街へ渡る余所者。「目印（ランドマーク）を頼りに旅する」生業。「広場の大きな樫の木が無い」と気づく（`ch2-02`）。
- **新規確定：** 40代、性別は中庸に。大きな背負い荷（布と紐で括った雑多な品）、旅塵の外套、擦り切れたブーツ、地図を差した帯。手に街道の道標を見るしぐさ。
- **禁止：** 定住者の清潔な装い。豪商風。怪しい行商（善良な旅人として）。

### 2.8 clerk ／ 町役場の書記（ch2-03）
- **出典：** 事務的・冷たい第三者。「目録の完成」「整理を進めよ」と圧をかける。悪人ではなく、大義への従順で冷たい（`ch2-03`）。
- **新規確定：** 30〜40代。糊のきいた地味な制服風の上着、書類挟み（クリップボード的な板挟み）、几帳面に留めた襟、細い眼鏡。無感情な直立。手に印章か書類束。
- **禁止：** 温かい笑み。乱れた身なり。悪役然とした険しさ（冷たさは端正さで示す）。

### 2.9 antiquarian ／ 郷土史家（ch2-04, 再訪 ch3-03）
- **出典：** 記録を愛する好古家。「〜ですな」。「この土地の来し方を一冊に」。照合の人。夜分に古記録に埋もれる。
- **新規確定：** 50〜60代。着古したツイード風の上着、拡大鏡、インク染みの指、書物を小脇に。ボサついた白髪と無精髭。前かがみで熱心。手に手帖と鉛筆。
- **禁止：** 若さ。きらびやかな学者。真相を悟った不穏な目つき（善良で無自覚に）。

### 2.10 musician ／ 旅の楽師（ch2-05, 再訪 ch3-04）
- **出典：** 明るい新参者。「わたし」。土地から土地へ唄を集めて歩く。天井の高い部屋の響きを喜ぶ。終始朗らか（levity保持）。
- **新規確定：** 20〜30代。軽装の旅装、肩から提げた撥弦楽器（リュート／リラ風）、羽根か布飾りの帽子、身軽な立ち姿。手は弦に添える。快活で開けた雰囲気。
- **禁止：** 陰り・憂い。重装備。派手すぎる芸人衣装（素朴な旅の楽師）。

### 2.11 mother ／ 幼子の母（ch2-06, 再訪 ch3-05で child に同伴）
- **出典：** 「幼子の母」。温かいが少し不安げ。「寝る前の一冊」を借りに来る。child の母親。
- **新規確定：** 30代女性。エプロンをかけた家庭着、まとめた髪の後れ毛、腕に子ども用の膝掛けか小さな絵本。柔らかいが少し疲れた佇まい。child とは別立ち絵（同伴時は並置）。
- **禁止：** 華美。深刻な悲壮感。child と融合した構図（別々に描く）。

> **★再訪の扱い：** teacher/sailor/antiquarian/musician/child は再訪時も同一立ち絵を使い回す（表情差分禁止）。
> 変化はテキストが語る（例：child「背がのびた」）。baker再訪も baker の絵を使う（実制作から除外）。

---

## 3. 妖精（案内役）の2フォーム設計

**唯一2状態（基本形／redeemed）・道中は基本形固定・救済時に一度だけ切替**（§12.2）。別人化・変身演出は禁止。
redeemed は「**埃が落ちて、色が戻る**」方向＝同一存在の連続性を保った静かな変化。

### 3.1 基本形（base・道中すべて）
- 小動物風（本に潜める小ささ）。埃っぽく古びた、くすんだ生成り／灰茶の体色。半分眠そうな細い目。
- **栞のモチーフ（名の視覚的伏線）：** 体に**紐（栞紐）が一本、尾か首にゆるく巻きつく／古い本に挟まれた紙片が寄り添う**。文字で「しおり」とは書かない。
- 佇まい：古書の隙間で丸まる、埃をかぶった風情。

### 3.2 redeemed（救済時・一度だけ）
- **同一の姿のまま**、埃が落ち・古び（くすみ）が取れ・**そこだけ淡い色彩が戻り（ごく淡い菫／金の差し色）**・**閉じ気味だった目が開く**。輪郭・体型・大きさは基本形と同一。
- **栞紐が同じ位置にあるまま、色が戻ってほどける／軽く風にそよぐ**（連続性の証＝名の回収を視覚で）。
- 変身・発光の派手演出は禁止。差は「静けさの中の回復」に留める。`--erasure` の紫はここで初めて“癒える紫”として淡く許容。

---

## 4. 生成プロンプト集（貼って使える完成形）

各プロンプト＝**STYLE ANCHOR（§1）＋固有部（下記英語）＋NEGATIVE（§1）**。アスペクト比は末尾に付記。
（以下は固有部のみ記載。実使用時は §1 の共通ブロックで挟む。）

### 4.1 立ち絵11枚（縦・推奨 3:4／単体・無地〜ごく淡い背景）

**baker（パン屋の見習い）**
```
EN: full-body character portrait, a young baker's apprentice in late teens, flour-dusted
apron, rolled sleeves, short tousled hair, a smudge of flour on one cheek, holding a
cloth-wrapped small loaf and a sprig of herb, friendly calm demeanor, plain neutral background.
JP注: 若い見習い・粉の前掛け・香草の小枝・気さく。表情は穏やか固定。 AR 3:4
```

**sailor（引退した船乗り）**
```
EN: full-body character portrait, a retired old sailor in his late sixties, weathered
sun-tanned face, grey stubble, thick worn peacoat and knit cap, holding a pipe and a
rolled sea-chart, sturdy calm stance, plain neutral background.
JP注: 老船乗り・古いコート・海図・「わし」の風格。 AR 3:4
```

**child（星を見る子ども）**
```
EN: full-body character portrait, a small boy around eight, slightly worn everyday
clothes, scabby knees, bed-hair, one hand raised as if pointing at a star, a tiny
golden paper scrap in the other hand, bright innocent calm, plain neutral background.
JP注: 男の子1枚（成長は不描写）・星を指す・金色の紙片は名/絵本の伏線（文字なし）。 AR 3:4
```

**tinker（町のからくり好き）**
```
EN: full-body character portrait, an inventive tinkerer in his thirties, oil-stained
apron, leather tool-belt with tools, rolled sleeves, spiky hair, holding a brass gear
and a screwdriver, eager forward-leaning posture, plain neutral background.
JP注: 発明家気質・油染み・歯車・前のめり。 AR 3:4
```

**teacher（村を出る教師）**
```
EN: full-body character portrait, a woman schoolteacher in her thirties, muted long
skirt and shawl, hair tied back, round glasses, holding a rolled map and a small
string-bound stack of books, warm composed presence, plain neutral background.
JP注: 女性教師・地図の巻物・束ねた本・温かく芯のある。 AR 3:4
```

**oldwoman（常連の老女）**
```
EN: full-body character portrait, an elderly woman in her seventies, knitted shawl and
heavy coat, walking cane, round spectacles low on the nose, holding a half-read book,
gently stooped, serene regular-patron air, plain neutral background.
JP注: 常連の老女・ショール・杖・読みかけの本。不気味にしない。 AR 3:4
```

**peddler（行商人）**
```
EN: full-body character portrait, a travelling peddler around forty, large bundle pack
tied with cloth and rope, dust-worn cloak, scuffed boots, a rolled map tucked in the
belt, looking as if reading a road-marker, weathered kindly traveler, plain neutral background.
JP注: 旅の余所者・大きな背負い荷・道標を見るしぐさ・善良。 AR 3:4
```

**clerk（町役場の書記）**
```
EN: full-body character portrait, a town-hall clerk in their late thirties, crisp plain
uniform-like coat, a clipboard of documents, neatly buttoned collar, thin glasses,
impassive upright stance, holding a seal stamp, cold and tidy, plain neutral background.
JP注: 事務的・端正・書類挟み・印章。冷たさは端正さで（険しくしない）。 AR 3:4
```

**antiquarian（郷土史家）**
```
EN: full-body character portrait, a local historian in his late fifties, worn tweed
jacket, a magnifying glass, ink-stained fingers, an open notebook and pencil, unkempt
grey hair and stubble, stooped and earnest, plain neutral background.
JP注: 好古家・拡大鏡・手帖・インク染み。善良で無自覚。 AR 3:4
```

**musician（旅の楽師）**
```
EN: full-body character portrait, a cheerful travelling musician in their twenties,
light traveling clothes, a lute-like string instrument slung from the shoulder, a
feathered soft cap, buoyant open posture, hand resting on the strings, plain neutral background.
JP注: 明るい旅の楽師・撥弦楽器・軽装・快活。陰りなし。 AR 3:4
```

**mother（幼子の母）**
```
EN: full-body character portrait, a mother in her thirties, homely apron over a plain
dress, loose strands from tied-back hair, a child's small blanket or picture-book over
her arm, soft but slightly tired presence, plain neutral background.
JP注: 幼子の母・家庭着・子ども用の膝掛け／絵本・柔らかく少し疲れた。 AR 3:4
```

### 4.2 妖精2フォーム（縦 or 正方・単体）

**妖精 base**
```
EN: a small dusty book-fairy the size to hide between pages, small animal-like creature,
dull greyish-beige fur muted by dust, half-closed sleepy eyes, a single bookmark cord
loosely wound around its tail, curled among old books, quiet and antique, plain background.
JP注: 小動物風・埃っぽい・栞紐が尾に絡む（名の伏線・文字なし）・眠そう。 AR 1:1
```

**妖精 redeemed（救済時・一度だけ）**
```
EN: the same small book-fairy, identical shape and size, but the dust has fallen away and
faint color returns to it, a very pale violet-and-gold tint, its eyes now open and clear,
the same bookmark cord still in place, softened and lightly stirring; a quiet restoration,
NOT a transformation, no glow, plain background.
JP注: base と同一の姿のまま埃が落ち淡い色が戻り目が開く。栞紐は同位置。派手な発光・変身は禁止。 AR 1:1
```

### 4.3 背景5＋色調差分（横・推奨 16:9・人物なし）

**受付（閲覧室）base**
```
EN: interior of a small old library reading room, tall windows, wooden reception desk,
shelves of books along the walls, dust motes in soft daylight, empty of people, quiet
translated-fantasy port-town library, muted palette. JP注: 受付＝閲覧室。標準の昼。 AR 16:9
```
- **差分A（最終閉館日・西日）：** `... long low evening sunlight, warm amber slanting light, long shadows, stillness of a last day` JP注: 人物でないため差分可。
- **差分B（エピローグ・晴天）：** `... bright clear afternoon light, calm and gentle, a hopeful even brightness` JP注: エピローグ用。

**書架**
```
EN: rows of tall wooden bookshelves seen down an aisle, warm dim light, spines of many
books, a rolling ladder, quiet and orderly, muted palette, no people. JP注: 書架画面。 AR 16:9
```

**archive（整理・地下への口）**
```
EN: a back sorting area of the library near a stairway going down, crates and stacked
books to be lowered, cooler light, a faint draft suggested, muted palette, no people.
JP注: 整理画面。最下部に地下への気配（冷たい風）。 AR 16:9
```

**地下保存庫（basement）**
```
EN: an underground archive vault, long clean shelves receding into cool dark, dustless
and orderly, a single book on a stand deep at the back faintly glimmering, cold still air,
muted palette with a faint cool tint, no people. JP注: 保存庫。棚は整然・埃なし。最奥に金色の気配。 AR 16:9
```
- ★棚の本の量はプレイ状態依存（実装表示）。背景は「整然と続く棚」を描き、蔵書は組み込み側で載せる想定でよい。

### 4.4 イベント一枚絵3

**タイトル画面**
```
EN: title key art, a quiet old port-town library at dusk seen from outside or a hushed
reading room interior, a faint warm glow in the window, a small hint of a bookmark cord
on a windowsill, calm melancholic storybook mood, muted palette, space left for a title.
JP注: タイトル。栞紐をさりげなく（伏線）。題字スペースを残す。 AR 16:9
```

**金色の絵本の見開き**
```
EN: an open golden picture-book spread on a stand, gilded ornamental letters (illegible,
no readable text), strange never-seen creatures illustrated across both pages seeming to
look back at the viewer, faint gold light, hushed and uncanny but not frightening.
JP注: 金色の飾り文字（判読不能）・見たこともない生き物が「こちらを見る」・静かな不気味さ。 AR 3:2
```

**TRUEエピローグの読み聞かせ**
```
EN: a gentle scene, a librarian reading the golden picture-book aloud to a small boy while
his mother watches nearby, bright clear afternoon light through tall windows, warm and
quiet, storybook tenderness, muted palette, restrained. JP注: 地上・後日・読み聞かせ。湿らせない。母子同席。 AR 16:9
```

---

## 5. ファイル規約（D3 申し送り）

- **配置パス：** `public/assets/`
  - 立ち絵：`public/assets/visitors/<visitorId ベース>.webp`（例 `v02-sailor.webp`。再訪は同ファイルを参照）
  - 妖精：`public/assets/guide/base.webp` ／ `guide/redeemed.webp`
  - 背景：`public/assets/bg/reception.webp`／`reception-dusk.webp`／`reception-clear.webp`／`shelf.webp`／`archive.webp`／`basement.webp`
  - 一枚絵：`public/assets/cg/title.webp`／`golden-book.webp`／`epilogue.webp`
- **命名規則：** 英小文字・ハイフン。visitorId と対応（識別子は英語＝CLAUDE.md 規約）。表示テキストは content 側のまま。
- **推奨フォーマット/サイズ：** WebP（フォールバックに PNG 可）。立ち絵 長辺 ~1200px、背景/一枚絵 1920×1080 目安。スマホ考慮で各 300KB 前後に圧縮。`@2x` は当面不要。
- **未配置時 fallback（重要）：** 画像が無くても**現行のテキスト表示のまま破綻なく動く**こと。D3 では「asset があれば表示、無ければ従来UI」の分岐で組み込む（画像は装飾レイヤーとして載せ、ルール・進行は不変）。
- **色トークン：** `--erasure`（消失の紫）は第2章より前に出さない規約を、背景・一枚絵でも遵守（base 受付/書架/archive は紫を使わない）。

---

## 6. D2/D3 への引き継ぎ

- **D2（ユーザー生成）：** §4 のプロンプトを画像生成ツールへ。立ち絵11＋妖精2＋背景5(+差分2)＋一枚絵3＝**生成対象 計 21〜23 点**（差分含む）。スタイルアンカーを毎回先頭に付す。
- **D3（組み込み）：** §5 の規約で `public/assets/` に配置し、fallback 分岐で表示。ルール・テキスト・エンド判定は不変（絵は装飾レイヤー）。妖精 redeemed の切替は既存 `guide-redeemed` フラグに接続。
