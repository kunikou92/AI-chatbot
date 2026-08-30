/**
 * Gemini API utility functions
 */

export interface GeminiMessage {
  role: "user" | "model";
  parts: Array<{
    text: string;
  }>;
}

export interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string;
        thought?: boolean;
      }>;
      role: string;
    };
    finishReason?: string;
    finishMessage?: string;
  }>;
  promptFeedback?: {
    blockReason?: string;
  };
}

interface GeminiErrorResponse {
  error?: {
    message?: string;
    status?: string;
  };
}

/**
 * Call Gemini API with conversation history
 */
export async function callGeminiAPI(
  messages: Array<{ role: "user" | "assistant"; content: string }>
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  const configuredApiKey = apiKey;

  const apiModel = process.env.GEMINI_API_MODEL || "gemini-3.6-flash";
  const apiVersion = process.env.GEMINI_API_VERSION || "v1beta";
  const timeoutMs = Number.parseInt(
    process.env.GEMINI_API_TIMEOUT || "30000",
    10
  );

  const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${apiModel}:generateContent`;

  const baseRequestBody = {
    systemInstruction: {
      parts: [
        {
          text: [
            "あなたは親切な日本語のチャットアシスタントです。",
            "ユーザーが別の言語を指定しない限り、自然で分かりやすい日本語で答えてください。",
            "文を途中で終わらせず、質問に対する回答を最後まで完成させてください。",
            "必要十分な長さで簡潔に答え、英語の見出しから始めないでください。",
            "コードなどで必要な場合を除き、Markdown記号を使わずプレーンテキストで答えてください。",
            "金額や制度など変動する情報は断定せず、目安であることを明記してください。",
          ].join("\n"),
        },
      ],
    },
    contents: messages.map(
      (message): GeminiMessage => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }],
      })
    ),
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
    ],
  };

  async function generate(maxOutputTokens: number): Promise<GeminiResponse> {
    let response: Response | undefined;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": configuredApiKey,
        },
        body: JSON.stringify({
          ...baseRequestBody,
          generationConfig: {
            maxOutputTokens,
            thinkingConfig: { thinkingLevel: "minimal" },
          },
        }),
        signal: AbortSignal.timeout(
          Number.isFinite(timeoutMs) ? timeoutMs : 30000
        ),
      });

      if (![429, 503].includes(response.status) || attempt === 2) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt));
    }

    if (!response) {
      throw new Error("Gemini API request could not be started");
    }

    if (!response.ok) {
      const errorData = (await response
        .json()
        .catch(() => ({}))) as GeminiErrorResponse;
      const detail = errorData.error?.message || response.statusText;
      console.error("Gemini API error:", response.status, detail);
      throw new Error(`Gemini API request failed (${response.status}): ${detail}`);
    }

    return (await response.json()) as GeminiResponse;
  }

  let data = await generate(8192);
  if (data.candidates?.[0]?.finishReason === "MAX_TOKENS") {
    console.warn("Gemini response reached the token limit; retrying once.");
    data = await generate(16384);
  }

  const candidate = data.candidates?.[0];

  if (candidate?.finishReason && candidate.finishReason !== "STOP") {
    console.error(
      "Gemini stopped unexpectedly:",
      candidate.finishReason,
      candidate.finishMessage || ""
    );
    throw new Error(`Gemini response stopped: ${candidate.finishReason}`);
  }

  const text = candidate?.content?.parts
    ?.filter((part) => !part.thought)
    .map((part) => part.text)
    .filter(Boolean)
    .join("")
    .trim();

  if (!text) {
    const reason = data.promptFeedback?.blockReason;
    throw new Error(
      reason
        ? `Gemini blocked the request: ${reason}`
        : "Gemini returned an empty response"
    );
  }

  return text;
}
