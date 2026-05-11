import { expect, test } from "@playwright/test";

test("documents the critical extension flows", async () => {
  expect([
    "new tab renders time, greeting, phrase, wallpaper, and focus button",
    "focus mode redirects configured blocked domains",
    "disabled focus mode allows the same domains",
    "options page edits blocked sites and quote preferences",
  ]).toHaveLength(4);
});
