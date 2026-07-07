import { describe, it, expect } from "vitest";
import { getInitials } from "@/utils/getInitials";

/**
 * getInitials drives every Avatar fallback. It's pure and branchy (trimming,
 * whitespace collapsing, 2-initial cap, casing), so it's cheap to test and a
 * regression here would silently render wrong avatars everywhere.
 */
describe("getInitials", () => {
  it("takes the first letter of the first two words, uppercased", () => {
    expect(getInitials("Hassan Zidan")).toBe("HZ");
  });

  it("handles a single name", () => {
    expect(getInitials("hassan")).toBe("H");
  });

  it("collapses extra whitespace and ignores words past the second", () => {
    expect(getInitials("  ali   hassan   mohamed ")).toBe("AH");
  });

  it("returns an empty string for empty/whitespace input", () => {
    expect(getInitials("")).toBe("");
    expect(getInitials("   ")).toBe("");
  });
});
