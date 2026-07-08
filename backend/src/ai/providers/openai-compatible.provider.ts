import { AppError } from "../../exceptions/AppError";
import { ChatMessage } from "../../types";
import { AIProvider, GenerateResponseInput } from "./base.provider";

type OpenAICompatibleConfig = {
  apiKey?: string;
  baseUrl: string;
  model: string;
  appName?: string;
};

export class OpenAICompatibleProvider implements AIProvider {
  constructor(private readonly config: OpenAICompatibleConfig) {}

  async generate(input: GenerateResponseInput) {
    if (!this.config.apiKey) {
      throw new AppError(503, "AI_PROVIDER_NOT_CONFIGURED", "AI provider API key is missing");
    }

    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${this.config.apiKey}`,
        ...(this.config.appName ? { "x-title": this.config.appName } : {}),
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: input.messages,
        temperature: input.temperature ?? 0.7,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new AppError(response.status, "AI_PROVIDER_ERROR", "AI provider request failed", body);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: ChatMessage }>;
    };

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new AppError(502, "AI_EMPTY_RESPONSE", "AI provider returned an empty response");
    }

    return content;
  }
}
