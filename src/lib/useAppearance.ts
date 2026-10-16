import { useEffect, useRef } from "react";
import { type AccentChoice, resolveAccent, type Theme } from "./accents";

export type Appearance = { theme: Theme; accent: AccentChoice };

const REMEMBERED_KEY = "wisdom.appearance";

export function applyAppearance(theme: Theme, choice: AccentChoice) {
  const root = document.documentElement;
  const { accent, onAccent } = resolveAccent(choice, theme);
  root.classList.toggle("dark", theme !== "light");
  root.style.setProperty("--accent", accent);
  root.style.setProperty("--on-accent", onAccent);
  try {
    localStorage.setItem(
      REMEMBERED_KEY,
      JSON.stringify({ dark: theme !== "light", accent, onAccent }),
    );
  } catch {}
}

let lastPointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
window.addEventListener("pointerdown", (event) => {
  lastPointer = { x: event.clientX, y: event.clientY };
});

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export function transitionAppearance(theme: Theme, choice: AccentChoice) {
  if (!document.startViewTransition || prefersReducedMotion()) {
    applyAppearance(theme, choice);
    return;
  }
  const { x, y } = lastPointer;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const root = document.documentElement;
  root.style.setProperty("--reveal-x", `${x}px`);
  root.style.setProperty("--reveal-y", `${y}px`);
  root.style.setProperty("--reveal-r", `${radius}px`);
  document.startViewTransition(() => applyAppearance(theme, choice));
}

export function useAppearance(appearance: Appearance | null) {
  const applied = useRef(false);
  const theme = appearance?.theme;
  const accent = appearance?.accent;
  useEffect(() => {
    if (!theme || !accent) return;
    if (applied.current) {
      transitionAppearance(theme, accent);
    } else {
      applyAppearance(theme, accent);
      applied.current = true;
    }
  }, [theme, accent]);
}
