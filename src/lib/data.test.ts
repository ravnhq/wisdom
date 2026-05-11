import { describe, expect, it } from "vitest";
import { quotes, wallpapers } from "./data";

describe("bundled data", () => {
  it("loads valid quotes", () => {
    expect(quotes.length).toBeGreaterThan(0);
    expect(quotes[0].explanation).toBeTruthy();
  });

  it("loads valid wallpapers", () => {
    expect(wallpapers.length).toBeGreaterThan(0);
    expect(wallpapers[0].fileName).toMatch(/\.svg$/);
  });
});
