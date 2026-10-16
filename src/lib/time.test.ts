import { describe, expect, it } from "vitest";
import { localDay, msUntilNextDay } from "./time";

describe("local day", () => {
  it("uses the local calendar date, not UTC", () => {
    expect(localDay(new Date(2026, 9, 16, 23, 59))).toBe("2026-10-16");
    expect(localDay(new Date(2026, 9, 17, 0, 0))).toBe("2026-10-17");
  });

  it("counts down to the next local midnight", () => {
    expect(msUntilNextDay(new Date(2026, 9, 16, 23, 59, 30))).toBe(30_000);
  });
});
