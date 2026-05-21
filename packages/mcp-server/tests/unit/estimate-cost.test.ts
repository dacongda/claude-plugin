import { describe, expect, it } from "vitest";
import { buildRecommendation, estimateCredits } from "../../src/tools/estimate-cost.js";

describe("estimateCredits", () => {
  it("parse = pages × 2", () => {
    expect(estimateCredits("parse", 15)).toBe(30);
  });
  it("parse_translate = pages × 3", () => {
    expect(estimateCredits("parse_translate", 15)).toBe(45);
  });
  it("translate = pages × 2", () => {
    expect(estimateCredits("translate", 8)).toBe(16);
  });
  it("convert = 1 regardless of pages", () => {
    expect(estimateCredits("convert", 999)).toBe(1);
  });
});

describe("buildRecommendation", () => {
  it("reports sufficiency when no shortfall", () => {
    expect(buildRecommendation(0)).toBe("Sufficient");
  });
  it("includes the top-up URL and shortfall when short", () => {
    const rec = buildRecommendation(195);
    expect(rec).toContain("subscription");
    expect(rec).toContain("195");
  });
});
