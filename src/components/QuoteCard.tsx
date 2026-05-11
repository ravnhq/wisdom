import { HelpCircle } from "lucide-react";
import { useState } from "react";
import type { QuoteRecord } from "../lib/types";
import { Button } from "./Button";

type QuoteCardProps = {
  quote: QuoteRecord;
  showInFuture: boolean;
  onNext: () => void;
  onShowInFutureChange: (value: boolean) => void;
  compact?: boolean;
};

export function QuoteCard({
  quote,
  showInFuture,
  onNext,
  onShowInFutureChange,
  compact = false,
}: QuoteCardProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <section
      aria-label="Inspirational phrase"
      className={`rounded-3xl border border-white/25 bg-white/85 p-6 text-slate-950 shadow-2xl backdrop-blur-xl ${
        compact ? "max-w-5xl" : "max-w-3xl"
      }`}
    >
      <div className="border-l-4 border-amber-700 pl-5">
        <p className={`${compact ? "text-xl" : "text-3xl"} font-semibold leading-tight`}>
          {quote.text}
        </p>
        <p className="mt-4 text-lg font-medium text-slate-600">{quote.author}</p>
      </div>

      {showExplanation ? (
        <p className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-slate-700">
          {quote.explanation}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button onClick={onNext}>Next quote &gt;</Button>
        <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-700">
          <input
            checked={showInFuture}
            className="h-5 w-5 accent-amber-700"
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
