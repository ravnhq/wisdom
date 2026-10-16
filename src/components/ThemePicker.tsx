import { Moon, Sun } from "lucide-react";
import type { Theme } from "../lib/accents";
import { ChoiceGroup } from "./ChoiceGroup";

const THEMES = [
  { id: "light", label: "Light", Icon: Sun },
  { id: "dark", label: "Dark", Icon: Moon },
] as const;

export function ThemePicker({
  value,
  onChange,
}: {
  value: Theme;
  onChange: (theme: Theme) => void;
}) {
  return (
    <ChoiceGroup
      className="grid-cols-2"
      legend="Theme"
      name="theme"
      onChange={onChange}
      options={THEMES.map(({ id, label, Icon }) => ({
        id,
        label,
        content: (
          <>
            <Icon aria-hidden="true" size={24} />
            <span className="font-semibold">{label}</span>
          </>
        ),
      }))}
      value={value}
    />
  );
}
