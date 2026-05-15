import { Settings } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { FocusToggle } from "../../src/components/FocusToggle";
import { NameCapture } from "../../src/components/NameCapture";
import { QuoteCard } from "../../src/components/QuoteCard";
import { ThemeToggle } from "../../src/components/ThemeToggle";
import { browser } from "../../src/lib/browser";
import { getWallpaperById, quotes } from "../../src/lib/data";
import { selectNextQuote, selectQuote, updateHiddenQuoteIds } from "../../src/lib/quotes";
import { formatTime, getGreeting } from "../../src/lib/time";
import { useSettings } from "../../src/lib/useSettings";
import { syncApiWallpaper } from "../../src/lib/wallpaper";
import "../../src/styles/global.css";

export function NewTabApp() {
  const { state, setSettings } = useSettings();
  const [now, setNow] = useState(() => new Date());
  const initialAdvanceDone = useRef(false);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  const settings = state.status === "ready" ? state.data : null;
  const theme = settings?.theme ?? "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme !== "light");
  }, [theme]);

  // On the very first load, if the saved current quote was hidden in a previous
  // session, silently advance to a random visible quote so the user never sees
  // a quote they already dismissed.
  useEffect(() => {
    if (state.status !== "ready" || initialAdvanceDone.current) return;
    initialAdvanceDone.current = true;
    const s = state.data;
    if (!s.hiddenQuoteIds.includes(s.currentQuoteId)) return;
    const next = selectNextQuote(quotes, s.hiddenQuoteIds, s.currentQuoteId);
    void setSettings({ ...s, currentQuoteId: next.id });
  }, [state, setSettings]);

  // Sync API wallpaper in the background whenever settings are ready.
  // The hook re-reads storage so the UI updates automatically if a new
  // image is fetched.
  useEffect(() => {
    if (state.status !== "ready") return;
    if (state.data.wallpaperSource !== "api") return;
    void syncApiWallpaper();
  }, [state]);

  const quote = useMemo(() => {
    if (!settings) return quotes[0];
    return selectQuote(quotes, settings.hiddenQuoteIds, settings.currentQuoteId);
  }, [settings]);

  const bundledWallpaper = settings ? getWallpaperById(settings.currentWallpaperId) : undefined;

  const wallpaperUrl =
    settings?.wallpaperSource === "api" && settings.apiWallpaper
      ? settings.apiWallpaper.url
      : bundledWallpaper
        ? `/wallpapers/${bundledWallpaper.fileName}`
        : "/wallpapers/misty-forest.svg";

  const wallpaperCredit =
    settings?.wallpaperSource === "api" && settings.apiWallpaper
      ? { title: settings.wallpaperTopic, credit: settings.apiWallpaper.credit }
      : bundledWallpaper
        ? { title: bundledWallpaper.title, credit: bundledWallpaper.credit }
        : null;

  const showInFuture = settings ? !settings.hiddenQuoteIds.includes(quote.id) : true;

  if (state.status === "loading") {
    return (
      <main className="grid min-h-screen place-items-center bg-[#071C1A] text-white">
        Loading Wisdom...
      </main>
    );
  }

  if (state.status === "error" || !settings) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#071C1A] p-6 text-white">
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
          <div className="flex items-center gap-2">
            <ThemeToggle
              onChange={(theme) => void setSettings({ ...settings, theme })}
              theme={settings.theme}
            />
            <button
              aria-label="Open settings"
              className="rounded-full bg-white/15 p-3 text-white shadow-lg backdrop-blur transition hover:bg-white/25"
              onClick={openOptions}
              type="button"
            >
              <Settings aria-hidden="true" />
            </button>
          </div>
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
          {wallpaperCredit ? (
            <p className="rounded-full bg-slate-950/40 px-4 py-2 text-xs text-slate-100 backdrop-blur">
              {wallpaperCredit.title} · {wallpaperCredit.credit}
            </p>
          ) : null}
        </footer>
      </div>
    </main>
  );
}

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(<NewTabApp />);
}
