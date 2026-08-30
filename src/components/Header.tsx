/**
 * Header Component
 * Main application header with title and navigation
 */

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-gray-900">
                {process.env.NEXT_PUBLIC_APP_NAME || "AI Chatbot"}
              </h1>
              <p className="text-xs text-gray-500">Powered by Gemini API</p>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-sm text-gray-600">
              Chat with AI
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
