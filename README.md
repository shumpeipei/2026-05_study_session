# 2026-05_study_session

社内勉強会（コーディネーション・合意形成スキル）の告知ページ。

## 技術スタック

| 種別           | 技術・サービス                                  |
| -------------- | ----------------------------------------------- |
| ホスティング   | GitHub Pages                                    |
| フロントエンド | HTML / CSS / JavaScript（ライブラリなし）       |
| フォント       | Google Fonts（Noto Serif JP / Shippori Mincho） |
| カウンター API | counterapi.dev（v2）                            |
| API プロキシ   | Google Apps Script（Web App）                   |

## 構成

```
ブラウザ（GitHub Pages）
　↓ GAS Web App URL へ GET リクエスト（action=get / action=up）
Google Apps Script
　↓ counterapi.dev v2 API へリクエスト（Authorization ヘッダー付き）
counterapi.dev
　↓ カウント値を返す
Google Apps Script
　↓ { ok: true, value: N } の形式で返す
ブラウザ
　↓ 参加人数を画面に表示
```

## 各ファイルの役割

### `index.html`

告知ページ本体。以下の機能を含む。

- 勉強会情報の表示（開催日時・形式・プログラム・対象者）
- 参加ボタン（クリックでカウントアップ・同一ブラウザからの二重カウントを localStorage で防止）
- 参加人数のリアルタイム表示
- 自己診断クイズ（3問・選択後に即時フィードバック・スコアに応じた診断結果表示）

### `gas_code.gs`

Google Apps Script のコード。APIキーを GAS 側のみで保持し、HTML に露出させないためのプロキシとして機能する。

- `action=get`：counterapi.dev からカウント値を取得して返す
- `action=up`：カウントをインクリメントして更新後の値を返す
- レスポンス形式：`{ ok: true, value: N }` / `{ ok: false, error: "..." }`

## 設定が必要な箇所

### gas_code.gs

```javascript
const COUNTER_API_KEY = 'YOUR_API_KEY'; // counterapi.dev の APIキー
```

### index.html

```javascript
const GAS_URL = 'YOUR_GAS_WEB_APP_URL'; // GAS デプロイ後に発行される URL
```

## デプロイ手順

1. [script.google.com](https://script.google.com) で新規プロジェクトを作成し `gas_code.gs` を貼り付け
2. APIキーを設定後、「デプロイ」→「新しいデプロイ」→ 種類：ウェブアプリ・アクセス：全員 でデプロイ
3. 発行された Web App URL を `index.html` の `GAS_URL` に設定
4. `index.html` と `README.md` を GitHub リポジトリの `main` ブランチにプッシュ
5. リポジトリの Settings → Pages → Source を `main` ブランチに設定して公開

## 注意事項

- counterapi.dev のカウンターは `up_count`（増加数の累計）を参加人数として使用している
- 二重カウント防止は `localStorage` による簡易対応のため、異なるブラウザや端末からは再度押下が可能
- GAS の無料枠（1日あたりの実行回数：20,000回）を超えると一時的に利用不可となるが、社内利用の規模では問題ない