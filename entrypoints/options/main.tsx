import { type FormEvent, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Button } from "../../src/components/Button";
import { ThemePicker } from "../../src/components/ThemePicker";
import { ThemeSwatches } from "../../src/components/ThemeSwatches";
import { ThemeToggle } from "../../src/components/ThemeToggle";
import { normalizeBlockedDomains } from "../../src/lib/blocking";
import { quotes } from "../../src/lib/data";
import { updateHiddenQuoteIds } from "../../src/lib/quotes";
import { useAppearance } from "../../src/lib/useAppearance";
import { useSettings } from "../../src/lib/useSettings";
import "../../src/styles/global.css";

function OptionsApp() {
  const { state, setSettings } = useSettings();
  const [draftDomains, setDraftDomains] = useState<string | null>(null);

  const ready = state.status === "ready" ? state.data : null;
  useAppearance(ready);

  useEffect(() => {
    if (state.status === "ready" && draftDomains === null) {
      setDraftDomains(state.data.blockedDomains.join("\n"));
    }
  }, [state, draftDomains]);

  if (state.status === "loading") {
    return <main className="min-h-screen bg-page p-8 text-ink">Loading settings...</main>;
  }

  if (state.status === "error") {
    return <main className="min-h-screen bg-page p-8 text-ink">Settings could not load.</main>;
  }

  const settings = state.data;
  const domainText = draftDomains ?? settings.blockedDomains.join("\n");

  function saveDomains(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void setSettings({
      ...settings,
      blockedDomains: normalizeBlockedDomains(domainText.split(/[\n,]+/)),
    }).then((saved) => setDraftDomains(saved.blockedDomains.join("\n")));
  }

  return (
    <main className="min-h-screen bg-page px-6 py-10 text-ink">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <img alt="Wisdom" className="h-8 w-auto" src="/logo.png" />
              <p className="text-sm uppercase tracking-[0.3em] text-accent">Wisdom</p>
            </div>
            <h1 className="mt-3 text-4xl font-bold">Settings</h1>
            <p className="mt-2 text-ink-muted">
              All settings stay local to this browser extension.
            </p>
          </div>
          <ThemeToggle
            onChange={(nextTheme) => void setSettings({ ...settings, theme: nextTheme })}
            theme={settings.theme}
          />
        </header>

        <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">Profile</h2>
          <label className="mt-4 block text-sm font-medium text-ink-muted" htmlFor="userName">
            Name
          </label>
          <input
            className="mt-2 w-full rounded-xl border border-line bg-page px-4 py-3 text-ink"
            id="userName"
            onChange={(event) => void setSettings({ ...settings, userName: event.target.value })}
            value={settings.userName}
          />
        </section>

        <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">Theme</h2>
          <p className="mt-2 mb-4 text-sm text-ink-muted">
            Pick a theme that fits your style. It recolors all of Wisdom.
          </p>
          <p className="-mt-2 mb-4 text-sm text-ink-muted">
            Background photos follow your theme and change every day. Custom colors use the closest
            preset.
          </p>
          <ThemeSwatches
            onChange={(accent) => void setSettings({ ...settings, accent })}
            value={settings.accent}
          />
          <div className="mt-6">
            <ThemePicker
              onChange={(theme) => void setSettings({ ...settings, theme })}
              value={settings.theme}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">Blocked sites</h2>
          <p className="mt-2 text-sm text-ink-muted">
            One domain per line. Blocking only applies while focus mode is on.
          </p>
          <form onSubmit={saveDomains}>
            <textarea
              className="mt-4 min-h-48 w-full rounded-xl border border-line bg-page px-4 py-3 font-mono text-sm text-ink"
              onChange={(event) => setDraftDomains(event.target.value)}
              value={domainText}
            />
            <Button className="mt-4" type="submit" variant="primary">
              Save blocked sites
            </Button>
          </form>
        </section>

        <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">Quote preferences</h2>
          <div className="mt-4 space-y-3">
            {quotes.map((quote) => (
              <label
                className="flex items-start gap-3 rounded-2xl border border-line p-4"
                key={quote.id}
              >
                <input
                  checked={!settings.hiddenQuoteIds.includes(quote.id)}
                  className="mt-1 h-5 w-5 shrink-0 accent-accent"
                  onChange={(event) =>
                    void setSettings({
                      ...settings,
                      hiddenQuoteIds: updateHiddenQuoteIds(
                        settings.hiddenQuoteIds,
                        quote.id,
                        event.target.checked,
                      ),
                    })
                  }
                  type="checkbox"
                />
                <span>
                  <span className="block font-semibold">{quote.text}</span>
                  <span className="mt-1 block text-sm text-ink-muted">{quote.author}</span>
                </span>
              </label>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(<OptionsApp />);
