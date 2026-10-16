import type { ReactNode } from "react";

type Choice<T extends string> = {
  id: T;
  label: string;
  content: ReactNode;
};

type ChoiceGroupProps<T extends string> = {
  legend: string;
  name: string;
  value: T | null;
  options: readonly Choice<T>[];
  onChange: (value: T) => void;
  className?: string;
  children?: ReactNode;
};

export function ChoiceGroup<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
  className = "",
  children,
}: ChoiceGroupProps<T>) {
  return (
    <fieldset className={`grid gap-3 ${className}`}>
      <legend className="sr-only">{legend}</legend>
      {options.map((option) => (
        <label
          className="relative flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-current/20 p-3 text-sm transition hover:bg-current/10 has-checked:border-accent has-checked:ring-2 has-checked:ring-accent has-focus-visible:outline-3 has-focus-visible:outline-accent"
          key={option.id}
        >
          <input
            aria-label={option.label}
            checked={option.id === value}
            className="sr-only"
            name={name}
            onChange={() => onChange(option.id)}
            type="radio"
            value={option.id}
          />
          {option.content}
        </label>
      ))}
      {children}
    </fieldset>
  );
}
