import { describe, expect, it } from "vitest";
import { quotes, wallpapers } from "./data";

describe("bundled data", () => {
  it("loads valid quotes", () => {
    expect(quotes.length).toBeGreaterThan(0);
    expect(quotes[0].explanation).toBeTruthy();
  });

  it("gives every quote a unique id", () => {
    const ids = quotes.map((quote) => quote.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("includes three quotes from each reading-list author", () => {
    const readingList = [
      "Irvin D. Yalom",
      "Alice Miller",
      "Viktor E. Frankl",
      "Erich Fromm",
      "Marcus Aurelius",
      "Daniel Kahneman",
      "Jonathan Haidt",
      "Robert Greene",
      "Sun Tzu",
      "M. Scott Peck",
    ];
    for (const author of readingList) {
      expect(quotes.filter((quote) => quote.author === author)).toHaveLength(3);
    }
  });

  it("loads valid wallpapers", () => {
    expect(wallpapers.length).toBeGreaterThan(0);
    expect(wallpapers[0].fileName).toMatch(/\.svg$/);
  });
});
