const CRISIS_PATTERNS = [
  /\b(kill myself|end my life|suicide|suicidal|self harm|self-harm)\b/i,
  /\b(i do not want to live|i don't want to live|want to die|hurt myself)\b/i,
  /\b(abuse|abused|assault|unsafe at home|domestic violence)\b/i,
];

export type SafetyResult = {
  riskLevel: "standard" | "elevated" | "critical";
  flagType: "none" | "self_harm" | "abuse" | "panic";
  shouldEscalate: boolean;
};

export function assessSafety(message: string): SafetyResult {
  const normalized = message.toLowerCase();

  if (CRISIS_PATTERNS.some((pattern) => pattern.test(normalized))) {
    const flagType = /\b(abuse|abused|assault|unsafe at home|domestic violence)\b/i.test(normalized)
      ? "abuse"
      : "self_harm";

    return {
      riskLevel: "critical",
      flagType,
      shouldEscalate: true,
    };
  }

  if (/\b(panic attack|can't breathe|cannot breathe|overwhelmed|breaking down)\b/i.test(normalized)) {
    return {
      riskLevel: "elevated",
      flagType: "panic",
      shouldEscalate: false,
    };
  }

  return {
    riskLevel: "standard",
    flagType: "none",
    shouldEscalate: false,
  };
}

export function crisisResponse(): string {
  return [
    "I'm really glad you told me. Your safety matters more than anything right now.",
    "If you might hurt yourself or feel in immediate danger, please call your local emergency number now or go to the nearest emergency room.",
    "If you are in India, you can also reach KIRAN at 1800-599-0019. If you can, move near another person and tell them: I need help staying safe right now.",
    "I can stay with you here, but please contact real-time human support immediately.",
  ].join(" ");
}

