import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { quotes } from "../lib/data";
import { QuoteCard } from "./QuoteCard";

describe("QuoteCard", () => {
  it("shows quote controls and explanation", async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();
    const onShowInFutureChange = vi.fn();

    render(
      <QuoteCard
        onNext={onNext}
        onShowInFutureChange={onShowInFutureChange}
        quote={quotes[0]}
        showInFuture
      />,
    );

    await user.click(screen.getByRole("button", { name: /next quote/i }));
    expect(onNext).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: /show phrase explanation/i }));
    expect(screen.getByText(quotes[0].explanation)).toBeInTheDocument();
  });
});
