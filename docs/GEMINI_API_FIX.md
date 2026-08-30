# Gemini API 無料版の設定ガイド

## エラーの原因

```
Gemini API error: 404 - models/gemini-1.5-pro is not found
```

### 根本原因

`gemini-1.5-pro` は **Google Cloud の有料プランが必要** なため、無料版では使用できません。

- **有料版が必要**: `gemini-pro`, `gemini-1.5-pro`, `gemini-2.0-pro`
- **無料版で利用可**: `gemini-1.5-flash` のみ

## 解決策：無料版で利用可能なモデル

### 推奨設定（無料版）

```env
GEMINI_API_MODEL=gemini-1.5-flash
GEMINI_API_VERSION=v1
```

**gemini-1.5-flash** は Google が無料版向けに提供している高速モデルです。

### モデル比較表

| モデル | 提供方式 | API 版 | 推奨用途 |
|--------|---------|--------|---------|
| **gemini-1.5-flash** | 📌 **無料** | v1 | このアプリで使用（推奨） |
| gemini-1.5-pro | 💰 有料 | v1/v1beta | 高精度が必要な場合 |
| gemini-2.0-pro | 💰 有料 | v1beta | 最新機能が必要な場合 |
| gemini-pro | 💰 有料 | v1 | 古いモデル（廃止予定） |

## 無料版の制限事項

### レート制限（Rate Limit）

| 項目 | 制限 |
|------|------|
| リクエスト数 | 1 分あたり 60 回まで |
| 1 日あたりのリクエスト数 | 無制限 |
| トークン数 | 1 分あたり 4,000 トークン |

### 使用限度

- 無料版では **毎月一定量まで無料** で使用可能
- 超過すると自動的に遮断されます
- [Google AI Studio ダッシュボード](https://aistudio.google.com) で使用量を確認

## 更新ファイル一覧

### 1. `.env.example` と `.env.local`

```env
# API設定
# Free tier: gemini-1.5-flash
GEMINI_API_MODEL=gemini-1.5-flash
GEMINI_API_VERSION=v1
```

### 2. `src/lib/gemini.ts`

```typescript
const apiModel = process.env.GEMINI_API_MODEL || "gemini-1.5-flash";
const apiVersion = process.env.GEMINI_API_VERSION || "v1";
```

## gemini-1.5-flash の特徴

### 利点
- ✅ 完全無料
- ✅ 高速レスポンス（数百ミリ秒）
- ✅ 日本語対応
- ✅ チャットに最適

### 注意点
- ⚠️ gemini-1.5-pro より精度が低い場合がある
- ⚠️ レート制限あり
- ⚠️ 複雑な推論タスクには向かない

## 有料版への移行方法

もし高精度が必要な場合、有料版へ移行できます：

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. Billing を有効化（クレジットカード登録）
3. Vertex AI API を有効化
4. API キーを取得
5. 環境変数を以下に変更：

```env
GEMINI_API_MODEL=gemini-1.5-pro
GEMINI_API_VERSION=v1beta
```

## トラブルシューティング

### Q: それでも 404 エラーが出る場合
- A: `npm run dev` を再起動して環境変数をリロードしてください

### Q: レート制限エラーが出た
- A: API リクエストの間隔を長くするか、有料版に移行してください

### Q: 日本語が正しく処理されない
- A: 入力メッセージの前に「日本語で回答してください」と指示を追加

## 参考資料

- [Google AI Studio（無料版 API キー取得）](https://aistudio.google.com/)
- [Gemini API 価格表](https://ai.google.dev/pricing)
- [Gemini API ドキュメント](https://ai.google.dev/)
- [使用量確認（Google AI Studio ダッシュボード）](https://aistudio.google.com/app/home)

