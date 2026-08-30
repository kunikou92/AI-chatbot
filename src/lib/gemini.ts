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
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
      role: string;
    };
  }>;
}

/**
 * Call Gemini API with a message
 */
export async function callGeminiAPI(userMessage: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const apiModel = process.env.GEMINI_API_MODEL || "gemini-1.5-pro";
  const apiVersion = process.env.GEMINI_API_VERSION || "v1beta";

  const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${apiModel}:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: userMessage,
          },
        ],
      },
    ],
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

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error:", response.status, errorData);
      throw new Error(
        `Gemini API error: ${response.status} - ${errorData}`
      );
    }

    const data = (await response.json()) as GeminiResponse;

    // Extract the response text
    const firstCandidate = data.candidates?.[0];
    if (!firstCandidate || !firstCandidate.content?.parts?.[0]?.text) {
      throw new Error("Invalid response from Gemini API");
    }

    return firstCandidate.content.parts[0].text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}
