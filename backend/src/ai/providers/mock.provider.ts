import { AIProvider, GenerateResponseInput } from "./base.provider";

export class MockProvider implements AIProvider {
  async generate(input: GenerateResponseInput) {
    const lastUserMessage =
      [...input.messages].reverse().find((message) => message.role === "user")?.content ?? "";

    return [
      "I hear you. Thank you for trusting me with that.",
      "From what you shared, it sounds like this has been weighing on you.",
      `You said: "${lastUserMessage.slice(0, 160)}"`,
      "Can we slow it down together and name the part that feels heaviest right now?",
    ].join(" ");
  }
}
