import { Check } from "lucide-react";
import { useState } from "react";
import {
  ACCENTS,
  type AccentChoice,
  type AccentId,
  type HexColor,
  isHexColor,
  readableOn,
} from "../lib/accents";
import { ChoiceGroup } from "./ChoiceGroup";

type ThemeSwatchesProps = {
  value: AccentChoice;
  onChange: (choice: AccentChoice) => void;
  compact?: boolean;
};

const FALLBACK_CUSTOM: HexColor = "#8B5E3C";

export function ThemeSwatches({ value, onChange, compact = false }: ThemeSwatchesProps) {
  const custom = isHexColor(value) ? value : null;
  const [draft, setDraft] = useState<string>(custom ?? FALLBACK_CUSTOM);
  const pickerColor = custom ?? (isHexColor(draft) ? draft : FALLBACK_CUSTOM);

  function chooseHex(next: string) {
    setDraft(next);
    if (isHexColor(next)) onChange(next.toUpperCase() as HexColor);
  }

  const dot = compact ? "h-8 w-8" : "h-9 w-9";
  const customDot = (
    <label
      className={`relative grid ${dot} shrink-0 cursor-pointer place-items-center overflow-hidden rounded-full shadow-inner`}
    >
      <span className="absolute inset-0" style={{ background: pickerColor }} />
      {custom ? (
        <Check aria-hidden="true" className="relative" color={readableOn(pickerColor)} size={18} />
      ) : null}
      <input
        aria-label="Pick a custom color"
        className="absolute inset-0 cursor-pointer opacity-0"
        onChange={(event) => chooseHex(event.target.value)}
        type="color"
        value={pickerColor.toLowerCase()}
      />
    </label>
  );

  return (
    <div className="space-y-3">
      <ChoiceGroup<AccentId>
        className={
          compact
            ? "grid-cols-5 gap-2 [&>label]:gap-1 [&>label]:p-2 [&>label]:text-xs"
            : "grid-cols-3"
        }
        legend="Theme color"
        name="accent"
        onChange={onChange}
        options={ACCENTS.map((accent) => ({
          id: accent.id,
          label: accent.label,
          content: (
            <>
              <span
                className={`grid ${dot} place-items-center rounded-full shadow-inner`}
                style={{
                  background: `linear-gradient(135deg, ${accent.light} 50%, ${accent.dark} 50%)`,
                }}
              >
                {accent.id === value ? (
                  <Check aria-hidden="true" className="text-white drop-shadow" size={18} />
                ) : null}
              </span>
              <span className="font-semibold">{accent.label}</span>
            </>
          ),
        }))}
        value={custom ? null : (value as AccentId)}
      >
        {compact ? (
          <div
            className={`flex flex-col items-center gap-1 rounded-2xl border p-2 text-xs ${
              custom ? "border-accent ring-2 ring-accent" : "border-current/20"
            }`}
          >
            {customDot}
            <span className="font-semibold">Custom</span>
          </div>
        ) : null}
      </ChoiceGroup>

      {compact ? null : (
        <div
          className={`flex items-center gap-3 rounded-2xl border p-3 text-sm ${
            custom ? "border-accent ring-2 ring-accent" : "border-current/20"
          }`}
        >
          {customDot}
          <span className="font-semibold">Custom</span>
          <input
            aria-invalid={!isHexColor(draft)}
            aria-label="Custom color hex"
            className="ml-auto w-28 rounded-lg border border-current/20 bg-transparent px-2 py-1 font-mono uppercase aria-invalid:border-red-500"
            maxLength={7}
            onChange={(event) => chooseHex(event.target.value.trim())}
            onFocus={() => {
              if (!custom && isHexColor(draft)) onChange(draft.toUpperCase() as HexColor);
            }}
            placeholder="#RRGGBB"
            value={draft}
          />
        </div>
      )}
    </div>
  );
}
