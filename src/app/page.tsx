/**
 * Main Chat Page
 * Integrates chat UI components with state management
 */

"use client";

import { useState, useCallback } from "react";
import MessageList from "@/components/MessageList";
import ChatInput from "@/components/ChatInput";
import { Message } from "@/types/chat";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);

  const handleSendMessage = useCallback(
    async (content: string) => {
      // Check if API key is available
      if (!process.env.NEXT_PUBLIC_APP_NAME && process.env.NODE_ENV === "production") {
        setIsApiKeyMissing(true);
        return;
      }

      // Create user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      // Update messages and clear error
      setMessages((prev) => [...prev, userMessage]);
      setError(null);
      setIsLoading(true);

      try {
        // TODO: Call API endpoint in next task
        // For now, this is a placeholder
        console.log("Message sent:", content);

        // Show a note that API is not yet integrated
        setError(
          "API 連携はタスク5で実装予定です。チャット入力は機能しています。"
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "エラーが発生しました";
        setError(errorMessage);
        console.error("Error sending message:", err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return (
    <div className="max-w-4xl mx-auto w-full h-full flex flex-col">
      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-4 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-xl">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <MessageList messages={messages} isLoading={isLoading} />

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        disabled={isApiKeyMissing}
      />
    </div>
  );
}
