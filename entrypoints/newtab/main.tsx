import { Settings } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { FocusToggle } from "../../src/components/FocusToggle";
import { NameCapture } from "../../src/components/NameCapture";
import { QuoteCard } from "../../src/components/QuoteCard";
import { browser } from "../../src/lib/browser";
import { getWallpaperById, quotes } from "../../src/lib/data";
import { selectNextQuote, selectQuote, updateHiddenQuoteIds } from "../../src/lib/quotes";
import { formatTime, getGreeting } from "../../src/lib/time";
import { useSettings } from "../../src/lib/useSettings";
import "../../src/styles/global.css";

function NewTabApp() {
  const { state, setSettings } = useSettings();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  const settings = state.status === "ready" ? state.data : null;
  const quote = useMemo(() => {
    if (!settings) return quotes[0];
    return selectQuote(quotes, settings.hiddenQuoteIds, settings.currentQuoteId);
  }, [settings]);
  const wallpaper = settings ? getWallpaperById(settings.currentWallpaperId) : undefined;
  const wallpaperUrl = wallpaper
    ? `/wallpapers/${wallpaper.fileName}`
    : "/wallpapers/misty-forest.svg";
  const showInFuture = settings ? !settings.hiddenQuoteIds.includes(quote.id) : true;

  if (state.status === "loading") {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 text-white">
        Loading Wisdom...
      </main>
    );
  }

  if (state.status === "error" || !settings) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 p-6 text-white">
        <p className="rounded-2xl bg-white/10 p-6">
          Wisdom could not load settings. Try reloading.
        </p>
      </main>
    );
  }

  async function openOptions() {
    await browser.runtime.openOptionsPage();
  }

  return (
    <main
      className="min-h-screen bg-cover bg-center text-white"
      style={{
        backgroundImage: `linear-gradient(120deg, rgba(9, 17, 28, 0.75), rgba(9, 17, 28, 0.25)), url(${wallpaperUrl})`,
      }}
    >
      <div className="flex min-h-screen flex-col justify-between p-6 sm:p-10">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-6xl font-bold tracking-tight sm:text-8xl">{formatTime(now)}</p>
            <h1 className="mt-3 text-2xl font-semibold sm:text-4xl">
              {getGreeting(now)}
              {settings.userName ? `, ${settings.userName}` : ""}.
            </h1>
          </div>
          <button
            aria-label="Open settings"
            className="rounded-full bg-white/15 p-3 text-white shadow-lg backdrop-blur transition hover:bg-white/25"
            onClick={openOptions}
            type="button"
          >
            <Settings aria-hidden="true" />
          </button>
        </header>

        <div className="grid flex-1 place-items-center py-8">
          {settings.userName ? (
            <QuoteCard
              onNext={() => {
                const nextQuote = selectNextQuote(quotes, settings.hiddenQuoteIds, quote.id);
                void setSettings({ ...settings, currentQuoteId: nextQuote.id });
              }}
              onShowInFutureChange={(value) => {
                void setSettings({
                  ...settings,
                  hiddenQuoteIds: updateHiddenQuoteIds(settings.hiddenQuoteIds, quote.id, value),
                });
              }}
              quote={quote}
              showInFuture={showInFuture}
            />
          ) : (
            <NameCapture onSave={(userName) => void setSettings({ ...settings, userName })} />
          )}
        </div>

        <footer className="flex flex-wrap items-end justify-between gap-4">
          <FocusToggle
            enabled={settings.focusMode.enabled}
            onChange={(enabled) => {
              void setSettings({
                ...settings,
                focusMode: { enabled, updatedAt: new Date().toISOString() },
              });
            }}
          />
          {wallpaper ? (
            <p className="rounded-full bg-slate-950/40 px-4 py-2 text-xs text-slate-100 backdrop-blur">
              {wallpaper.title} · {wallpaper.credit}
            </p>
          ) : null}
        </footer>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(<NewTabApp />);
