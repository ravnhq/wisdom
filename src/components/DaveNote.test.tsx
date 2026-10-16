import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DaveNote, readingSchedule } from "./DaveNote";

describe("readingSchedule", () => {
  it("waits for the previous line to be read before showing the next", () => {
    const { starts, done } = readingSchedule([
      "one two",
      "a much longer line with eight words",
      "end",
    ]);
    const [first = 0, second = 0, third = 0] = starts;

    expect(second - first).toBeLessThan(third - second);
    expect(done).toBeGreaterThan(third);
  });
});

describe("DaveNote", () => {
  it("shows the whole note at once when Dave presses a key", async () => {
    const user = userEvent.setup();
    render(<DaveNote onContinue={vi.fn()} />);

    const overlay = screen
      .getByRole("region", { name: /a note for dave/i })
      .closest("[data-revealed]");
    expect(overlay).toHaveAttribute("data-revealed", "false");

    await user.keyboard("{Enter}");
    expect(overlay).toHaveAttribute("data-revealed", "true");
  });
});
