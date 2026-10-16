import { HelpCircle } from "lucide-react";
import { useId, useState } from "react";

export const PHOTO_INFO =
  "Photos come from Pixabay and match your theme color. A new one arrives every day.";

export function PhotoInfo() {
  const [open, setOpen] = useState(false);
  const tipId = useId();

  return (
    <span className="group relative inline-flex">
      <button
        aria-describedby={tipId}
        aria-expanded={open}
        aria-label="About this photo"
        className="grid h-8 w-8 place-items-center rounded-full bg-slate-950/40 text-slate-100 backdrop-blur transition hover:bg-slate-950/60"
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        type="button"
      >
        <HelpCircle aria-hidden="true" size={16} />
      </button>
      <span
        className="photo-info pointer-events-none absolute right-0 bottom-full mb-2 w-64 rounded-2xl bg-slate-950/80 px-4 py-3 text-xs leading-5 text-slate-100 shadow-xl backdrop-blur"
        data-open={open}
        id={tipId}
        role="tooltip"
      >
        {PHOTO_INFO}
      </span>
    </span>
  );
}
