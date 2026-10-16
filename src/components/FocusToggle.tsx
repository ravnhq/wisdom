import { Moon, SunMedium } from "lucide-react";
import { type CSSProperties, type MouseEvent, useState } from "react";
import { Button } from "./Button";

type FocusToggleProps = {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
};

type Burst = { id: number; x: number; y: number };

export function FocusToggle({ enabled, onChange }: FocusToggleProps) {
  const [burst, setBurst] = useState<Burst | null>(null);

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    if (!enabled) {
      const box = event.currentTarget.getBoundingClientRect();
      setBurst({ id: Date.now(), x: box.left + box.width / 2, y: box.top + box.height / 2 });
    } else {
      setBurst(null);
    }
    onChange(!enabled);
  }

  return (
    <>
      {enabled ? (
        <div
          aria-hidden="true"
          className={`focus-vignette ${burst ? "focus-vignette-enter" : ""}`}
        />
      ) : null}
      {enabled && burst ? (
        <span
          aria-hidden="true"
          className="focus-burst"
          key={burst.id}
          style={{ "--x": `${burst.x}px`, "--y": `${burst.y}px` } as CSSProperties}
        />
      ) : null}
      {enabled && burst ? (
        <p
          className="focus-toast"
          key={`toast-${burst.id}`}
          onAnimationEnd={() => setBurst(null)}
          role="status"
        >
          Focus mode on. Distractions are blocked.
        </p>
      ) : null}
      <Button
        aria-pressed={enabled}
        className={`flex items-center gap-3 ${enabled ? "focus-breathe" : ""}`}
        onClick={toggle}
        variant={enabled ? "primary" : "secondary"}
      >
        {enabled ? (
          <Moon aria-hidden="true" size={20} />
        ) : (
          <SunMedium aria-hidden="true" size={20} />
        )}
        {enabled ? "Focus mode on" : "Start focus mode"}
      </Button>
    </>
  );
}
