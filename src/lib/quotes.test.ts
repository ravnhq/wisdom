import { describe, expect, it } from "vitest";
import { quotes } from "./data";
import { quoteForDay, selectNextQuote, selectQuote, updateHiddenQuoteIds } from "./quotes";
import type { QuoteRecord } from "./types";

describe("quote selection", () => {
  it("selects current visible quote", () => {
    expect(selectQuote(quotes, [], quotes[1].id).id).toBe(quotes[1].id);
  });

  it("moves to a different visible quote", () => {
    expect(selectNextQuote(quotes, [], quotes[0].id).id).not.toBe(quotes[0].id);
  });

  it("keeps showing current quote even after it is hidden (visibility only affects future navigation)", () => {
    const hidden = updateHiddenQuoteIds([], quotes[0].id, false);
    expect(hidden).toContain(quotes[0].id);
    // selectQuote must not jump away — the view stays stable; hiding only removes it from next-quote rotation
    expect(selectQuote(quotes, hidden, quotes[0].id).id).toBe(quotes[0].id);
  });

  it("selectNextQuote never returns the current quote when alternatives exist", () => {
    const next = selectNextQuote(quotes, [], quotes[0].id);
    expect(next.id).not.toBe(quotes[0].id);
  });

  it("selectNextQuote only returns visible quotes", () => {
    const hidden = updateHiddenQuoteIds([], quotes[1].id, false);
    const results = Array.from({ length: 20 }, () => selectNextQuote(quotes, hidden, quotes[0].id));
    expect(results.every((q) => q.id !== quotes[1].id)).toBe(true);
  });

  it("selectNextQuote returns a valid quote even when current is hidden", () => {
    const hidden = updateHiddenQuoteIds([], quotes[1].id, false);
    const next = selectNextQuote(quotes, hidden, quotes[1].id);
    expect(next.id).not.toBe(quotes[1].id);
  });
});

describe("quoteForDay", () => {
  const pool: QuoteRecord[] = [
    { id: "a", text: "A", author: "X", explanation: "", tags: [], defaultVisible: true },
    { id: "b", text: "B", author: "X", explanation: "", tags: [], defaultVisible: true },
  ];
  const base = { currentQuoteId: "a", hiddenQuoteIds: [] as string[], quoteDay: "2026-10-16" };

  it("keeps today's quote", () => {
    expect(quoteForDay(base, pool, "2026-10-16", { skipHidden: true })).toBeNull();
  });

  it("moves to a different quote on a new day", () => {
    expect(quoteForDay(base, pool, "2026-10-17", { skipHidden: false })).toEqual({
      currentQuoteId: "b",
      quoteDay: "2026-10-17",
    });
  });

  it("skips a hidden quote on open, but not while the user is looking at it", () => {
    const hidden = { ...base, hiddenQuoteIds: ["a"] };
    expect(quoteForDay(hidden, pool, "2026-10-16", { skipHidden: true })?.currentQuoteId).toBe("b");
    expect(quoteForDay(hidden, pool, "2026-10-16", { skipHidden: false })).toBeNull();
  });
});
