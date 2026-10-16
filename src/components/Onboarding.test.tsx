import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Onboarding } from "./Onboarding";

function renderOnboarding(onAccentChange = vi.fn()) {
  const onFinish = vi.fn();
  render(
    <Onboarding
      initialAccent="teal"
      initialTheme="dark"
      onAccentChange={onAccentChange}
      onFinish={onFinish}
    />,
  );
  return onFinish;
}

describe("Onboarding", () => {
  it("asks for the color first, then the name", async () => {
    const user = userEvent.setup();
    renderOnboarding();

    expect(screen.getByRole("heading", { name: /pick a theme/i })).toBeInTheDocument();
    expect(screen.queryByRole("textbox", { name: /^name$/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /continue/i }));
    expect(screen.getByRole("textbox", { name: /^name$/i })).toBeInTheDocument();
  });

  it("saves the trimmed name, chosen color, and chosen theme together", async () => {
    const user = userEvent.setup();
    const onFinish = renderOnboarding();

    await user.click(screen.getByRole("radio", { name: /^purple$/i }));
    expect(document.documentElement.style.getPropertyValue("--accent")).toBe("#BF5AF2");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await user.type(screen.getByRole("textbox", { name: /^name$/i }), " Raul ");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await user.click(screen.getByRole("radio", { name: /^light$/i }));
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    await user.click(screen.getByRole("button", { name: /start focusing/i }));

    expect(onFinish).toHaveBeenCalledWith({ userName: "Raul", accent: "purple", theme: "light" });
  });

  it("accepts a custom hex color as the theme", async () => {
    const user = userEvent.setup();
    const onFinish = renderOnboarding();

    fireEvent.change(screen.getByLabelText(/pick a custom color/i), {
      target: { value: "#1b2a4a" },
    });
    expect(document.documentElement.style.getPropertyValue("--accent")).toBe("#1B2A4A");
    expect(document.documentElement.style.getPropertyValue("--on-accent")).toBe("#FFFFFF");
    await user.click(screen.getByRole("button", { name: /continue/i }));
    await user.type(screen.getByRole("textbox", { name: /^name$/i }), "Raul");
    await user.click(screen.getByRole("button", { name: /continue/i }));
    await user.click(screen.getByRole("button", { name: /start focusing/i }));

    expect(onFinish).toHaveBeenCalledWith({ userName: "Raul", accent: "#1B2A4A", theme: "dark" });
  });

  it("previews each color so the background photo can follow it", async () => {
    const user = userEvent.setup();
    const onAccentChange = vi.fn();
    renderOnboarding(onAccentChange);

    await user.click(screen.getByRole("radio", { name: /^orange$/i }));
    await user.click(screen.getByRole("radio", { name: /^green$/i }));

    expect(onAccentChange.mock.calls).toEqual([["orange"], ["green"]]);
  });

  it("shows Dave a farewell note right after his name", async () => {
    const user = userEvent.setup();
    const onFinish = renderOnboarding();

    await user.click(screen.getByRole("button", { name: /continue/i }));
    await user.type(screen.getByRole("textbox", { name: /^name$/i }), " Dave ");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByRole("heading", { name: /dave\. of course it's you/i })).toBeInTheDocument();
    expect(screen.getByText(/with gratitude, the ravn team/i)).toBeInTheDocument();
    expect(screen.queryByText(/fault/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
    expect(document.body.querySelector('[data-testid="dave-lights"]')).not.toBeNull();

    await user.click(screen.getByRole("button", { name: /let's get to work/i }));
    expect(document.body.querySelector('[data-testid="dave-lights"]')).toBeNull();
    expect(screen.getByRole("heading", { name: /light or dark/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /start focusing/i }));
    expect(onFinish).toHaveBeenCalledWith({ userName: "Dave", accent: "teal", theme: "dark" });
  });

  it("keeps the note for Dave only", async () => {
    const user = userEvent.setup();
    renderOnboarding();

    await user.click(screen.getByRole("button", { name: /continue/i }));
    await user.type(screen.getByRole("textbox", { name: /^name$/i }), "Davey");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.queryByText(/of course it's you/i)).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /light or dark/i })).toBeInTheDocument();
  });

  it("does not leave the name step without a name", async () => {
    const user = userEvent.setup();
    renderOnboarding();

    await user.click(screen.getByRole("button", { name: /continue/i }));
    await user.type(screen.getByRole("textbox", { name: /^name$/i }), "   ");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByRole("textbox", { name: /^name$/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /light or dark/i })).not.toBeInTheDocument();
  });
});
