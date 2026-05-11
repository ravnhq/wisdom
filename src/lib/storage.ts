import { normalizeBlockedDomains } from "./blocking";
import { browser } from "./browser";
import { DEFAULT_BLOCKED_DOMAINS, DEFAULT_QUOTE_ID, DEFAULT_WALLPAPER_ID } from "./constants";
import type { WisdomSettings } from "./types";

export const defaultSettings: WisdomSettings = {
  userName: "",
  focusMode: {
    enabled: false,
    updatedAt: new Date(0).toISOString(),
  },
  blockedDomains: [...DEFAULT_BLOCKED_DOMAINS],
  hiddenQuoteIds: [],
  currentQuoteId: DEFAULT_QUOTE_ID,
  currentWallpaperId: DEFAULT_WALLPAPER_ID,
};

function sanitizeSettings(value: Partial<WisdomSettings> | undefined): WisdomSettings {
  return {
    ...defaultSettings,
    ...value,
    focusMode: {
      ...defaultSettings.focusMode,
      ...value?.focusMode,
    },
    blockedDomains: normalizeBlockedDomains(
      value?.blockedDomains ?? defaultSettings.blockedDomains,
    ),
    hiddenQuoteIds: Array.from(new Set(value?.hiddenQuoteIds ?? [])),
  };
}

export async function getSettings(): Promise<WisdomSettings> {
  const result = await browser.storage.local.get(defaultSettings);
  return sanitizeSettings(result as Partial<WisdomSettings>);
}

export async function saveSettings(settings: WisdomSettings): Promise<WisdomSettings> {
  const sanitized = sanitizeSettings(settings);
  await browser.storage.local.set(sanitized);
  return sanitized;
}

export async function updateSettings(
  updater: (settings: WisdomSettings) => WisdomSettings,
): Promise<WisdomSettings> {
  const next = updater(await getSettings());
  return saveSettings(next);
}

export async function setFocusMode(enabled: boolean): Promise<WisdomSettings> {
  return updateSettings((settings) => ({
    ...settings,
    focusMode: {
      enabled,
      updatedAt: new Date().toISOString(),
    },
  }));
}
