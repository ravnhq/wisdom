import { z } from "zod";
import type { AccentId } from "./accents";

const DEFAULT_API_URL = "https://wisdom-api.raul-h-penate.workers.dev";
const TIMEOUT_MS = 3_000;

export const WALLPAPER_API_URL: string = import.meta.env.WXT_WALLPAPER_API_URL || DEFAULT_API_URL;

export type PixabayAttribution = {
  author: string;
  authorUrl: string;
  pageUrl: string;
};

export type RemoteWallpaper = {
  day: string;
  imageUrl: string;
  credit: string;
  attribution: PixabayAttribution | null;
};

const pixabayUrl = z.url({ protocol: /^https$/, hostname: /^(.+\.)?pixabay\.com$/ });
const daySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const metadataResponseSchema = z.object({
  ok: z.literal(true),
  data: z.object({
    day: daySchema,
    credit: z.string().min(1),
    author: z.string().min(1).optional(),
    authorUrl: pixabayUrl.optional(),
    pageUrl: pixabayUrl.optional(),
  }),
});

const cachedWallpaperSchema = z.object({
  day: daySchema,
  imageUrl: z.string().min(1),
  credit: z.string().min(1),
  attribution: z
    .object({ author: z.string().min(1), authorUrl: pixabayUrl, pageUrl: pixabayUrl })
    .nullable(),
});

const cacheKey = (palette: AccentId) => `wisdom.wallpaper.${palette}`;

export function remoteImageUrl(
  palette: AccentId,
  day: string,
  apiUrl: string = WALLPAPER_API_URL,
): string {
  return `${apiUrl}/image?palette=${palette}&day=${day}`;
}

export function readCachedWallpaper(palette: AccentId, day: string): RemoteWallpaper | null {
  try {
    const raw = localStorage.getItem(cacheKey(palette));
    if (!raw) return null;
    const parsed = cachedWallpaperSchema.safeParse(JSON.parse(raw));
    if (!parsed.success || parsed.data.day !== day) return null;
    return parsed.data.imageUrl === remoteImageUrl(palette, day) ? parsed.data : null;
  } catch {
    return null;
  }
}

export function cacheWallpaper(palette: AccentId, wallpaper: RemoteWallpaper): void {
  try {
    localStorage.setItem(cacheKey(palette), JSON.stringify(wallpaper));
  } catch {}
}

function preload(url: string, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("image failed to load"));
    signal.addEventListener("abort", () => reject(signal.reason));
    img.src = url;
  });
}

export async function fetchDailyWallpaper(
  palette: AccentId,
  day: string,
  apiUrl: string = WALLPAPER_API_URL,
): Promise<RemoteWallpaper | null> {
  const signal = AbortSignal.timeout(TIMEOUT_MS);
  try {
    const response = await fetch(`${apiUrl}/image/metadata?palette=${palette}&day=${day}`, {
      signal,
    });
    if (!response.ok) return null;
    const parsed = metadataResponseSchema.safeParse(await response.json());
    if (!parsed.success) return null;

    const { day: servedDay, credit, author, authorUrl, pageUrl } = parsed.data.data;
    const imageUrl = remoteImageUrl(palette, servedDay, apiUrl);
    await preload(imageUrl, signal);
    const attribution = author && authorUrl && pageUrl ? { author, authorUrl, pageUrl } : null;
    return { day: servedDay, imageUrl, credit, attribution };
  } catch {
    return null;
  }
}
