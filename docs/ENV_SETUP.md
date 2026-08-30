# 環境構築ガイド

## 環境変数のセットアップ

### 1. .env.local ファイルの作成

```bash
cp .env.example .env.local
```

### 2. 必須環境変数の設定

#### GEMINI_API_KEY（必須）

Gemini API キーを取得して設定します。

1. [Google AI Studio](https://aistudio.google.com/app/apikey) にアクセス
2. 「API key を作成」をクリック
3. 表示されたキーをコピー
4. `.env.local` の `GEMINI_API_KEY=` に貼り付け

例：
```env
GEMINI_API_KEY=AIzaSyD...
```

### 3. オプション環境変数

以下は `.env.example` にデフォルト値が設定されており、必要に応じてカスタマイズできます。

| 変数 | デフォルト値 | 説明 |
|------|-------------|------|
| `NEXT_PUBLIC_APP_NAME` | `AI Chatbot` | アプリケーション名 |
| `NEXT_PUBLIC_API_TIMEOUT` | `30000` | ブラウザ側のタイムアウト（ミリ秒） |
| `GEMINI_API_TIMEOUT` | `30000` | Gemini API側のタイムアウト（ミリ秒） |
| `API_RATE_LIMIT_PER_MINUTE` | `20` | 1クライアントあたりの毎分リクエスト数 |
| `GEMINI_API_MODEL` | `gemini-3.6-flash` | 使用するGeminiモデル |
| `GEMINI_API_VERSION` | `v1beta` | Gemini APIのバージョン |

### 4. 環境変数の検証

APIキーが未設定の場合、チャットAPIは利用者向けの設定エラーを返します。

```bash
npm run dev
```

必須環境変数が設定されていない場合、画面に次の内容が表示されます：

```
AIサービスのAPIキーが設定されていません。管理者にお問い合わせください。
```

### 5. 本番環境への対応

本番環境（Vercel など）では、以下の方法で環境変数を設定します：

**Vercel（推奨）**
1. Vercel ダッシュボードでプロジェクトを開く
2. 「Settings」→「Environment Variables」
3. 変数を追加
4. デプロイし直す

**その他のホスティング**
- ホスティング提供者の環境変数設定画面を確認
- 本番環境でも同じ環境変数名を使用

### 6. セキュリティについて

- `.env.local` はローカル開発用で、**絶対にリポジトリにコミットしないでください**
- `.gitignore` に既に記載されているので自動的に除外されます
- API キーは機密情報です。公開リポジトリでは特に注意してください

### トラブルシューティング

**エラー: "Missing environment variables"**
- `.env.local` に必要な環境変数が設定されているか確認してください
- `GEMINI_API_KEY` が正しく設定されているか確認
- ファイルを編集後、開発サーバーを再起動してください

**エラー: "API key invalid"**
- Google AI Studio で生成したキーが有効か確認
- キーをコピーする際にスペースが入っていないか確認
- キーをリセットして新しいキーを作成してみてください

## 次のステップ

環境変数の設定が完了したら、以下を実行してください：

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開いて、アプリが正常に起動することを確認してください。
