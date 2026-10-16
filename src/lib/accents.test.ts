import { describe, expect, it } from "vitest";
import { paletteFor, parseAccentChoice, readableOn, resolveAccent } from "./accents";

describe("parseAccentChoice", () => {
  it("keeps presets and valid hex colors", () => {
    expect(parseAccentChoice("purple")).toBe("purple");
    expect(parseAccentChoice("#8b5e3c")).toBe("#8B5E3C");
  });

  it("falls back to the Wisdom theme for anything else", () => {
    for (const junk of ["neon", "#12345", "#GGGGGG", "8B5E3C", 42, null, undefined]) {
      expect(parseAccentChoice(junk)).toBe("teal");
    }
  });
});

describe("resolveAccent", () => {
  it("uses the macOS light and dark variants for presets", () => {
    expect(resolveAccent("blue", "light").accent).toBe("#007AFF");
    expect(resolveAccent("blue", "dark").accent).toBe("#0A84FF");
  });

  it("uses a custom hex in both modes", () => {
    expect(resolveAccent("#8B5E3C", "light").accent).toBe("#8B5E3C");
    expect(resolveAccent("#8B5E3C", "dark").accent).toBe("#8B5E3C");
  });
});

describe("readableOn", () => {
  it("puts dark text on bright colors and white text on deep ones", () => {
    expect(readableOn("#FFCC00")).toBe("#1C1C1E");
    expect(readableOn("#1B2A4A")).toBe("#FFFFFF");
  });
});

describe("paletteFor", () => {
  it("keeps presets as they are", () => {
    expect(paletteFor("purple")).toBe("purple");
    expect(paletteFor("graphite")).toBe("graphite");
  });

  it("snaps custom colors to the closest preset hue", () => {
    expect(paletteFor("#1E3A8A")).toBe("blue");
    expect(paletteFor("#8B5E3C")).toBe("orange");
    expect(paletteFor("#14B8A6")).toBe("teal");
    expect(paletteFor("#B91C1C")).toBe("red");
    expect(paletteFor("#6D28D9")).toBe("purple");
  });

  it("sends muted colors to graphite", () => {
    expect(paletteFor("#6B7280")).toBe("graphite");
    expect(paletteFor("#000000")).toBe("graphite");
    expect(paletteFor("#FFFFFF")).toBe("graphite");
  });
});
