import { WISDOM_WORKER_URL } from "./constants";
import { getSettings, updateSettings } from "./storage";
import type { ApiWallpaper, WallpaperRefresh, WisdomSettings } from "./types";

const API_KEY = import.meta.env.VITE_WISDOM_API_KEY as string | undefined;

function generateInstallId(): string {
  return crypto.randomUUID();
}

function refreshIntervalMs(refresh: WallpaperRefresh): number {
  switch (refresh) {
    case "every-tab":
      return 0;
    case "daily":
      return 24 * 60 * 60 * 1_000;
    case "weekly":
      return 7 * 24 * 60 * 60 * 1_000;
  }
}

function isRefreshDue(lastFetchedAt: string, refresh: WallpaperRefresh): boolean {
  const interval = refreshIntervalMs(refresh);
  if (interval === 0) return true;
  const elapsed = Date.now() - new Date(lastFetchedAt).getTime();
  return elapsed >= interval;
}

async function fetchFromWorker(
  topic: string,
  installId: string,
  forceRefresh: boolean,
): Promise<ApiWallpaper> {
  if (!API_KEY) {
    throw new Error("VITE_WISDOM_API_KEY is not set");
  }

  const url = new URL(`${WISDOM_WORKER_URL}/image`);
  url.searchParams.set("topic", topic);
  url.searchParams.set("installId", installId);
  if (forceRefresh) {
    url.searchParams.set("refresh", "1");
  }

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });

  if (!response.ok) {
    throw new Error(`Worker returned ${response.status}`);
  }

  const data = (await response.json()) as { url: string; alt: string; credit: string };
  return { url: data.url, alt: data.alt, credit: data.credit };
}

/**
 * Ensures the settings have an installId, generating one if absent.
 * Returns the (possibly updated) installId.
 */
async function ensureInstallId(settings: WisdomSettings): Promise<string> {
  if (settings.installId) return settings.installId;
  const installId = generateInstallId();
  await updateSettings((s) => ({ ...s, installId }));
  return installId;
}

/**
 * Checks whether a refresh is due and, if so, fetches a new image from the
 * worker API. Saves the result back to storage. Returns the updated settings.
 */
export async function syncApiWallpaper(): Promise<WisdomSettings> {
  const settings = await getSettings();

  if (settings.wallpaperSource !== "api") return settings;

  const installId = await ensureInstallId(settings);

  const forceRefresh = isRefreshDue(settings.lastWallpaperFetchedAt, settings.wallpaperRefresh);

  if (!forceRefresh && settings.apiWallpaper) {
    return settings;
  }

  try {
    const apiWallpaper = await fetchFromWorker(settings.wallpaperTopic, installId, forceRefresh);
    return updateSettings((s) => ({
      ...s,
      apiWallpaper,
      lastWallpaperFetchedAt: new Date().toISOString(),
    }));
  } catch {
    // On error, keep the cached wallpaper if available; don't crash the new tab.
    return settings;
  }
}
