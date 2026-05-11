import { describe, expect, it } from "vitest";
import {
  getBlockedSiteVariant,
  isBlockedUrl,
  normalizeBlockedDomains,
  normalizeDomain,
} from "./blocking";

describe("blocking utilities", () => {
  it("normalizes domains", () => {
    expect(normalizeDomain("https://www.YouTube.com/watch?v=1")).toBe("youtube.com");
    expect(normalizeBlockedDomains(["www.reddit.com", "reddit.com"])).toEqual(["reddit.com"]);
  });

  it("matches exact domains and subdomains", () => {
    expect(isBlockedUrl("https://youtube.com/watch", ["youtube.com"])).toBe(true);
    expect(isBlockedUrl("https://m.youtube.com/watch", ["youtube.com"])).toBe(true);
    expect(isBlockedUrl("https://notyoutube.com", ["youtube.com"])).toBe(false);
  });

  it("detects site variants", () => {
    expect(getBlockedSiteVariant("https://www.linkedin.com/feed/")).toBe("linkedin");
    expect(getBlockedSiteVariant("https://example.com/")).toBe("generic");
  });
});
