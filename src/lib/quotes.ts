import { DEFAULT_QUOTE_ID } from "./constants";
import type { QuoteRecord } from "./types";

export function getVisibleQuotes(quotes: QuoteRecord[], hiddenQuoteIds: string[]): QuoteRecord[] {
  const hidden = new Set(hiddenQuoteIds);
  const visible = quotes.filter((quote) => quote.defaultVisible && !hidden.has(quote.id));
  return visible.length > 0 ? visible : quotes.filter((quote) => quote.defaultVisible);
}

export function selectQuote(
  quotes: QuoteRecord[],
  hiddenQuoteIds: string[],
  currentQuoteId = DEFAULT_QUOTE_ID,
): QuoteRecord {
  // Always honour the saved currentQuoteId even if the user hid it later —
  // hiding a quote only removes it from future navigation, not the current view.
  const exact = quotes.find((q) => q.id === currentQuoteId);
  if (exact) return exact;
  const visible = getVisibleQuotes(quotes, hiddenQuoteIds);
  return visible[0] ?? quotes[0];
}

export function selectNextQuote(
  quotes: QuoteRecord[],
  hiddenQuoteIds: string[],
  currentQuoteId: string,
): QuoteRecord {
  const visible = getVisibleQuotes(quotes, hiddenQuoteIds);
  // Exclude the current quote so the same one never appears twice in a row.
  const candidates = visible.filter((q) => q.id !== currentQuoteId);
  const pool = candidates.length > 0 ? candidates : visible;
  return pool[Math.floor(Math.random() * pool.length)] ?? quotes[0];
}

export function updateHiddenQuoteIds(
  hiddenQuoteIds: string[],
  quoteId: string,
  shouldShowInFuture: boolean,
): string[] {
  const hidden = new Set(hiddenQuoteIds);
  if (shouldShowInFuture) {
    hidden.delete(quoteId);
  } else {
    hidden.add(quoteId);
  }
  return Array.from(hidden);
}
