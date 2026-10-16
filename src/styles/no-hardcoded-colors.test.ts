import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const THEMED_DIRS = ["src/components", "entrypoints/newtab", "entrypoints/options"];
const FORBIDDEN = [
  /#(008F7A|00C9A7|0D2A28|8ECCC4|3D7570|A8D8D0|071C1A|FAF3E0|0A3530|F0F9F7|0A2422)\b/i,
  /rgba\(0,\s*201,\s*167/i,
  /dark:(bg|text|border)-\[/,
];

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

describe("themed UI", () => {
  it("reads colors from theme tokens instead of hard-coded teal", () => {
    const offenders = THEMED_DIRS.flatMap(sourceFiles).flatMap((file) =>
      readFileSync(file, "utf8")
        .split("\n")
        .flatMap((line, index) =>
          FORBIDDEN.some((pattern) => pattern.test(line)) ? [`${file}:${index + 1}`] : [],
        ),
    );
    expect(offenders).toEqual([]);
  });
});
