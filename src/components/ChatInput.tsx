/**
 * ChatInput Component
 * Input form for sending chat messages
 */

"use client";

import { useState, useRef } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function ChatInput({
  onSendMessage,
  isLoading = false,
  disabled = false,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate input
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Send message
    onSendMessage(trimmedInput);

    // Clear input
    setInput("");

    // Focus back to input
    inputRef.current?.focus();
  };

  const isDisabled = isLoading || disabled || input.trim() === "";

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={isLoading}
      className="border-t border-gray-200 bg-white px-4 sm:px-6 lg:px-8 py-4"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力してください..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={disabled || isLoading}
            maxLength={1000}
          />
          <button
            type="submit"
            disabled={isDisabled}
            aria-disabled={isDisabled}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500 whitespace-nowrap"
          >
            {isLoading ? "送信中..." : "送信"}
          </button>
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-xs text-gray-500">
            {input.length}/1000
          </p>
          {disabled && (
            <p className="text-xs text-red-500">
              API キーが設定されていません
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
