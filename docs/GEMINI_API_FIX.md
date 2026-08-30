# Gemini API 無料版の設定ガイド

## エラーの原因

```
Gemini API error: 404 - models/gemini-1.5-flash is not found for API version v1beta
```

### 根本原因

Google AI Studio（無料版）の API キーでは、最新のモデル（`gemini-1.5-flash`, `gemini-1.5-pro`）は利用できません。

- **無料版で利用可**: `gemini-pro` のみ（v1 エンドポイント）
- **有料版が必要**: `gemini-1.5-pro`、`gemini-1.5-flash` など

⚠️ 最新モデルが無料で使えると思われていますが、Google Cloud のリソースが必要です。

## 解決策：無料版で利用可能なモデル

### 推奨設定（無料版）

```env
GEMINI_API_MODEL=gemini-pro
GEMINI_API_VERSION=v1
```

**gemini-pro** は Google AI Studio（無料）で実際に利用できる唯一のモデルです。

### モデル比較表

| モデル | 提供方式 | API 版 | 入手方法 |
|--------|---------|--------|---------|
| **gemini-pro** | 📌 **無料** | v1 | AI Studio（このアプリで使用） |
| gemini-1.5-flash | 💰 有料（Paid Tier） | v1beta | Google Cloud のみ |
| gemini-1.5-pro | 💰 有料（Paid Tier） | v1/v1beta | Google Cloud のみ |
| gemini-2.0-pro | 💰 有料（Paid Tier） | v1beta | Google Cloud のみ |

⚠️ **重要**: Google AI Studio（無料）では `gemini-pro` のみが利用可能です。他のモデルは Google Cloud（クレジットカード必須）が必要です。

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
# Free tier model: gemini-pro with v1 endpoint
GEMINI_API_MODEL=gemini-pro
GEMINI_API_VERSION=v1
```

### 2. `src/lib/gemini.ts`

```typescript
const apiModel = process.env.GEMINI_API_MODEL || "gemini-pro";
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

