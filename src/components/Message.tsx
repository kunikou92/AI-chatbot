/**
 * Message Component
 * Displays a single chat message (user or AI)
 */

import { Message as MessageType } from "@/types/chat";

interface MessageProps {
  message: MessageType;
}

export default function Message({ message }: MessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 mb-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* Avatar - AI only */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">AI</span>
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isUser
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-200 text-gray-900 rounded-bl-none"
        }`}
      >
        <p className="text-sm break-words">{message.content}</p>
        <span
          className={`text-xs mt-1 block ${
            isUser ? "text-blue-100" : "text-gray-600"
          }`}
        >
          {message.timestamp.toLocaleTimeString("ja-JP", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {/* Avatar - User only */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">U</span>
        </div>
      )}
    </div>
  );
}
