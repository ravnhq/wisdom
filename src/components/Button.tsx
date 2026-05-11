import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

const variants = {
  primary:
    "bg-[#008F7A] text-white hover:bg-[#007060] dark:bg-[#00C9A7] dark:text-[#071C1A] dark:hover:bg-[#00B596]",
  secondary:
    "bg-white/80 text-slate-900 hover:bg-white dark:bg-white/10 dark:text-[#FAF3E0] dark:hover:bg-white/20",
  ghost:
    "bg-white/10 text-white hover:bg-white/20 dark:bg-white/10 dark:text-[#FAF3E0] dark:hover:bg-white/20",
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
