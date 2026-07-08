import { WellnessRepository } from "../repositories/wellness.repository";
import { journalSchema, pulseSchema } from "../validators/wellness.validators";

export class WellnessService {
  constructor(private readonly wellness = new WellnessRepository()) {}

  async createJournal(userId: string, input: typeof journalSchema._type) {
    const insights = this.buildJournalInsights(input.content, input.mood);
    return this.wellness.createJournal({ userId, ...input, insights });
  }

  async listJournals(userId: string) {
    return this.wellness.listJournals(userId);
  }

  async createPulse(userId: string, input: typeof pulseSchema._type) {
    return this.wellness.createPulse({ userId, ...input });
  }

  async pulseSummary(userId: string) {
    const pulses = await this.wellness.listPulses(userId);
    if (!pulses.length) {
      return { count: 0, averages: null, recommendation: "Start with a first daily pulse check-in." };
    }

    const average = (key: "mood" | "energy" | "stress" | "loneliness") =>
      Number((pulses.reduce((sum, pulse) => sum + pulse[key], 0) / pulses.length).toFixed(1));

    const averages = {
      mood: average("mood"),
      energy: average("energy"),
      stress: average("stress"),
      loneliness: average("loneliness"),
    };

    const recommendation =
      averages.stress >= 7 || averages.loneliness >= 7
        ? "Offer a grounding exercise and suggest talking to a listener."
        : "Keep the check-in gentle and reinforce the user's existing support habits.";

    return { count: pulses.length, averages, recommendation };
  }

  private buildJournalInsights(content: string, mood?: string) {
    const insights = [];
    if (mood) insights.push(`Mood noted as ${mood}.`);
    if (/\bgrateful|thankful|good\b/i.test(content)) {
      insights.push("Gratitude or positive reflection detected.");
    }
    if (/\bstress|anxious|overwhelmed|lonely\b/i.test(content)) {
      insights.push("Emotional distress theme detected.");
    }
    return insights.length ? insights : ["Reflection saved for future continuity."];
  }
}
