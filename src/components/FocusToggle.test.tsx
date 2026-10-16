import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { FocusToggle } from "./FocusToggle";

function Harness({ initial = false }: { initial?: boolean }) {
  const [enabled, setEnabled] = useState(initial);
  return <FocusToggle enabled={enabled} onChange={setEnabled} />;
}

describe("FocusToggle", () => {
  it("announces focus mode and shows the focus effects when turned on", async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness />);

    await user.click(screen.getByRole("button", { name: /start focus mode/i }));

    expect(screen.getByRole("status")).toHaveTextContent(/focus mode on/i);
    expect(container.querySelector(".focus-burst")).not.toBeNull();
    expect(container.querySelector(".focus-vignette")).not.toBeNull();
    expect(screen.getByRole("button", { name: /focus mode on/i })).toHaveClass("focus-breathe");
  });

  it("clears every effect when turned off", async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness />);

    await user.click(screen.getByRole("button", { name: /start focus mode/i }));
    await user.click(screen.getByRole("button", { name: /focus mode on/i }));

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(container.querySelector(".focus-burst, .focus-vignette")).toBeNull();
  });

  it("keeps the calm vignette without a burst when already on at load", () => {
    const { container } = render(<Harness initial />);
    expect(container.querySelector(".focus-vignette")).not.toBeNull();
    expect(container.querySelector(".focus-burst")).toBeNull();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
