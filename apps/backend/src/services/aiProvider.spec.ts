import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { generateCompanionReply, getAIProviderStatus } from "./aiProvider.js";

describe("aiProvider", () => {
  it("reports the selected provider status", () => {
    const status = getAIProviderStatus();

    assert.match(status.provider, /^(local|gemini|openai|openrouter)$/);
    assert.equal(typeof status.model, "string");
    assert.equal(typeof status.configured, "boolean");
  });

  it("generates a reply or local fallback reply", async () => {
    const reply = await generateCompanionReply({
      systemPrompt: "You are Saathy.",
      userMessage: "I feel anxious today",
    });

    assert.match(reply, /anxiety|slow|breath/i);
  });
});
