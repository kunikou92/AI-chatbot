/**
 * ChatInput Component
 * Input form for sending chat messages
 */

"use client";

import { useEffect, useRef, useState } from "react";

const maxMessageLength = 1000;

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
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = inputRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [input]);

  useEffect(() => {
    if (!isLoading && !disabled) {
      inputRef.current?.focus();
    }
  }, [disabled, isLoading]);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      !e.nativeEvent.isComposing
    ) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  const isDisabled = isLoading || disabled || input.trim() === "";
  const isNearLimit = input.length >= maxMessageLength * 0.9;

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={isLoading}
      className="border-t border-gray-200 bg-white px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:px-6 sm:py-4 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="メッセージを入力してください..."
            aria-describedby="message-help message-count"
            rows={1}
            className="max-h-40 min-h-12 flex-1 resize-none overflow-y-auto px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={disabled || isLoading}
            maxLength={maxMessageLength}
          />
          <button
            type="submit"
            disabled={isDisabled}
            aria-disabled={isDisabled}
            className="min-h-12 w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500 whitespace-nowrap sm:w-auto"
          >
            {isLoading ? "送信中..." : "送信"}
          </button>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <p id="message-help" className="text-xs text-gray-500">
            Enterで送信・Shift+Enterで改行
          </p>
          <p
            id="message-count"
            className={`text-xs ${isNearLimit ? "font-medium text-amber-600" : "text-gray-500"}`}
          >
            {input.length}/{maxMessageLength}
          </p>
          {disabled && (
            <p className="w-full text-xs text-red-500">
              API キーが設定されていません
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
