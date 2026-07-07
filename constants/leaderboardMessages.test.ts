import { describe, it, expect } from "vitest";
import {
  getPerformanceTier,
  pickCoachMessage,
  LEADERBOARD_MESSAGES,
} from "@/constants/leaderboardMessages";

/**
 * This module has the only real branching logic among the constants: bucketing a
 * score into a tier, and a deterministic message pick with Arabic-Indic digit
 * substitution. Determinism matters (the message must not change across
 * re-renders), so it's worth pinning the boundaries and the {p} interpolation.
 */
describe("getPerformanceTier", () => {
  it.each([
    [100, "high"],
    [66, "high"], // lower boundary of "high"
    [65, "average"],
    [35, "average"], // lower boundary of "average"
    [34, "below"],
    [0, "below"],
  ])("maps %i%% -> %s", (progress, tier) => {
    expect(getPerformanceTier(progress)).toBe(tier);
  });
});

describe("pickCoachMessage", () => {
  it("is deterministic for a given progress value", () => {
    expect(pickCoachMessage(68)).toBe(pickCoachMessage(68));
  });

  it("returns a real message from the matching tier", () => {
    expect(LEADERBOARD_MESSAGES.high).toContain(
      // strip the interpolated percentile before comparing to the template
      pickCoachMessage(68).replace(/[٠-٩]+/, "{p}"),
    );
  });

  it("interpolates the percentile as Arabic-Indic digits", () => {
    // 68 -> ٦٨, and 68 % 4 === 0 selects the template that contains {p}.
    expect(pickCoachMessage(68)).toContain("٦٨");
  });
});
