import { env } from "../config/env.js";

type GenerateArgs = {
  systemPrompt: string;
  userMessage: string;
};

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

function localCompanionReply(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes("anxious") || lower.includes("anxiety")) {
    return "I hear the anxiety in this. Let's slow it down together: take one steady breath, then tell me what thought is looping the loudest right now.";
  }

  if (lower.includes("vent") || lower.includes("angry") || lower.includes("frustrated")) {
    return "You can let it out here. I won't judge or rush you. What happened, and what part of it felt the most unfair or heavy?";
  }

  if (lower.includes("calm") || lower.includes("sleep")) {
    return "Let's make the next minute softer. Unclench your jaw, drop your shoulders, and name three things you can see. I'm here with you.";
  }

  return "Thank you for trusting me with that. I'm here with you. What feels most important for me to understand about this moment?";
}

async function generateOpenAI({ systemPrompt, userMessage }: GenerateArgs): Promise<string> {
  if (!env.OPENAI_API_KEY) {
    return localCompanionReply(userMessage);
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 450,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("OpenAI generation failed:", response.status, body);
    return localCompanionReply(userMessage);
  }

  const json = (await response.json()) as ChatCompletionResponse;
  return json.choices?.[0]?.message?.content?.trim() || localCompanionReply(userMessage);
}

async function generateGemini({ systemPrompt, userMessage }: GenerateArgs): Promise<string> {
  if (!env.GEMINI_API_KEY) {
    return localCompanionReply(userMessage);
  }

  const modelName = env.GEMINI_MODEL.startsWith("models/")
    ? env.GEMINI_MODEL
    : `models/${env.GEMINI_MODEL}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 450,
        },
      }),
    }
  );

  if (!response.ok) {
    const body = await response.text();
    console.error("Gemini generation failed:", response.status, body);
    return localCompanionReply(userMessage);
  }

  const json = (await response.json()) as GeminiGenerateContentResponse;
  const text = json.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  return text || localCompanionReply(userMessage);
}

async function generateOpenRouter({ systemPrompt, userMessage }: GenerateArgs): Promise<string> {
  if (!env.OPENROUTER_API_KEY) {
    return localCompanionReply(userMessage);
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": "http://localhost:5173",
      "X-Title": "Saathy",
    },
    body: JSON.stringify({
      model: env.OPENROUTER_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 450,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("OpenRouter generation failed:", response.status, body);
    return localCompanionReply(userMessage);
  }

  const json = (await response.json()) as ChatCompletionResponse;
  return json.choices?.[0]?.message?.content?.trim() || localCompanionReply(userMessage);
}

export async function generateCompanionReply(args: GenerateArgs): Promise<string> {
  if (env.AI_PROVIDER === "gemini") {
    return generateGemini(args);
  }

  if (env.AI_PROVIDER === "openai") {
    return generateOpenAI(args);
  }

  if (env.AI_PROVIDER === "openrouter") {
    return generateOpenRouter(args);
  }

  return localCompanionReply(args.userMessage);
}
