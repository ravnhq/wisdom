import { describe, expect, it } from "vitest";
import { quotes } from "./data";
import { selectNextQuote, selectQuote, updateHiddenQuoteIds } from "./quotes";

describe("quote selection", () => {
  it("selects current visible quote", () => {
    expect(selectQuote(quotes, [], quotes[1].id).id).toBe(quotes[1].id);
  });

  it("moves to the next visible quote", () => {
    expect(selectNextQuote(quotes, [], quotes[0].id).id).toBe(quotes[1].id);
  });

  it("keeps showing current quote even after it is hidden (visibility only affects future navigation)", () => {
    const hidden = updateHiddenQuoteIds([], quotes[0].id, false);
    expect(hidden).toContain(quotes[0].id);
    // selectQuote must not jump away — the view stays stable; hiding only removes it from next-quote rotation
    expect(selectQuote(quotes, hidden, quotes[0].id).id).toBe(quotes[0].id);
  });

  it("selectNextQuote skips hidden quotes", () => {
    const hidden = updateHiddenQuoteIds([], quotes[1].id, false);
    // From quotes[0], the next visible quote should be quotes[2] (quotes[1] is hidden)
    expect(selectNextQuote(quotes, hidden, quotes[0].id).id).toBe(quotes[2].id);
  });

  it("selectNextQuote advances past a hidden current quote by position", () => {
    const hidden = updateHiddenQuoteIds([], quotes[1].id, false);
    // If current quote is itself hidden, next should be the closest visible quote after it
    expect(selectNextQuote(quotes, hidden, quotes[1].id).id).toBe(quotes[2].id);
  });
});
