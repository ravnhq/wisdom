import { Palette } from "lucide-react";
import type { AccentChoice } from "../lib/accents";
import { ThemeSwatches } from "./ThemeSwatches";

type PaletteMenuProps = {
  value: AccentChoice;
  onChange: (choice: AccentChoice) => void;
};

export function PaletteMenu({ value, onChange }: PaletteMenuProps) {
  return (
    <>
      <button
        aria-label="Change theme color"
        className="rounded-full bg-white/15 p-3 text-white shadow-lg backdrop-blur transition hover:bg-white/25"
        popoverTarget="palette-menu"
        type="button"
      >
        <Palette aria-hidden="true" />
      </button>
      <div
        aria-label="Theme color"
        className="palette-menu w-[22rem] max-w-[calc(100vw-3rem)] rounded-3xl border border-line bg-surface/90 p-4 text-ink shadow-2xl backdrop-blur-xl"
        id="palette-menu"
        popover="auto"
        role="dialog"
      >
        <p className="mb-3 text-sm font-semibold">Theme color</p>
        <ThemeSwatches compact onChange={onChange} value={value} />
        <p className="mt-3 text-xs text-ink-muted">Your daily photo follows this color.</p>
      </div>
    </>
  );
}
