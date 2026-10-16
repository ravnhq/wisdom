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

  it("defaults to the Wisdom accent for existing users", async () => {
    store.set("userName", "Raul");
    const settings = await getSettings();
    expect(settings.accent).toBe("teal");
  });

  it("replaces an unknown accent or theme with the defaults", async () => {
    store.set("accent", "neon");
    store.set("theme", "sepia");
    const settings = await getSettings();
    expect(settings.accent).toBe("teal");
    expect(settings.theme).toBe("dark");
  });

  it("keeps a saved custom hex", async () => {
    store.set("accent", "#8b5e3c");
    expect((await getSettings()).accent).toBe("#8B5E3C");
  });

  it("keeps a saved accent", async () => {
    store.set("accent", "purple");
    expect((await getSettings()).accent).toBe("purple");
  });

  it("updates focus mode", async () => {
    const settings = await setFocusMode(true);
    expect(settings.focusMode.enabled).toBe(true);
  });
});
