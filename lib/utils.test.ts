import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

/**
 * `cn` is used in nearly every component to compose class names. The value it
 * adds over plain string concat is Tailwind conflict resolution, so that's what
 * we pin down — plus the falsy-filtering that conditional classes rely on.
 */
describe("cn", () => {
  it("merges class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("drops falsy values so conditional classes are safe", () => {
    expect(cn("a", false && "b", null, undefined, "c")).toBe("a c");
  });

  it("resolves conflicting Tailwind utilities (last wins)", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("supports conditional object syntax", () => {
    expect(cn("base", { active: true, hidden: false })).toBe("base active");
  });
});
