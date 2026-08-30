/**
 * Main Chat Page
 * Integrates chat UI components with state management
 */

"use client";

import { useState, useCallback } from "react";
import MessageList from "@/components/MessageList";
import ChatInput from "@/components/ChatInput";
import { ChatHistoryMessage, Message } from "@/types/chat";

interface ChatApiResponse {
  response?: string;
  error?: string;
}

const apiTimeout = Number.parseInt(
  process.env.NEXT_PUBLIC_API_TIMEOUT || "30000",
  10
);

function getRequestErrorMessage(error: unknown): string {
  if (error instanceof DOMException && error.name === "TimeoutError") {
    return "応答がタイムアウトしました。通信状況を確認して、もう一度お試しください。";
  }

  if (error instanceof TypeError) {
    return "サーバーに接続できませんでした。通信状況を確認して、もう一度お試しください。";
  }

  return error instanceof Error
    ? error.message
    : "予期しないエラーが発生しました。もう一度お試しください。";
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = useCallback(
    async (content: string) => {
      // Create user message
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      // Update messages and clear error
      const conversationHistory: ChatHistoryMessage[] = [
        ...messages,
        userMessage,
      ].map(({ role, content: messageContent }) => ({
        role,
        content: messageContent,
      })).slice(-50);

      if (conversationHistory[0]?.role === "assistant") {
        conversationHistory.shift();
      }

      setMessages((prev) => [...prev, userMessage]);
      setError(null);
      setIsLoading(true);

      try {
        // Call API endpoint
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages: conversationHistory }),
          signal: AbortSignal.timeout(
            Number.isFinite(apiTimeout) ? apiTimeout : 30000
          ),
        });

        const data = (await response
          .json()
          .catch(() => ({}))) as ChatApiResponse;

        if (!response.ok) {
          throw new Error(data.error || "AIから応答を取得できませんでした。");
        }

        if (!data.response) {
          throw new Error("AIから空の応答が返されました。もう一度お試しください。");
        }

        const aiMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
      } catch (err) {
        setError(getRequestErrorMessage(err));
        console.error("Error sending message:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  return (
    <div className="max-w-4xl mx-auto w-full h-full flex flex-col">
      {/* Error Message */}
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-4 mt-4"
        >
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
      />
    </div>
  );
}
