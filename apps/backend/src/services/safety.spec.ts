import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assessSafety, crisisResponse } from "./safety.js";

describe("assessSafety", () => {
  it("marks ordinary support messages as standard", () => {
    const result = assessSafety("I feel nervous before my interview");

    assert.equal(result.riskLevel, "standard");
    assert.equal(result.shouldEscalate, false);
    assert.equal(result.flagType, "none");
  });

  it("escalates suicide intent", () => {
    const result = assessSafety("I want to die tonight");

    assert.equal(result.riskLevel, "critical");
    assert.equal(result.shouldEscalate, true);
    assert.equal(result.flagType, "suicide_intent");
  });

  it("returns India crisis resources", () => {
    const response = crisisResponse();

    assert.match(response, /Tele-MANAS/);
    assert.match(response, /14416/);
  });
});
