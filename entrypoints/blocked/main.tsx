import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Button } from "../../src/components/Button";
import { QuoteCard } from "../../src/components/QuoteCard";
import { getBlockedSiteVariant, getHostnameFromUrl } from "../../src/lib/blocking";
import { quotes } from "../../src/lib/data";
import { selectNextQuote, selectQuote, updateHiddenQuoteIds } from "../../src/lib/quotes";
import { useSettings } from "../../src/lib/useSettings";
import "../../src/styles/global.css";

const variantStyles = {
  youtube: "bg-[#0f0f0f] text-white",
  instagram: "bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white",
  linkedin: "bg-[#0a66c2] text-white",
  generic: "bg-slate-950 text-white",
};

function BlockedApp() {
  const { state, setSettings } = useSettings();
  const params = new URLSearchParams(window.location.search);
  const blockedUrl = params.get("url") ?? "";
  const blockedHost = getHostnameFromUrl(blockedUrl);
  const variant = getBlockedSiteVariant(blockedUrl);

  const theme = state.status === "ready" ? state.data.theme : "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme !== "light");
  }, [theme]);

  if (state.status !== "ready") {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 text-white">
        Loading focus page...
      </main>
    );
  }

  const settings = state.data;
  const quote = selectQuote(quotes, settings.hiddenQuoteIds, settings.currentQuoteId);
  const showInFuture = !settings.hiddenQuoteIds.includes(quote.id);

  return (
    <main className={`min-h-screen ${variantStyles[variant]}`}>
      <div className="min-h-screen bg-black/45 p-4 sm:p-8">
        <header className="flex items-center justify-between gap-4 rounded-2xl bg-black/30 px-4 py-3 backdrop-blur">
          <p className="font-semibold">Wisdom focus mode</p>
          <Button
            onClick={() =>
              void setSettings({
                ...settings,
                focusMode: { enabled: false, updatedAt: new Date().toISOString() },
              })
            }
            variant="primary"
          >
            Disable focus mode
          </Button>
        </header>

        <section className="mx-auto mt-16 max-w-6xl rounded-3xl border border-white/10 bg-black/40 p-4 shadow-2xl backdrop-blur sm:mt-24">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-white/70">
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
