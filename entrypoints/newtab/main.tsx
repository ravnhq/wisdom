import { Settings } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { FocusToggle } from "../../src/components/FocusToggle";
import { Onboarding } from "../../src/components/Onboarding";
import { PaletteMenu } from "../../src/components/PaletteMenu";
import { PhotoInfo } from "../../src/components/PhotoInfo";
import { QuoteCard } from "../../src/components/QuoteCard";
import { ThemeToggle } from "../../src/components/ThemeToggle";
import { WallpaperBackdrop } from "../../src/components/WallpaperBackdrop";
import { type AccentChoice, paletteFor } from "../../src/lib/accents";
import { browser } from "../../src/lib/browser";
import { getWallpaperById, quotes } from "../../src/lib/data";
import { selectNextQuote, selectQuote, updateHiddenQuoteIds } from "../../src/lib/quotes";
import {
  cacheWallpaper,
  fetchDailyWallpaper,
  type RemoteWallpaper,
  readCachedWallpaper,
  remoteImageUrl,
} from "../../src/lib/remote-wallpaper";
import { formatTime, getGreeting, localDay } from "../../src/lib/time";
import type { WallpaperRecord } from "../../src/lib/types";
import { useAppearance } from "../../src/lib/useAppearance";
import { useDailyQuote } from "../../src/lib/useDailyQuote";
import { useSettings } from "../../src/lib/useSettings";
import "../../src/styles/global.css";

export function NewTabApp() {
  const { state, setSettings } = useSettings();
  const [now, setNow] = useState(() => new Date());
  const [previewAccent, setPreviewAccent] = useState<AccentChoice | null>(null);
  const [wallpapers, setWallpapers] = useState(() => new Map<string, RemoteWallpaper | "failed">());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  const settings = state.status === "ready" ? state.data : null;
  useAppearance(settings);
  const palette = settings ? paletteFor(previewAccent ?? settings.accent) : null;
  const today = localDay(now);
  const wallpaperKey = palette ? `${palette}/${today}` : null;
  useDailyQuote(settings, setSettings, today);

  useEffect(() => {
    if (!palette || !wallpaperKey || wallpapers.has(wallpaperKey)) return;
    if (readCachedWallpaper(palette, today)) return;
    void fetchDailyWallpaper(palette, today).then((result) => {
      if (result?.day === today) cacheWallpaper(palette, result);
      setWallpapers((current) => new Map(current).set(wallpaperKey, result ?? "failed"));
    });
  }, [palette, today, wallpaperKey, wallpapers]);

  const quote = useMemo(() => {
    if (!settings) return quotes[0];
    return selectQuote(quotes, settings.hiddenQuoteIds, settings.currentQuoteId);
  }, [settings]);
  const wallpaper = settings ? getWallpaperById(settings.currentWallpaperId) : undefined;
  const fetched = wallpaperKey ? wallpapers.get(wallpaperKey) : undefined;
  const remoteWallpaper =
    fetched === "failed" || !palette ? null : (fetched ?? readCachedWallpaper(palette, today));
  const wallpaperUrl =
    fetched === "failed" || !palette
      ? wallpaper
        ? `/wallpapers/${wallpaper.fileName}`
        : "/wallpapers/misty-forest.svg"
      : (remoteWallpaper?.imageUrl ?? remoteImageUrl(palette, today));
  const showInFuture = settings ? !settings.hiddenQuoteIds.includes(quote.id) : true;

  if (state.status === "loading") {
    return (
      <main className="grid min-h-screen place-items-center bg-page text-ink">
        Loading Wisdom...
      </main>
    );
  }

  if (state.status === "error" || !settings) {
    return (
      <main className="grid min-h-screen place-items-center bg-page p-6 text-ink">
        <p className="rounded-2xl bg-surface p-6">Wisdom could not load settings. Try reloading.</p>
      </main>
    );
  }

  async function openOptions() {
    await browser.runtime.openOptionsPage();
  }

  return (
    <main className="isolate min-h-screen text-white">
      <WallpaperBackdrop url={wallpaperUrl} />
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
            {settings.userName ? (
              <PaletteMenu
                onChange={(accent) => void setSettings({ ...settings, accent })}
                value={settings.accent}
              />
            ) : null}
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

        <div className="grid flex-1 place-items-center py-4">
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
            <Onboarding
              initialAccent={settings.accent}
              initialTheme={settings.theme}
              onAccentChange={setPreviewAccent}
              onFinish={(choices) => {
                setPreviewAccent(null);
                void setSettings({ ...settings, ...choices });
              }}
            />
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
          <WallpaperCredit
            local={fetched === "failed" ? wallpaper : undefined}
            remote={remoteWallpaper}
          />
        </footer>
      </div>
    </main>
  );
}

const linkClass =
  "font-semibold underline decoration-white/40 underline-offset-2 hover:decoration-white";

function WallpaperCredit({
  remote,
  local,
}: {
  remote: RemoteWallpaper | null;
  local: WallpaperRecord | undefined;
}) {
  if (!remote && !local) return null;
  return (
    <div className="flex items-center gap-2">
      {remote ? <PhotoInfo /> : null}
      <p className="rounded-full bg-slate-950/40 px-4 py-2 text-xs text-slate-100 backdrop-blur">
        {remote?.attribution ? (
          <>
            Photo by{" "}
            <a
              className={linkClass}
              href={remote.attribution.authorUrl}
              rel="noreferrer"
              target="_blank"
            >
              {remote.attribution.author}
            </a>{" "}
            on{" "}
            <a
              className={linkClass}
              href={remote.attribution.pageUrl}
              rel="noreferrer"
              target="_blank"
            >
              Pixabay
            </a>
          </>
        ) : remote ? (
          remote.credit
        ) : (
          `${local?.title} · ${local?.credit}`
        )}
      </p>
    </div>
  );
}

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(<NewTabApp />);
}
