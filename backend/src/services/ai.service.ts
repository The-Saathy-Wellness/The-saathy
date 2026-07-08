import { v4 as uuid } from "uuid";
import { buildSystemPrompt } from "../ai/prompts/system.prompts";
import { createAIProvider } from "../ai/providers/provider.factory";
import { ChatMessage } from "../types";
import { chatSchema } from "../validators/ai.validators";
import { MemoryService } from "./memory.service";
import { SafetyService } from "./safety.service";

export class AIService {
  constructor(
    private readonly safety = new SafetyService(),
    private readonly memory = new MemoryService(),
    private readonly provider = createAIProvider(),
  ) {}

  async chat(input: typeof chatSchema._type & { userId?: string }) {
    const safety = this.safety.assess(input.message);
    if (!safety.allowed) {
      return {
        conversationId: input.conversationId ?? uuid(),
        message: safety.suggestedResponse,
        safety,
        memoriesCreated: [],
      };
    }

    const memories = input.anonymous ? [] : await this.memory.retrieve(input.userId);
    const messages: ChatMessage[] = [
      { role: "system", content: buildSystemPrompt(input.tone, memories) },
      { role: "user", content: input.message },
    ];

    const response = await this.provider.generate({ messages });
    const memoriesCreated = input.anonymous
      ? []
      : await this.memory.extractAndStore(input.userId, input.message, response);

    return {
      conversationId: input.conversationId ?? uuid(),
      message: response,
      safety,
      memoriesCreated,
    };
  }
}
