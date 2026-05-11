import { type FormEvent, useState } from "react";
import { Button } from "./Button";

type NameCaptureProps = {
  onSave: (name: string) => void;
};

export function NameCapture({ onSave }: NameCaptureProps) {
  const [name, setName] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextName = name.trim();
    if (nextName) {
      onSave(nextName);
    }
  }

  return (
    <form
      aria-label="Set your name"
      className="w-full max-w-md rounded-3xl border border-white/25 bg-slate-950/55 p-8 text-white shadow-2xl backdrop-blur-xl"
      onSubmit={handleSubmit}
    >
      <p className="text-sm uppercase tracking-[0.35em] text-amber-200">Welcome to Wisdom</p>
      <h1 className="mt-4 text-3xl font-bold">What should this space call you?</h1>
      <p className="mt-3 text-sm leading-6 text-slate-200">
        Your name stays in browser storage and only personalizes this extension.
      </p>
      <label className="mt-6 block text-sm font-semibold" htmlFor="name">
        Name
      </label>
      <input
        autoComplete="given-name"
        className="mt-2 w-full rounded-xl border border-white/30 bg-white/90 px-4 py-3 text-slate-950"
        id="name"
        onChange={(event) => setName(event.target.value)}
        placeholder="Your name"
        value={name}
      />
      <Button className="mt-6 w-full" type="submit" variant="primary">
        Start focusing
      </Button>
    </form>
  );
}
