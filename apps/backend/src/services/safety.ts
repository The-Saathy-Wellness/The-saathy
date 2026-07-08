export type RiskLevel = "standard" | "low" | "medium" | "high" | "critical";

export type SafetyAssessment = {
  riskLevel: RiskLevel;
  flagType: "none" | "self_harm" | "suicide_intent" | "abuse" | "panic" | "harassment";
  shouldEscalate: boolean;
  categories: string[];
};

const criticalPatterns = [
  /\bkill myself\b/i,
  /\bend my life\b/i,
  /\bwant to die\b/i,
  /\bsuicide\b/i,
  /\bi'?m going to hurt myself\b/i,
];

const highPatterns = [
  /\bself[- ]?harm\b/i,
  /\boverdose\b/i,
  /\bhurt someone\b/i,
  /\babuse\b/i,
  /\bpanic attack\b/i,
];

export function assessSafety(message: string): SafetyAssessment {
  if (criticalPatterns.some((pattern) => pattern.test(message))) {
    return {
      riskLevel: "critical",
      flagType: "suicide_intent",
      shouldEscalate: true,
      categories: ["self_harm", "crisis"],
    };
  }

  if (highPatterns.some((pattern) => pattern.test(message))) {
    const flagType = /\babuse\b/i.test(message)
      ? "abuse"
      : /\bpanic attack\b/i.test(message)
        ? "panic"
        : "self_harm";

    return {
      riskLevel: "high",
      flagType,
      shouldEscalate: flagType === "self_harm",
      categories: ["elevated_distress"],
    };
  }

  return {
    riskLevel: "standard",
    flagType: "none",
    shouldEscalate: false,
    categories: [],
  };
}

export function crisisResponse(): string {
  return [
    "I'm really sorry you're feeling this much pain. Your safety matters right now.",
    "If you might act on these thoughts, please call local emergency services immediately or reach out to someone trusted nearby.",
    "If you're in India, you can contact Tele-MANAS at 14416 or 1-800-891-4416.",
    "Can you move closer to another person or a safer place while we take this one moment at a time?",
  ].join(" ");
}
