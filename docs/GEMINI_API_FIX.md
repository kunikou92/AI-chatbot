# Gemini API 404 エラーの修正

## 原因

旧設定の `gemini-pro` + `v1` は現在の Gemini API で `generateContent` に利用できず、404 `NOT_FOUND` が返ります。

## 現在の設定

```env
GEMINI_API_MODEL=gemini-3.6-flash
GEMINI_API_VERSION=v1beta
```

API キーは URL に含めず、`x-goog-api-key` リクエストヘッダーで送信します。

環境変数を変更した後は、開発サーバーを再起動してください。

利用可能なモデルは API キーや提供時期によって変わります。再びモデルの 404 が発生した場合は、Gemini API の `models.list` で `generateContent` 対応モデルを確認してください。

## 参考資料

- [Gemini のモデル一覧](https://ai.google.dev/gemini-api/docs/models)
- [モデル一覧 API](https://ai.google.dev/api/models)
- [コンテンツ生成 API](https://ai.google.dev/api/generate-content)
