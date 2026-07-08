import { MemoryRepository } from "../repositories/memory.repository";

export class MemoryService {
  constructor(private readonly memories = new MemoryRepository()) {}

  async retrieve(userId?: string) {
    if (!userId) return [];
    return this.memories.listImportant(userId, 8);
  }

  async extractAndStore(userId: string | undefined, userMessage: string, assistantMessage: string) {
    if (!userId) return [];

    const candidates: Array<{ kind: "preference" | "emotional_pattern" | "important_event" | "follow_up"; content: string; importance: number }> = [];

    if (/\b(always|usually|often|every day|daily)\b/i.test(userMessage)) {
      candidates.push({
        kind: "emotional_pattern",
        content: userMessage.slice(0, 240),
        importance: 7,
      });
    }

    if (/\bremember\b|\bimportant\b|\bmy family\b|\bmy work\b|\bmy exams\b/i.test(userMessage)) {
      candidates.push({
        kind: "important_event",
        content: userMessage.slice(0, 240),
        importance: 8,
      });
    }

    if (/\bcall me\b|\bi prefer\b|\bi like\b|\bi don't like\b/i.test(userMessage)) {
      candidates.push({
        kind: "preference",
        content: userMessage.slice(0, 240),
        importance: 6,
      });
    }

    if (/follow up|tomorrow|next week|remind/i.test(`${userMessage} ${assistantMessage}`)) {
      candidates.push({
        kind: "follow_up",
        content: `Follow up on: ${userMessage.slice(0, 200)}`,
        importance: 6,
      });
    }

    return Promise.all(candidates.map((candidate) => this.memories.create({ userId, ...candidate })));
  }
}
