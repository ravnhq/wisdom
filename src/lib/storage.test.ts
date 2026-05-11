import { beforeEach, describe, expect, it, vi } from "vitest";

const store = new Map<string, unknown>();

vi.mock("./browser", () => ({
  browser: {
    storage: {
      local: {
        get: vi.fn(async (defaults: Record<string, unknown>) => ({
          ...defaults,
          ...Object.fromEntries(store),
        })),
        set: vi.fn(async (value: Record<string, unknown>) => {
          for (const [key, item] of Object.entries(value)) store.set(key, item);
        }),
      },
    },
  },
}));

const { getSettings, setFocusMode } = await import("./storage");

describe("storage", () => {
  beforeEach(() => store.clear());

  it("returns defaults", async () => {
    const settings = await getSettings();
    expect(settings.blockedDomains).toContain("youtube.com");
    expect(settings.focusMode.enabled).toBe(false);
  });

  it("updates focus mode", async () => {
    const settings = await setFocusMode(true);
    expect(settings.focusMode.enabled).toBe(true);
  });
});
