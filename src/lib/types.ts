export type FocusMode = {
  enabled: boolean;
  updatedAt: string;
};

export type QuoteRecord = {
  id: string;
  text: string;
  author: string;
  explanation: string;
  tags: string[];
  defaultVisible: boolean;
};

export type WallpaperRecord = {
  id: string;
  title: string;
  fileName: string;
  alt: string;
  credit: string;
  license: string;
  dominantColor: string;
};

export type WallpaperSource = "bundled" | "api";

export type WallpaperRefresh = "every-tab" | "daily" | "weekly";

export const WALLPAPER_TOPICS = [
  "nature",
  "mountains",
  "ocean",
  "forest",
  "city",
  "abstract",
  "space",
  "architecture",
  "desert",
  "autumn",
] as const;

export type WallpaperTopic = (typeof WALLPAPER_TOPICS)[number];

export type ApiWallpaper = {
  url: string;
  alt: string;
  credit: string;
};

export type WisdomSettings = {
  userName: string;
  focusMode: FocusMode;
  blockedDomains: string[];
  hiddenQuoteIds: string[];
  currentQuoteId: string;
  currentWallpaperId: string;
  theme: "dark" | "light";
  wallpaperSource: WallpaperSource;
  wallpaperTopic: WallpaperTopic;
  wallpaperRefresh: WallpaperRefresh;
  lastWallpaperFetchedAt: string;
  apiWallpaper: ApiWallpaper | null;
  installId: string;
};

export type LoadState<T> =
  | { status: "loading" }
  | { status: "ready"; data: T }
  | { status: "error"; message: string };
