export const ACCENTS = [
  { id: "teal", label: "Wisdom", light: "#008F7A", dark: "#00C9A7" },
  { id: "blue", label: "Blue", light: "#007AFF", dark: "#0A84FF" },
  { id: "purple", label: "Purple", light: "#AF52DE", dark: "#BF5AF2" },
  { id: "pink", label: "Pink", light: "#FF2D55", dark: "#FF375F" },
  { id: "red", label: "Red", light: "#FF3B30", dark: "#FF453A" },
  { id: "orange", label: "Orange", light: "#FF9500", dark: "#FF9F0A" },
  { id: "yellow", label: "Yellow", light: "#FFCC00", dark: "#FFD60A" },
  { id: "green", label: "Green", light: "#34C759", dark: "#30D158" },
  { id: "graphite", label: "Graphite", light: "#8E8E93", dark: "#98989D" },
] as const;

export type Accent = (typeof ACCENTS)[number];
export type AccentId = Accent["id"];
export type HexColor = `#${string}`;
export type AccentChoice = AccentId | HexColor;
export type Theme = "light" | "dark";

export const DEFAULT_ACCENT: AccentId = "teal";

const HEX_PATTERN = /^#[0-9a-f]{6}$/i;

export function isHexColor(value: unknown): value is HexColor {
  return typeof value === "string" && HEX_PATTERN.test(value);
}

function findPreset(value: unknown): Accent | undefined {
  return ACCENTS.find((accent) => accent.id === value);
}

export function parseAccentChoice(value: unknown): AccentChoice {
  if (findPreset(value)) return value as AccentId;
  if (isHexColor(value)) return value.toUpperCase() as HexColor;
  return DEFAULT_ACCENT;
}

function relativeLuminance(hex: HexColor): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function readableOn(hex: HexColor): HexColor {
  const contrastWithWhite = 1.05 / (relativeLuminance(hex) + 0.05);
  const contrastWithBlack = (relativeLuminance(hex) + 0.05) / 0.05;
  return contrastWithWhite >= contrastWithBlack ? "#FFFFFF" : "#1C1C1E";
}

export function resolveAccent(choice: AccentChoice, theme: Theme) {
  const preset = findPreset(choice);
  const accent: HexColor = preset
    ? theme === "light"
      ? preset.light
      : preset.dark
    : (choice as HexColor);
  return { accent, onAccent: readableOn(accent) };
}

const MIN_PALETTE_SATURATION = 0.2;

function hueAndSaturation(hex: HexColor) {
  const [r, g, b] = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255) as [
    number,
    number,
    number,
  ];
  const max = Math.max(r, g, b);
  const chroma = max - Math.min(r, g, b);
  const saturation = max === 0 ? 0 : chroma / max;
  if (chroma === 0) return { hue: 0, saturation };
  const sector =
    max === r
      ? ((g - b) / chroma + 6) % 6
      : max === g
        ? (b - r) / chroma + 2
        : (r - g) / chroma + 4;
  return { hue: sector * 60, saturation };
}

const CHROMATIC_PRESETS = ACCENTS.filter((accent) => accent.id !== "graphite").map((accent) => ({
  id: accent.id,
  hue: hueAndSaturation(accent.light).hue,
}));

export function paletteFor(choice: AccentChoice): AccentId {
  if (findPreset(choice)) return choice as AccentId;
  const { hue, saturation } = hueAndSaturation(choice as HexColor);
  if (saturation < MIN_PALETTE_SATURATION) return "graphite";
  const distance = (other: number) => Math.min(Math.abs(hue - other), 360 - Math.abs(hue - other));
  return CHROMATIC_PRESETS.reduce((best, preset) =>
    distance(preset.hue) < distance(best.hue) ? preset : best,
  ).id;
}
