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
      }>;
      role: string;
    };
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

  const apiModel = process.env.GEMINI_API_MODEL || "gemini-3.6-flash";
  const apiVersion = process.env.GEMINI_API_VERSION || "v1beta";
  const timeoutMs = Number.parseInt(
    process.env.GEMINI_API_TIMEOUT || "30000",
    10
  );

  const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${apiModel}:generateContent`;

  const requestBody = {
    contents: messages.map(
      (message): GeminiMessage => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }],
      })
    ),
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
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

  let response: Response | undefined;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(requestBody),
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

  const data = (await response.json()) as GeminiResponse;

  const text = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text)
    .filter(Boolean)
    .join("");

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
