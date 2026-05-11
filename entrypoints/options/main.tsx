import { type FormEvent, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Button } from "../../src/components/Button";
import { ThemeToggle } from "../../src/components/ThemeToggle";
import { normalizeBlockedDomains } from "../../src/lib/blocking";
import { quotes } from "../../src/lib/data";
import { updateHiddenQuoteIds } from "../../src/lib/quotes";
import { useSettings } from "../../src/lib/useSettings";
import "../../src/styles/global.css";

function OptionsApp() {
  const { state, setSettings } = useSettings();
  const [draftDomains, setDraftDomains] = useState("");

  const theme = state.status === "ready" ? state.data.theme : "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme !== "light");
  }, [theme]);

  if (state.status === "loading") {
    return (
      <main className="min-h-screen bg-[#FAF3E0] p-8 text-[#0A3530] dark:bg-[#071C1A] dark:text-[#FAF3E0]">
        Loading settings...
      </main>
    );
  }

  if (state.status === "error") {
    return (
      <main className="min-h-screen bg-[#FAF3E0] p-8 text-[#0A3530] dark:bg-[#071C1A] dark:text-[#FAF3E0]">
        Settings could not load.
      </main>
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
    <main className="min-h-screen bg-[#FAF3E0] px-6 py-10 text-[#0A3530] dark:bg-[#071C1A] dark:text-[#FAF3E0]">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <img alt="Wisdom" className="h-8 w-auto" src="/logo.png" />
              <p className="text-sm uppercase tracking-[0.3em] text-[#008F7A] dark:text-[#00C9A7]">
                Wisdom
              </p>
            </div>
            <h1 className="mt-3 text-4xl font-bold">Settings</h1>
            <p className="mt-2 text-[#3D7570] dark:text-[#8ECCC4]">
              All settings stay local to this browser extension.
            </p>
          </div>
          <ThemeToggle
            onChange={(nextTheme) => void setSettings({ ...settings, theme: nextTheme })}
            theme={settings.theme}
          />
        </header>

        <section className="rounded-3xl border border-[#A8D8D0] bg-white p-6 shadow-sm dark:border-[rgba(0,201,167,0.18)] dark:bg-[#0D2A28]">
          <h2 className="text-2xl font-semibold">Profile</h2>
          <label
            className="mt-4 block text-sm font-medium text-[#3D7570] dark:text-[#8ECCC4]"
            htmlFor="userName"
          >
            Name
          </label>
          <input
            className="mt-2 w-full rounded-xl border border-[#A8D8D0] bg-white px-4 py-3 text-[#0A3530] dark:border-[rgba(0,201,167,0.25)] dark:bg-[#071C1A] dark:text-[#FAF3E0]"
            id="userName"
            onChange={(event) => void setSettings({ ...settings, userName: event.target.value })}
            value={settings.userName}
          />
        </section>

        <section className="rounded-3xl border border-[#A8D8D0] bg-white p-6 shadow-sm dark:border-[rgba(0,201,167,0.18)] dark:bg-[#0D2A28]">
          <h2 className="text-2xl font-semibold">Blocked sites</h2>
          <p className="mt-2 text-sm text-[#3D7570] dark:text-[#8ECCC4]">
            One domain per line. Blocking only applies while focus mode is on.
          </p>
          <form onSubmit={saveDomains}>
            <textarea
              className="mt-4 min-h-48 w-full rounded-xl border border-[#A8D8D0] bg-white px-4 py-3 font-mono text-sm text-[#0A3530] dark:border-[rgba(0,201,167,0.25)] dark:bg-[#071C1A] dark:text-[#FAF3E0]"
              onChange={(event) => setDraftDomains(event.target.value)}
              value={domainText}
            />
            <Button className="mt-4" type="submit" variant="primary">
              Save blocked sites
            </Button>
          </form>
        </section>

        <section className="rounded-3xl border border-[#A8D8D0] bg-white p-6 shadow-sm dark:border-[rgba(0,201,167,0.18)] dark:bg-[#0D2A28]">
          <h2 className="text-2xl font-semibold">Quote preferences</h2>
          <div className="mt-4 space-y-3">
            {quotes.map((quote) => (
              <label
                className="flex items-start gap-3 rounded-2xl border border-[#A8D8D0] p-4 dark:border-[rgba(0,201,167,0.18)]"
                key={quote.id}
              >
                <input
                  checked={!settings.hiddenQuoteIds.includes(quote.id)}
                  className="mt-1 h-5 w-5 accent-teal-600 dark:accent-teal-400"
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
                  <span className="mt-1 block text-sm text-[#3D7570] dark:text-[#8ECCC4]">
                    {quote.author}
                  </span>
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
