import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

const variants = {
  primary: "bg-accent text-on-accent hover:brightness-110",
  secondary: "bg-surface text-ink hover:bg-surface-muted",
  ghost: "bg-white/10 text-white hover:bg-white/20",
  danger: "bg-rose-700 text-white hover:bg-rose-800",
};

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: keyof typeof variants;
  }
>;

export function Button({ children, className = "", variant = "secondary", ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-xl px-4 py-3 font-semibold shadow-sm transition ${variants[variant]} ${className}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
