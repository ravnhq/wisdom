import { createRoot } from "react-dom/client";
import { QuoteCard } from "../../src/components/QuoteCard";
import { getHostnameFromUrl } from "../../src/lib/blocking";
import { quotes } from "../../src/lib/data";
import { selectNextQuote, selectQuote, updateHiddenQuoteIds } from "../../src/lib/quotes";
import { useAppearance } from "../../src/lib/useAppearance";
import { useDailyQuote } from "../../src/lib/useDailyQuote";
import { useSettings } from "../../src/lib/useSettings";
import { useToday } from "../../src/lib/useToday";
import "../../src/styles/global.css";

function BlockedApp() {
  const { state, setSettings } = useSettings();
  const params = new URLSearchParams(window.location.search);
  const blockedUrl = params.get("url") ?? "";
  const blockedHost = getHostnameFromUrl(blockedUrl);

  const today = useToday();
  useAppearance(state.status === "ready" ? state.data : null);
  useDailyQuote(state.status === "ready" ? state.data : null, setSettings, today);

  if (state.status !== "ready") {
    return (
      <main className="grid min-h-screen place-items-center bg-page text-ink">
        Loading focus page...
      </main>
    );
  }

  const settings = state.data;
  const quote = selectQuote(quotes, settings.hiddenQuoteIds, settings.currentQuoteId);
  const showInFuture = !settings.hiddenQuoteIds.includes(quote.id);

  return (
    <main className="blocked-page min-h-screen bg-page text-ink">
      <div className="min-h-screen p-4 sm:p-8">
        <header className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface/70 px-4 py-3 backdrop-blur">
          <p className="font-semibold">Wisdom focus mode</p>
        </header>

        <section className="mx-auto mt-16 max-w-6xl rounded-3xl border border-line bg-surface-muted/60 p-4 shadow-2xl backdrop-blur sm:mt-24">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-accent">
            {blockedHost ? `Blocked: ${blockedHost}` : "Blocked site"}
          </p>
          <QuoteCard
            compact
            onNext={() => {
              const nextQuote = selectNextQuote(quotes, settings.hiddenQuoteIds, quote.id);
              void setSettings({ ...settings, currentQuoteId: nextQuote.id });
            }}
            onShowInFutureChange={(value) =>
              void setSettings({
                ...settings,
                hiddenQuoteIds: updateHiddenQuoteIds(settings.hiddenQuoteIds, quote.id, value),
              })
            }
            quote={quote}
            showInFuture={showInFuture}
          />
        </section>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(<BlockedApp />);
