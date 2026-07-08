import { SafetyResult } from "../types";

const criticalPatterns = [
  /\bkill myself\b/i,
  /\bend my life\b/i,
  /\bsuicide\b/i,
  /\bwant to die\b/i,
  /\bself[- ]?harm\b/i,
];

const highPatterns = [/\bhurt someone\b/i, /\bpanic attack\b/i, /\babuse\b/i, /\boverdose\b/i];

export class SafetyService {
  assess(text: string): SafetyResult {
    if (criticalPatterns.some((pattern) => pattern.test(text))) {
      return {
        allowed: false,
        riskLevel: "critical",
        categories: ["self_harm"],
        suggestedResponse:
          "I'm really sorry you're feeling this much pain. If you might act on these thoughts, please call local emergency services now or reach out to someone trusted nearby. If you're in India, you can contact Tele-MANAS at 14416 or 1-800-891-4416. You do not have to be alone with this moment.",
      };
    }

    if (highPatterns.some((pattern) => pattern.test(text))) {
      return {
        allowed: true,
        riskLevel: "high",
        categories: ["elevated_distress"],
      };
    }

    return { allowed: true, riskLevel: "low", categories: [] };
  }
}
