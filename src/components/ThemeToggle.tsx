import { Moon, Sun } from "lucide-react";
import { Button } from "./Button";

type ThemeToggleProps = {
  theme: "dark" | "light";
  onChange: (theme: "dark" | "light") => void;
};

export function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  return (
    <Button
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="flex items-center gap-2"
      onClick={() => onChange(theme === "dark" ? "light" : "dark")}
      variant="ghost"
    >
      {theme === "dark" ? (
        <Sun aria-hidden="true" size={18} />
      ) : (
        <Moon aria-hidden="true" size={18} />
      )}
    </Button>
  );
}
