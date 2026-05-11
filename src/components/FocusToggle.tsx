import { Moon, SunMedium } from "lucide-react";
import { Button } from "./Button";

type FocusToggleProps = {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
};

export function FocusToggle({ enabled, onChange }: FocusToggleProps) {
  return (
    <Button
      aria-pressed={enabled}
      className="flex items-center gap-3"
      onClick={() => onChange(!enabled)}
      variant={enabled ? "primary" : "secondary"}
    >
      {enabled ? <Moon aria-hidden="true" size={20} /> : <SunMedium aria-hidden="true" size={20} />}
      {enabled ? "Focus mode on" : "Start focus mode"}
    </Button>
  );
}
