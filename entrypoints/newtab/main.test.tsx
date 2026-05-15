import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { quotes } from "../../src/lib/data";
import { defaultSettings } from "../../src/lib/storage";

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
    },
    runtime: { openOptionsPage: vi.fn() },
  },
}));

const { NewTabApp } = await import("./main");

describe("NewTabApp quote navigation", () => {
  beforeEach(() => {
    store.clear();
    const seed = {
      ...defaultSettings,
      userName: "Tester",
      currentQuoteId: quotes[0].id,
      hiddenQuoteIds: [],
    };
    for (const [k, v] of Object.entries(seed)) store.set(k, v);
  });

  it("Next quote button advances to a different quote", async () => {
    const user = userEvent.setup();
    render(<NewTabApp />);

    await waitFor(() => screen.getByText(quotes[0].text));

    await user.click(screen.getByRole("button", { name: /next quote/i }));

    // The original quote should be gone and some other quote should appear.
    await waitFor(() => expect(screen.queryByText(quotes[0].text)).not.toBeInTheDocument());
  });

  it("toggling Show this quote in future checkbox stays on the same quote", async () => {
    const user = userEvent.setup();
    render(<NewTabApp />);

    await waitFor(() => screen.getByText(quotes[0].text));

    const checkbox = screen.getByRole("checkbox", { name: /show this quote in future/i });
    expect(checkbox).toBeChecked();

    // Uncheck — hide this quote from future
    await user.click(checkbox);
    await waitFor(() => expect(checkbox).not.toBeChecked());

    // Quote must still be visible — checkbox should NOT navigate
    expect(screen.getByText(quotes[0].text)).toBeInTheDocument();

    // Re-check — show again
    await user.click(checkbox);
    await waitFor(() => expect(checkbox).toBeChecked());
    expect(screen.getByText(quotes[0].text)).toBeInTheDocument();
  });

  it("Next quote skips quotes that are hidden", async () => {
    store.set("hiddenQuoteIds", [quotes[1].id]);

    const user = userEvent.setup();
    render(<NewTabApp />);

    await waitFor(() => screen.getByText(quotes[0].text));

    await user.click(screen.getByRole("button", { name: /next quote/i }));

    // The hidden quote must never appear after clicking Next.
    await waitFor(() => expect(screen.queryByText(quotes[0].text)).not.toBeInTheDocument());
    expect(screen.queryByText(quotes[1].text)).not.toBeInTheDocument();
  });

  it("does not show a hidden quote when the page loads fresh", async () => {
    // Simulate the user having hidden quotes[0] in a previous session while it
    // was the saved currentQuoteId — opening a new tab must advance past it.
    store.set("currentQuoteId", quotes[0].id);
    store.set("hiddenQuoteIds", [quotes[0].id]);

    render(<NewTabApp />);

    await waitFor(() => expect(screen.queryByText(quotes[0].text)).not.toBeInTheDocument());
  });
});
