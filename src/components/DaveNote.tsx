import { type CSSProperties, useEffect, useState } from "react";
import { Button } from "./Button";

const LIGHT_COUNT = 24;

const LIGHTS = Array.from({ length: LIGHT_COUNT }, (_, i) => {
  const spread = (i * 0.618034) % 1;
  return {
    left: `${Math.round(spread * 100)}%`,
    size: 4 + ((i * 7) % 9),
    duration: 9 + ((i * 5) % 8),
    delay: -((i * 1.7) % 12),
    drift: ((i % 5) - 2) * 18,
    tint: i % 3 === 0 ? "#ffffff" : "var(--accent)",
  };
});

function DaveLights() {
  return (
    <div aria-hidden="true" className="dave-lights" data-testid="dave-lights">
      {LIGHTS.map((light) => (
        <span
          key={light.left + light.delay}
          style={
            {
              left: light.left,
              width: light.size,
              height: light.size,
              background: light.tint,
              animationDuration: `${light.duration}s`,
              animationDelay: `${light.delay}s`,
              "--drift": `${light.drift}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

const MS_PER_WORD = 260;
const FIRST_LINE_MS = 600;
const BEAT_MS = 400;

const HEADING = "Dave. Of course it's you.";
const PARAGRAPHS = [
  "For years you told us to focus on improving, not proving. To own the whole project, not just our piece of it. To show up on the days we didn't feel like it. To be a little earlier, kinder, and smarter than necessary.",
  "You said most of your mentors don't know you exist. Most of the people you mentored won't tell you either, so here it is, from all of us: thank you.",
  "You also said leaders don't want more followers, they want more leaders. Look around RAVN. Mission accomplished.",
  "Retirement is just a new project, and this one is all yours. Go enjoy it, and go train on whatever scares you.",
];
const SIGNATURE = "With gratitude, the RAVN team.";

const words = (text: string) => text.trim().split(/\s+/).length;

export function readingSchedule(lines: readonly string[]) {
  let next = FIRST_LINE_MS;
  const starts = lines.map((line) => {
    const start = next;
    next += words(line) * MS_PER_WORD + BEAT_MS;
    return start;
  });
  return { starts, done: next };
}

const SCHEDULE = readingSchedule([HEADING, ...PARAGRAPHS, SIGNATURE]);
const startOf = (index: number) => SCHEDULE.starts[index] ?? 0;

const at = (delay: number) => ({ "--delay": `${delay}ms` }) as CSSProperties;

export function DaveNote({ onContinue }: { onContinue: () => void }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (revealed) return;
    const reveal = () => setRevealed(true);
    window.addEventListener("pointerdown", reveal);
    window.addEventListener("keydown", reveal);
    return () => {
      window.removeEventListener("pointerdown", reveal);
      window.removeEventListener("keydown", reveal);
    };
  }, [revealed]);

  return (
    <div
      className={`dave-overlay fixed inset-0 z-20 overflow-y-auto bg-black/45 backdrop-blur-[2px] ${
        revealed ? "dave-revealed" : ""
      }`}
      data-revealed={revealed}
    >
      <DaveLights />
      <div className="relative z-10 flex min-h-full items-center justify-center p-6">
        <section
          aria-label="A note for Dave"
          className="dave-note w-full max-w-2xl rounded-3xl border border-line bg-surface/95 p-8 text-ink shadow-2xl backdrop-blur-xl sm:p-12"
        >
          <p className="text-sm uppercase tracking-[0.35em] text-accent">A note for Dave</p>
          <h1 className="dave-line mt-4 text-4xl font-bold tracking-tight" style={at(startOf(0))}>
            {HEADING}
          </h1>
          <div className="mt-6 space-y-5 font-reading text-pretty text-[1.0625rem] leading-8 text-ink">
            {PARAGRAPHS.map((text, index) => (
              <p className="dave-line" key={text} style={at(startOf(index + 1))}>
                {text}
              </p>
            ))}
            <p className="dave-line pt-2 text-right" style={at(startOf(PARAGRAPHS.length + 1))}>
              <span className="dave-signature font-semibold italic">{SIGNATURE}</span>
            </p>
          </div>
          <div className="dave-line" style={at(SCHEDULE.done)}>
            <Button className="mt-8 w-full" onClick={onContinue} variant="primary">
              Let's get to work
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
