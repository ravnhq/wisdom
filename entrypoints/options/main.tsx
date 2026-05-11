import { type FormEvent, useState } from "react";
import { createRoot } from "react-dom/client";
import { Button } from "../../src/components/Button";
import { normalizeBlockedDomains } from "../../src/lib/blocking";
import { quotes } from "../../src/lib/data";
import { updateHiddenQuoteIds } from "../../src/lib/quotes";
import { useSettings } from "../../src/lib/useSettings";
import "../../src/styles/global.css";

function OptionsApp() {
  const { state, setSettings } = useSettings();
  const [draftDomains, setDraftDomains] = useState("");

  if (state.status === "loading") {
    return (
      <main className="min-h-screen bg-slate-100 p-8 text-slate-950">Loading settings...</main>
    );
  }

  if (state.status === "error") {
    return (
      <main className="min-h-screen bg-slate-100 p-8 text-slate-950">Settings could not load.</main>
    );
  }

  const settings = state.data;
  const domainText = draftDomains || settings.blockedDomains.join("\n");

  function saveDomains(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void setSettings({
      ...settings,
      blockedDomains: normalizeBlockedDomains(domainText.split(/[\n,]+/)),
    }).then((saved) => setDraftDomains(saved.blockedDomains.join("\n")));
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-4xl space-y-8">
        <header>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Wisdom</p>
          <h1 className="mt-3 text-4xl font-bold">Settings</h1>
          <p className="mt-2 text-slate-600">All settings stay local to this browser extension.</p>
        </header>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">Profile</h2>
          <label className="mt-4 block text-sm font-medium" htmlFor="userName">
            Name
          </label>
          <input
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            id="userName"
            onChange={(event) => void setSettings({ ...settings, userName: event.target.value })}
            value={settings.userName}
          />
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">Blocked sites</h2>
          <p className="mt-2 text-sm text-slate-600">
            One domain per line. Blocking only applies while focus mode is on.
          </p>
          <form onSubmit={saveDomains}>
            <textarea
              className="mt-4 min-h-48 w-full rounded-xl border border-slate-300 px-4 py-3 font-mono text-sm"
              onChange={(event) => setDraftDomains(event.target.value)}
              value={domainText}
            />
            <Button className="mt-4" type="submit" variant="primary">
              Save blocked sites
            </Button>
          </form>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">Quote preferences</h2>
          <div className="mt-4 space-y-3">
            {quotes.map((quote) => (
              <label
                className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4"
                key={quote.id}
              >
                <input
                  checked={!settings.hiddenQuoteIds.includes(quote.id)}
                  className="mt-1 h-5 w-5 accent-amber-700"
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
                  <span className="mt-1 block text-sm text-slate-600">{quote.author}</span>
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
