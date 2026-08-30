/**
 * MessageList Component
 * Displays all chat messages with auto-scroll to bottom
 */

"use client";

import { useEffect, useRef } from "react";
import { Message as MessageType } from "@/types/chat";
import Message from "./Message";

interface MessageListProps {
  messages: MessageType[];
  isLoading?: boolean;
}

export default function MessageList({
  messages,
  isLoading = false,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {messages.length === 0 ? (
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
      ) : (
        <>
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          {isLoading && (
            <div
              role="status"
              aria-live="polite"
              aria-label="AIが応答を生成しています"
              className="flex gap-3 mb-4"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">AI</span>
              </div>
              <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg rounded-bl-none">
                <span className="sr-only">AIが応答を生成しています</span>
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </>
      )}
    </div>
  );
}
