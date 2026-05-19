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

export type WisdomSettings = {
  userName: string;
  focusMode: FocusMode;
  blockedDomains: string[];
  hiddenQuoteIds: string[];
  currentQuoteId: string;
  currentWallpaperId: string;
  theme: "dark" | "light";
};

export type LoadState<T> =
  | { status: "loading" }
  | { status: "ready"; data: T }
  | { status: "error"; message: string };
