# Gemini API Model エラー対応

## エラー内容

```
Gemini API error: 404 - {
  "error": {
    "code": 404,
    "message": "models/gemini-pro is not found for API version v1, 
               or is not supported for generateContent. 
               Call ModelService.ListModels to see the list of available models 
               and their supported methods.",
    "status": "NOT_FOUND"
  }
}
```

## 原因

### 1. **モデル名が古い（推奨理由）**
   - `gemini-pro` は Google が廃止した古いモデル名
   - 現在の Gemini API では利用できない
   - Google は常に最新のモデルのみをサポート

### 2. **API バージョンが不正**
   - `v1` は完全には非推奨ではないが、`v1beta` の方が推奨される
   - 新機能は `v1beta` に実装される

## 解決策

### 変更内容

| 項目 | 旧値 | 新値 | 理由 |
|------|------|------|------|
| モデル名 | `gemini-pro` | `gemini-1.5-pro` | 現在利用可能な最新モデル |
| API バージョン | `v1` | `v1beta` | 最新機能対応 |

### 利用可能なモデル一覧

| モデル名 | 特徴 | 用途 |
|---------|------|------|
| `gemini-1.5-pro` | **推奨** - 高精度 | 複雑な推論、長文処理 |
| `gemini-1.5-flash` | 高速、低コスト | 短時間応答が必要な場合 |
| `gemini-2.0-pro` | 最新（プレビュー） | 最新機能が必要な場合 |

## 更新ファイル一覧

1. `.env.example`
   ```env
   GEMINI_API_MODEL=gemini-1.5-pro
   GEMINI_API_VERSION=v1beta
   ```

2. `.env.local`
   ```env
   GEMINI_API_MODEL=gemini-1.5-pro
   GEMINI_API_VERSION=v1beta
   ```

3. `src/lib/gemini.ts`
   ```typescript
   const apiModel = process.env.GEMINI_API_MODEL || "gemini-1.5-pro";
   const apiVersion = process.env.GEMINI_API_VERSION || "v1beta";
   ```

## 検証方法

修正後、以下の手順で動作確認してください：

1. 開発サーバーを再起動
   ```bash
   npm run dev
   ```

2. ブラウザで http://localhost:3000 を開く

3. テストメッセージを送信
   - 例：「こんにちは」
   - AI が正常に応答することを確認

## Google Gemini API ドキュメント

- [Gemini API 公式ドキュメント](https://ai.google.dev/)
- [利用可能なモデル一覧](https://ai.google.dev/models)
- [API リファレンス](https://ai.google.dev/api)

## 注意事項

- 新しいモデルが発表されると、このドキュメントを更新する必要があります
- `.env.local` は機密情報のため、絶対にリポジトリにコミットしないこと
- プロダクション環境では、Vercel などのホスティングサービスで環境変数を設定してください
