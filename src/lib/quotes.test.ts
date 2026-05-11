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

  it("honors hidden quote preferences", () => {
    const hidden = updateHiddenQuoteIds([], quotes[0].id, false);
    expect(hidden).toContain(quotes[0].id);
    expect(selectQuote(quotes, hidden, quotes[0].id).id).not.toBe(quotes[0].id);
  });
});
