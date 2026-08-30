/**
 * Chat API Route
 * Handles POST requests for chat messages
 */

import { NextRequest, NextResponse } from "next/server";
import { callGeminiAPI } from "@/lib/gemini";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // Validate API key is set
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "AIサービスのAPIキーが設定されていません。管理者にお問い合わせください。" },
        { status: 503 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { message } = body;

    // Validate message
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 }
      );
    }

    // Call Gemini API
    const response = await callGeminiAPI(trimmedMessage);

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
