/**
 * Type definitions for chat application
 */

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export type ChatHistoryMessage = Pick<Message, "role" | "content">;

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
