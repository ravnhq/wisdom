import { describe, expect, it } from "vitest";
import { quotes } from "./data";
import { selectNextQuote, selectQuote, updateHiddenQuoteIds } from "./quotes";

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
