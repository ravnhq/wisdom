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
  const visible = getVisibleQuotes(quotes, hiddenQuoteIds);
  return visible.find((quote) => quote.id === currentQuoteId) ?? visible[0] ?? quotes[0];
}

export function selectNextQuote(
  quotes: QuoteRecord[],
  hiddenQuoteIds: string[],
  currentQuoteId: string,
): QuoteRecord {
  const visible = getVisibleQuotes(quotes, hiddenQuoteIds);
  const currentIndex = visible.findIndex((quote) => quote.id === currentQuoteId);
  const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % visible.length : 0;
  return visible[nextIndex] ?? quotes[0];
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
