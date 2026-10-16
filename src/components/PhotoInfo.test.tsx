import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PHOTO_INFO, PhotoInfo } from "./PhotoInfo";

describe("PhotoInfo", () => {
  it("explains that photos change every day, on click and to screen readers", async () => {
    const user = userEvent.setup();
    render(<PhotoInfo />);

    const button = screen.getByRole("button", { name: /about this photo/i });
    expect(button).toHaveAccessibleDescription(PHOTO_INFO);
    expect(screen.getByRole("tooltip")).toHaveAttribute("data-open", "false");

    await user.click(button);
    expect(screen.getByRole("tooltip")).toHaveAttribute("data-open", "true");

    await user.keyboard("{Escape}");
    expect(screen.getByRole("tooltip")).toHaveAttribute("data-open", "false");
  });
});
