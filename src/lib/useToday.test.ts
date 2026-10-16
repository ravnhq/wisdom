import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useToday } from "./useToday";

describe("useToday", () => {
  afterEach(() => vi.useRealTimers());

  it("rolls over at local midnight", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 16, 23, 59, 0));
    const { result } = renderHook(() => useToday());
    expect(result.current).toBe("2026-10-16");

    act(() => {
      vi.advanceTimersByTime(62_000);
    });
    expect(result.current).toBe("2026-10-17");
  });
});
