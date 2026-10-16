import { describe, expect, it } from "vitest";
import { quotes } from "./data";
import { splitPhrases } from "./phrases";

describe("splitPhrases", () => {
  it("breaks after sentences and clauses", () => {
    expect(
      splitPhrases("Life is difficult. This is a great truth, one of the greatest truths."),
    ).toEqual(["Life is difficult.", "This is a great truth,", "one of the greatest truths."]);
  });

  it("keeps closing quote marks with their phrase", () => {
    expect(splitPhrases('By saying, "It\'s not my problem." … I can solve it.')).toEqual([
      "By saying,",
      '"It\'s not my problem."',
      "…",
      "I can solve it.",
    ]);
  });

  it("never loses or reorders words in any quote", () => {
    for (const quote of quotes) {
      expect(splitPhrases(quote.text).join(" ")).toBe(quote.text.replace(/\s+/g, " "));
    }
  });
});
