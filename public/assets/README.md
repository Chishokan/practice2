# 画像アセット配置（D2 生成 → ここへ配置）

仕様は `docs/VISUAL_SPEC.md`。未配置でもゲームは fallback で動く（画像は装飾レイヤー）。
WebP 推奨（PNG 可）。配置後は D3 実装済みのスロットが自動で表示する。

- 立ち絵：`visitors/<visitorId>.webp`（v01-baker / v02-sailor / v03-child / v04-tinker /
  v05-teacher / v06-oldwoman / v08-peddler / v09-clerk / v10-antiquarian / v11-musician /
  v12-mother）。再訪（v07/v13〜v17）は元の人物の絵を自動で使い回す（配置不要）。
- 妖精：`guide/base.webp` ／ `guide/redeemed.webp`
- 背景：`bg/reception.webp` `bg/reception-dusk.webp`（最終閉館日）`bg/reception-clear.webp`（TRUEエピローグ）
  `bg/shelf.webp` `bg/archive.webp` `bg/basement.webp`
- 一枚絵：`cg/title.webp` `cg/golden-book.webp` `cg/epilogue.webp`
