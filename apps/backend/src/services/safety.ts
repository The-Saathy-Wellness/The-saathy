export type RiskLevel = "standard" | "elevated" | "high" | "critical";

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
  /\bsuicidal\b/i,
  /\bi do not want to live\b/i,
  /\bi don't want to live\b/i,
  /\bi'?m going to hurt myself\b/i,
];

const elevatedPatterns = [
  /\bself[- ]?harm\b/i,
  /\boverdose\b/i,
  /\bhurt someone\b/i,
  /\babuse\b/i,
  /\babused\b/i,
  /\bassault\b/i,
  /\bunsafe at home\b/i,
  /\bdomestic violence\b/i,
  /\bpanic attack\b/i,
  /\bcan't breathe\b/i,
  /\bcannot breathe\b/i,
  /\boverwhelmed\b/i,
  /\bbreaking down\b/i,
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

  if (elevatedPatterns.some((pattern) => pattern.test(message))) {
    const flagType = /\babuse|abused|assault|unsafe at home|domestic violence\b/i.test(message)
      ? "abuse"
      : /\bpanic attack|can't breathe|cannot breathe|overwhelmed|breaking down\b/i.test(message)
        ? "panic"
        : "self_harm";

    return {
      riskLevel: flagType === "panic" ? "elevated" : "high",
      flagType,
      shouldEscalate: flagType !== "panic",
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
    "I'm really glad you told me. Your safety matters more than anything right now.",
    "If you might hurt yourself or feel in immediate danger, please call your local emergency number now or go to the nearest emergency room.",
    "If you're in India, you can contact Tele-MANAS at 14416 or 1-800-891-4416. KIRAN is also available at 1800-599-0019.",
    "If you can, move near another person and tell them: I need help staying safe right now.",
  ].join(" ");
}
