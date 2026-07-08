import { ChatMessage } from "../../types";

export type GenerateResponseInput = {
  messages: ChatMessage[];
  temperature?: number;
};

export interface AIProvider {
  generate(input: GenerateResponseInput): Promise<string>;
}
