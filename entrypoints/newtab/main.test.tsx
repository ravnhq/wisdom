import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { quotes } from "../../src/lib/data";
import { defaultSettings } from "../../src/lib/storage";
import { localDay } from "../../src/lib/time";

const store = new Map<string, unknown>();

vi.mock("../../src/lib/browser", () => ({
  browser: {
    storage: {
      local: {
        get: vi.fn(async (defaults: Record<string, unknown>) => ({
          ...defaults,
          ...Object.fromEntries(store),
        })),
        set: vi.fn(async (value: Record<string, unknown>) => {
          for (const [key, item] of Object.entries(value)) store.set(key, item);
        }),
      },
      onChanged: { addListener: vi.fn(), removeListener: vi.fn() },
    },
    runtime: { openOptionsPage: vi.fn() },
  },
}));

vi.stubGlobal(
  "fetch",
  vi.fn(async () => new Response(null, { status: 503 })),
);

const { NewTabApp } = await import("./main");

const quoteText = (text: string) => (_: string, element: Element | null) =>
  element?.tagName === "BLOCKQUOTE" && element.textContent === text;

describe("NewTabApp quote navigation", () => {
  beforeEach(() => {
    store.clear();
    const seed = {
      ...defaultSettings,
      userName: "Tester",
      currentQuoteId: quotes[0].id,
      quoteDay: localDay(),
      hiddenQuoteIds: [],
    };
    for (const [k, v] of Object.entries(seed)) store.set(k, v);
  });

  it("Next quote button advances to a different quote", async () => {
    const user = userEvent.setup();
    render(<NewTabApp />);

    await waitFor(() => screen.getByText(quoteText(quotes[0].text)));

    await user.click(screen.getByRole("button", { name: /next quote/i }));

    // The original quote should be gone and some other quote should appear.
    await waitFor(() =>
      expect(screen.queryByText(quoteText(quotes[0].text))).not.toBeInTheDocument(),
    );
  });

  it("opens calmly and only animates the quote after Next quote", async () => {
    const user = userEvent.setup();
    render(<NewTabApp />);

    const first = await screen.findByText(quoteText(quotes[0].text));
    expect(first.closest("figure")).not.toHaveClass("quote-enter");
    expect(document.querySelector(".quote-phrase")).toBeNull();

    await user.click(screen.getByRole("button", { name: /next quote/i }));
    await waitFor(() => expect(document.querySelector("figure")).toHaveClass("quote-enter"));
  });

  it("toggling Show this quote in future checkbox stays on the same quote", async () => {
    const user = userEvent.setup();
    render(<NewTabApp />);

    await waitFor(() => screen.getByText(quoteText(quotes[0].text)));

    const checkbox = screen.getByRole("checkbox", { name: /show this quote in future/i });
    expect(checkbox).toBeChecked();

    // Uncheck — hide this quote from future
    await user.click(checkbox);
    await waitFor(() => expect(checkbox).not.toBeChecked());

    // Quote must still be visible — checkbox should NOT navigate
    expect(screen.getByText(quoteText(quotes[0].text))).toBeInTheDocument();

    // Re-check — show again
    await user.click(checkbox);
    await waitFor(() => expect(checkbox).toBeChecked());
    expect(screen.getByText(quoteText(quotes[0].text))).toBeInTheDocument();
  });

  it("Next quote skips quotes that are hidden", async () => {
    store.set("hiddenQuoteIds", [quotes[1].id]);

    const user = userEvent.setup();
    render(<NewTabApp />);

    await waitFor(() => screen.getByText(quoteText(quotes[0].text)));

    await user.click(screen.getByRole("button", { name: /next quote/i }));

    // The hidden quote must never appear after clicking Next.
    await waitFor(() =>
      expect(screen.queryByText(quoteText(quotes[0].text))).not.toBeInTheDocument(),
    );
    expect(screen.queryByText(quoteText(quotes[1].text))).not.toBeInTheDocument();
  });

  it("does not show a hidden quote when the page loads fresh", async () => {
    // Simulate the user having hidden quotes[0] in a previous session while it
    // was the saved currentQuoteId — opening a new tab must advance past it.
    store.set("currentQuoteId", quotes[0].id);
    store.set("hiddenQuoteIds", [quotes[0].id]);

    render(<NewTabApp />);

    await waitFor(() =>
      expect(screen.queryByText(quoteText(quotes[0].text))).not.toBeInTheDocument(),
    );
  });
});

describe("NewTabApp palette menu", () => {
  beforeEach(() => {
    store.clear();
    for (const [k, v] of Object.entries({ ...defaultSettings, userName: "Tester" })) {
      store.set(k, v);
    }
    vi.mocked(fetch).mockClear();
  });

  it("changes the theme color next to settings and asks for the matching photo", async () => {
    const user = userEvent.setup();
    render(<NewTabApp />);

    const trigger = await screen.findByRole("button", { name: /change theme color/i });
    const menu = document.getElementById(trigger.getAttribute("popovertarget") ?? "");
    expect(menu).toHaveAttribute("popover");
    if (!menu) return;

    await user.click(within(menu).getByRole("radio", { name: /^orange$/i, hidden: true }));

    await waitFor(() => expect(store.get("accent")).toBe("orange"));
    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/image/metadata?palette=orange"),
        expect.anything(),
      ),
    );
  });
});

describe("NewTabApp daily rotation", () => {
  beforeEach(() => {
    store.clear();
    vi.mocked(fetch).mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function seed(quoteDay: string) {
    const settings = {
      ...defaultSettings,
      userName: "Tester",
      currentQuoteId: quotes[0].id,
      quoteDay,
    };
    for (const [k, v] of Object.entries(settings)) store.set(k, v);
  }

  it("shows a new quote and asks for today's photo on the first open of a new day", async () => {
    seed("2000-01-01");
    render(<NewTabApp />);

    await waitFor(() => expect(store.get("quoteDay")).toBe(localDay()));
    expect(store.get("currentQuoteId")).not.toBe(quotes[0].id);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`&day=${localDay()}`),
      expect.anything(),
    );
  });

  it("changes the quote and the photo at local midnight without reopening the tab", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date(2026, 9, 16, 23, 59, 58));
    seed("2026-10-16");
    render(<NewTabApp />);
    await screen.findByText(quoteText(quotes[0].text));

    await act(async () => {
      vi.advanceTimersByTime(3_000);
    });

    await waitFor(() => expect(store.get("quoteDay")).toBe("2026-10-17"));
    expect(store.get("currentQuoteId")).not.toBe(quotes[0].id);
    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("&day=2026-10-17"),
        expect.anything(),
      ),
    );
  });
});
