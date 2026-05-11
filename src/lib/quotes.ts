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
  const currentVisibleIndex = visible.findIndex((q) => q.id === currentQuoteId);

  if (currentVisibleIndex >= 0) {
    return visible[(currentVisibleIndex + 1) % visible.length] ?? quotes[0];
  }

  // Current quote is hidden — advance to the first visible quote that comes after it
  // in the original order, wrapping around if needed.
  const originalIndex = quotes.findIndex((q) => q.id === currentQuoteId);
  const visibleSet = new Set(visible.map((q) => q.id));
  for (let i = originalIndex + 1; i < quotes.length; i++) {
    if (visibleSet.has(quotes[i].id)) return quotes[i];
  }
  for (let i = 0; i < originalIndex; i++) {
    if (visibleSet.has(quotes[i].id)) return quotes[i];
  }
  return visible[0] ?? quotes[0];
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
