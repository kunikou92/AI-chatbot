# AI Chatbot

Next.js と Gemini API で構築した、日本語対応のシンプルなチャットアプリです。

## 実装済み機能

- Gemini APIを利用した会話
- 直近50件の会話コンテキスト
- 送信中表示と多重送信防止
- タイムアウト、通信失敗、APIエラーの案内
- Enterで送信、Shift+Enterで改行できる自動伸縮入力欄
- 1000文字制限とレスポンシブ表示
- APIの簡易レート制限と一時的エラーの再試行

会話履歴はブラウザを再読み込みすると消去されます。永続保存、認証、会話削除、ストリーミングは未実装です。

## 必要な環境

- Node.js 20.9以上
- npm
- Google AI Studioで発行したGemini APIキー

## セットアップ

```bash
npm install
```

`.env.example` を `.env.local` にコピーし、`GEMINI_API_KEY` を設定します。

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

開発サーバーを起動します。

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開いて利用できます。

## 環境変数

| 変数 | 必須 | デフォルト | 説明 |
| --- | --- | --- | --- |
| `GEMINI_API_KEY` | はい | なし | Gemini APIキー。サーバー側のみで使用 |
| `GEMINI_API_MODEL` | いいえ | `gemini-3.6-flash` | 使用するモデル |
| `GEMINI_API_VERSION` | いいえ | `v1beta` | Gemini APIのバージョン |
| `GEMINI_API_TIMEOUT` | いいえ | `30000` | Gemini APIのタイムアウト（ミリ秒） |
| `API_RATE_LIMIT_PER_MINUTE` | いいえ | `20` | 1クライアントあたりの毎分リクエスト数 |
| `NEXT_PUBLIC_APP_NAME` | いいえ | `AI Chatbot` | 画面に表示するアプリ名 |
| `NEXT_PUBLIC_API_TIMEOUT` | いいえ | `30000` | ブラウザ側のタイムアウト（ミリ秒） |

`NEXT_PUBLIC_` が付かない値はブラウザへ公開されません。`.env.local` はGit管理対象外です。APIキーをソースコードやコミットに含めないでください。

## 品質確認

```bash
npm run check
```

このコマンドでESLint、TypeScript、本番ビルドをまとめて確認できます。

個別のコマンドは次のとおりです。

```bash
npm run lint
npm run build
npm run start
```

## 本番公開

公開先の環境変数設定画面で、少なくとも `GEMINI_API_KEY` を登録してからビルドしてください。本番ではHTTPSを使用し、利用量とGemini APIの課金・割り当てを監視してください。

組み込みのレート制限は単一プロセス向けの簡易実装です。複数サーバーへ展開する場合は、共有ストレージを利用するレート制限へ置き換えてください。
