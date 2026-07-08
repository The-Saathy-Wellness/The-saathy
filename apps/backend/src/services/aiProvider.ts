import { env } from "../config/env.js";

type GenerateArgs = {
  systemPrompt: string;
  userMessage: string;
  history?: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
};

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
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

export function getAIProviderStatus() {
  return {
    provider: env.AI_PROVIDER,
    model:
      env.AI_PROVIDER === "gemini"
        ? env.GEMINI_MODEL
        : env.AI_PROVIDER === "openai"
          ? env.OPENAI_MODEL
          : env.AI_PROVIDER === "openrouter"
            ? env.OPENROUTER_MODEL
            : "local",
    configured:
      env.AI_PROVIDER === "local" ||
      (env.AI_PROVIDER === "gemini" && Boolean(env.GEMINI_API_KEY)) ||
      (env.AI_PROVIDER === "openai" && Boolean(env.OPENAI_API_KEY)) ||
      (env.AI_PROVIDER === "openrouter" && Boolean(env.OPENROUTER_API_KEY)),
  };
}

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

function buildChatMessages({ systemPrompt, userMessage, history = [] }: GenerateArgs): ChatMessage[] {
  return [
    { role: "system", content: systemPrompt },
    ...history.filter((message) => message.role !== "system").slice(-10),
    { role: "user", content: userMessage },
  ];
}

async function generateOpenAI(args: GenerateArgs): Promise<string> {
  const { userMessage } = args;
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
      messages: buildChatMessages(args),
      temperature: args.temperature ?? 0.7,
      max_tokens: args.maxTokens ?? 450,
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

async function generateGemini(args: GenerateArgs): Promise<string> {
  const { systemPrompt, userMessage, history = [] } = args;
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
          ...history
            .filter((message) => message.role !== "system")
            .slice(-10)
            .map((message) => ({
              role: message.role === "assistant" ? "model" : "user",
              parts: [{ text: message.content }],
            })),
          {
            role: "user",
            parts: [{ text: userMessage }],
          },
        ],
        generationConfig: {
          temperature: args.temperature ?? 0.7,
          maxOutputTokens: args.maxTokens ?? 450,
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

async function generateOpenRouter(args: GenerateArgs): Promise<string> {
  const { userMessage } = args;
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
      messages: buildChatMessages(args),
      temperature: args.temperature ?? 0.7,
      max_tokens: args.maxTokens ?? 450,
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
