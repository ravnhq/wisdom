import { z } from "zod";
import quotesJson from "../data/quotes.json";
import wallpapersJson from "../data/wallpapers.json";
import type { QuoteRecord, WallpaperRecord } from "./types";

const quoteSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  author: z.string().min(1),
  explanation: z.string().min(1),
  tags: z.array(z.string().min(1)),
  defaultVisible: z.boolean(),
});

const wallpaperSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  fileName: z.string().min(1),
  alt: z.string().min(1),
  credit: z.string().min(1),
  license: z.string().min(1),
  dominantColor: z.string().min(1),
});

export const quotes = z.array(quoteSchema).min(1).parse(quotesJson) satisfies QuoteRecord[];
export const wallpapers = z
  .array(wallpaperSchema)
  .min(1)
  .parse(wallpapersJson) satisfies WallpaperRecord[];

export function getQuoteById(id: string): QuoteRecord | undefined {
  return quotes.find((quote) => quote.id === id);
}

export function getWallpaperById(id: string): WallpaperRecord | undefined {
  return wallpapers.find((wallpaper) => wallpaper.id === id);
}
