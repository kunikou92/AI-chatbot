/**
 * Main Chat Page
 * Provides the base layout for the chat interface
 */

export default function ChatPage() {
  return (
    <div className="max-w-4xl mx-auto w-full h-full flex flex-col">
      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <div className="flex justify-center items-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              チャットを開始
            </h2>
            <p className="text-gray-600 max-w-sm">
              下の入力欄にメッセージを入力して、AI との会話を始めてください。
            </p>
          </div>
        </div>
      </div>

      {/* Chat Input Container */}
      <div className="border-t border-gray-200 bg-white px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="メッセージを入力してください..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled
            />
            <button
              disabled
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              送信
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            ※ 次のステップでチャット機能を実装します
          </p>
        </div>
      </div>
    </div>
  );
}
