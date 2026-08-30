/**
 * Chat API Route
 * Handles POST requests for chat messages
 */

import { NextRequest, NextResponse } from "next/server";
import { callGeminiAPI } from "@/lib/gemini";
import type { ChatHistoryMessage } from "@/types/chat";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const maxHistoryLength = 50;

function isChatHistoryMessage(value: unknown): value is ChatHistoryMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const message = value as Partial<ChatHistoryMessage>;
  return (
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string" &&
    message.content.trim().length > 0 &&
    message.content.length <= 10000
  );
}

export async function POST(request: NextRequest) {
  const clientId =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous";
  const rateLimit = checkRateLimit(clientId);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "リクエストが多すぎます。少し待ってからもう一度お試しください。" },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      }
    );
  }

  try {
    // Validate API key is set
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "AIサービスのAPIキーが設定されていません。管理者にお問い合わせください。" },
        { status: 503 }
      );
    }

    // Parse request body
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "リクエストの形式が正しくありません。" },
        { status: 400 }
      );
    }
    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Conversation history is required" },
        { status: 400 }
      );
    }

    if (
      messages.length > maxHistoryLength ||
      !messages.every(isChatHistoryMessage) ||
      messages.at(-1)?.role !== "user"
    ) {
      return NextResponse.json(
        { error: "Conversation history is invalid" },
        { status: 400 }
      );
    }

    const response = await callGeminiAPI(messages);

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.error("Chat API error:", error);

    if (error instanceof DOMException && error.name === "TimeoutError") {
      return NextResponse.json(
        { error: "AIサービスからの応答がタイムアウトしました。もう一度お試しください。" },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: "AIサービスとの通信に失敗しました。しばらくしてからもう一度お試しください。" },
      { status: 502 }
    );
  }
}
