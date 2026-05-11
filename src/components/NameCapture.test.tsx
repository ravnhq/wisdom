import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NameCapture } from "./NameCapture";

describe("NameCapture", () => {
  it("saves a trimmed name", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<NameCapture onSave={onSave} />);

    await user.type(screen.getByRole("textbox", { name: /^name$/i }), " Raul ");
    await user.click(screen.getByRole("button", { name: /start focusing/i }));

    expect(onSave).toHaveBeenCalledWith("Raul");
  });
});
