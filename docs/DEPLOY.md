# 配布手順（Cloudflare Pages）

`貸出は三日まで` を Cloudflare Pages で公開するための手順書。
**アカウント操作（Cloudflare へのログイン・接続・公開）はユーザー作業。** Claude Code 側の担当は
設定ファイル（`public/_redirects`・OGP メタ・favicon）と本手順書まで。

## 1. ビルド設定（Cloudflare Pages プロジェクト作成時に入力）

| 項目 | 値 |
|---|---|
| Framework preset | **Vite**（無ければ "None" でも可） |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | （リポジトリ直下・空欄） |
| Node version | 18 以上（`NODE_VERSION=20` を環境変数に入れると安定） |
| 環境変数 | **不要**（localStorage セーブのみ・外部APIなし） |

- **プロジェクト名の提案：** `kashidashi-mikka`（＝ `kashidashi-mikka.pages.dev`。ユーザーが変更可）。
- SPA ルーティング：`public/_redirects`（`/* /index.html 200`）を同梱済み。単一ページ構成のため通常不要だが、直リンク時の 404 を防ぐ保険。

## 2. Private リポジトリのまま接続する手順（ユーザー作業）

1. Cloudflare ダッシュボード → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**。
2. GitHub 連携を承認（**Private リポジトリのまま**選択可能。Cloudflare の GitHub App に当該リポジトリのアクセスを許可）。
3. リポジトリ `Chishokan/practice2`、ブランチ `claude/read-before-follow-nvxlyl`（または公開用に `main` へマージ後 `main`）を選択。
4. 上表のビルド設定を入力 → **Save and Deploy**。
5. 数分で `https://<プロジェクト名>.pages.dev` が発行される。

## 3. 独自ドメイン（任意・ユーザー作業）

- プロジェクト → **Custom domains** → **Set up a domain** → ドメインを入力し、指示どおり DNS（CNAME）を設定。
- 独自ドメインを使わない場合は `pages.dev` サブドメインのままで公開可。

## 4. OGP 画像について（重要）

- 既定の `og:image` は文字のみのフォールバック `/(public)/og.svg`（常に存在・ネタバレなし）。
- **X（Twitter）など一部プラットフォームは SVG の OGP を表示しない。** より確実にサムネイルを出すには、
  公開ドメイン確定後に **1200×630 の PNG/JPG** を用意し、`index.html` の `og:image`・`twitter:image` を
  その絶対URL（例 `https://<domain>/og.png`）に差し替える（相対パスでも多くは解決するが、SNS は絶対URL 推奨）。
- D2 で `public/assets/cg/title.webp` を配置したら、それを 1200×630 に書き出して `og.png` にするのが手早い。

## 5. 公開前のローカル確認

```
npm ci
npm run build      # dist/ を生成（strict 型チェック込み）
npm run preview    # ローカルで本番ビルドを確認（既定 http://localhost:4173）
```

- スモーク：タイトル →「はじめる」→ E1 通し／「つづきから」→（セーブがあれば）復元。
- 画像は現状の配置状態のままで可（未配置は fallback＝テキスト表示・破綻なし）。
- 詳細な公開前チェックは `docs/RELEASE_CHECKLIST.md` を参照。

## 6. 更新の反映

- 接続ブランチに push すると Cloudflare Pages が自動で再ビルド・再デプロイ。
- D2 で `public/assets/` に画像を追加 → コミット & push するだけで本番に反映（コード変更不要）。
