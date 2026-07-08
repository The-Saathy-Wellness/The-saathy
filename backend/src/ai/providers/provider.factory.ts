import { env } from "../../config/env";
import { AIProvider } from "./base.provider";
import { MockProvider } from "./mock.provider";
import { OpenAICompatibleProvider } from "./openai-compatible.provider";

export const createAIProvider = (): AIProvider => {
  if (env.AI_PROVIDER === "openrouter") {
    return new OpenAICompatibleProvider({
      apiKey: env.OPENROUTER_API_KEY,
      baseUrl: env.OPENROUTER_BASE_URL,
      model: env.OPENROUTER_MODEL,
      appName: "Saathy",
    });
  }

  if (env.AI_PROVIDER === "openai") {
    return new OpenAICompatibleProvider({
      apiKey: env.OPENAI_API_KEY,
      baseUrl: "https://api.openai.com/v1",
      model: env.OPENAI_MODEL,
    });
  }

  return new MockProvider();
};
