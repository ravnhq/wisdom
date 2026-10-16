import { type FormEvent, useState } from "react";
import type { AccentChoice } from "../lib/accents";
import type { WisdomSettings } from "../lib/types";
import { useAppearance } from "../lib/useAppearance";
import { Button } from "./Button";
import { DaveNote } from "./DaveNote";
import { ThemePicker } from "./ThemePicker";
import { ThemeSwatches } from "./ThemeSwatches";

export type OnboardingResult = Pick<WisdomSettings, "userName" | "accent" | "theme">;

type OnboardingProps = {
  initialAccent: AccentChoice;
  initialTheme: WisdomSettings["theme"];
  onAccentChange?: (accent: AccentChoice) => void;
  onFinish: (result: OnboardingResult) => void;
};

type Step = "palette" | "name" | "dave" | "mode";

function isDave(name: string) {
  return name.trim().toLowerCase() === "dave";
}

export function Onboarding({
  initialAccent,
  initialTheme,
  onAccentChange,
  onFinish,
}: OnboardingProps) {
  const [step, setStep] = useState<Step>("palette");
  const [name, setName] = useState("");
  const [accent, setAccent] = useState(initialAccent);
  const [theme, setTheme] = useState(initialTheme);

  useAppearance({ theme, accent });

  function chooseAccent(next: AccentChoice) {
    setAccent(next);
    onAccentChange?.(next);
  }

  function submitName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;
    setStep(isDave(name) ? "dave" : "mode");
  }

  if (step === "dave") return <DaveNote onContinue={() => setStep("mode")} />;

  return (
    <section
      aria-label="Welcome to Wisdom"
      className={`relative z-10 w-full rounded-3xl border border-line bg-surface/80 text-ink shadow-2xl backdrop-blur-xl transition-[max-width] duration-300 ${
        step === "palette" ? "max-w-xl p-6 sm:p-7" : "max-w-md p-8"
      }`}
    >
      <p className="text-sm uppercase tracking-[0.35em] text-accent">Welcome to Wisdom</p>

      {step === "palette" ? (
        <div>
          <h1 className="mt-3 text-3xl font-bold">Pick a theme that fits your style</h1>
          <p className="mt-2 mb-5 text-sm leading-6 text-ink-muted">
            It recolors Wisdom and picks your daily photo. Change it anytime from the palette
            button.
          </p>
          <ThemeSwatches compact onChange={chooseAccent} value={accent} />
          <Button className="mt-5 w-full" onClick={() => setStep("name")} variant="primary">
            Continue
          </Button>
        </div>
      ) : null}

      {step === "name" ? (
        <form aria-label="Set your name" onSubmit={submitName}>
          <h1 className="mt-4 text-3xl font-bold">What should this space call you?</h1>
          <p className="mt-3 text-sm leading-6 text-ink-muted">
            Your name stays in browser storage and only personalizes this extension.
          </p>
          <label className="mt-6 block text-sm font-semibold" htmlFor="name">
            Name
          </label>
          <input
            autoComplete="given-name"
            className="mt-2 w-full rounded-xl border border-line bg-page px-4 py-3 text-ink"
            id="name"
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            value={name}
          />
          <Button className="mt-6 w-full" type="submit" variant="primary">
            Continue
          </Button>
        </form>
      ) : null}

      {step === "mode" ? (
        <div>
          <h1 className="mt-4 text-3xl font-bold">Light or dark?</h1>
          <div className="mt-6">
            <ThemePicker onChange={setTheme} value={theme} />
          </div>
          <Button
            className="mt-6 w-full"
            onClick={() => onFinish({ userName: name.trim(), accent, theme })}
            variant="primary"
          >
            Start focusing
          </Button>
        </div>
      ) : null}
    </section>
  );
}
