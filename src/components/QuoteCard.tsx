import { HelpCircle } from "lucide-react";
import { type CSSProperties, Fragment, useState } from "react";
import { keyedPhrases } from "../lib/phrases";
import type { QuoteRecord } from "../lib/types";
import { Button } from "./Button";

type QuoteCardProps = {
  quote: QuoteRecord;
  showInFuture: boolean;
  onNext: () => void;
  onShowInFutureChange: (value: boolean) => void;
  compact?: boolean;
};

function quoteSize(text: string) {
  if (text.length <= 90) return "text-[1.75rem] leading-[1.4] sm:text-[2.125rem]";
  if (text.length <= 140) return "text-[1.5rem] leading-[1.45] sm:text-[1.625rem]";
  return "text-[1.25rem] leading-[1.5] sm:text-[1.3125rem]";
}

export function QuoteCard({
  quote,
  showInFuture,
  onNext,
  onShowInFutureChange,
  compact = false,
}: QuoteCardProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [firstQuoteId] = useState(quote.id);
  const [animate, setAnimate] = useState(false);
  if (!animate && quote.id !== firstQuoteId) setAnimate(true);

  return (
    <section
      aria-label="Inspirational phrase"
      className={`w-full rounded-3xl border border-line bg-surface/95 p-7 text-ink shadow-2xl backdrop-blur-xl sm:px-10 sm:py-7 ${
        compact ? "max-w-5xl" : "max-w-3xl"
      }`}
    >
      <figure className={animate ? "quote-enter" : undefined} key={quote.id}>
        <span aria-hidden="true" className="block font-reading text-6xl leading-none text-accent">
          &ldquo;
        </span>
        <blockquote
          className={`-mt-3 font-reading ${compact ? "text-xl leading-8" : quoteSize(quote.text)}`}
        >
          {keyedPhrases(quote.text).map((phrase, order) => (
            <Fragment key={phrase.key}>
              {phrase.key > 0 ? " " : null}
              <span
                className={`inline-block text-pretty ${animate ? "quote-phrase" : ""}`}
                style={{ "--i": order } as CSSProperties}
              >
                {phrase.text}
              </span>
            </Fragment>
          ))}
        </blockquote>
        <figcaption className="mt-5 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-ink-muted">
          <span aria-hidden="true" className="h-px w-8 bg-accent" />
          {quote.author}
        </figcaption>
      </figure>

      <div
        aria-hidden={!showExplanation}
        className="explanation"
        data-open={showExplanation}
        inert={!showExplanation}
      >
        <div className="overflow-hidden">
          <p className="mt-5 rounded-2xl bg-surface-muted px-5 py-4 font-reading text-[1.0625rem] leading-7 text-ink text-pretty">
            {quote.explanation}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-line pt-4">
        <Button onClick={onNext}>Next quote &gt;</Button>
        <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-ink-muted">
          <input
            checked={showInFuture}
            className="h-5 w-5 shrink-0 accent-accent"
            onChange={(event) => onShowInFutureChange(event.target.checked)}
            type="checkbox"
          />
          Show this quote in future
        </label>
        <Button
          aria-expanded={showExplanation}
          aria-label="Show phrase explanation"
          className="ml-auto flex items-center gap-2"
          onClick={() => setShowExplanation((value) => !value)}
        >
          <HelpCircle aria-hidden="true" size={18} />
          Explanation
        </Button>
      </div>
    </section>
  );
}
