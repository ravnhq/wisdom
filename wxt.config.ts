import { readFileSync } from "node:fs";
import tailwindcss from "@tailwindcss/vite";
import { loadEnv } from "vite";
import { defineConfig } from "wxt";

const packageJson = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8"),
) as {
  version: string;
};

const DEFAULT_API_URL = "https://wisdom-api.raul-h-penate.workers.dev";

function apiOrigin(mode: string) {
  const url = loadEnv(mode, process.cwd(), "WXT_").WXT_WALLPAPER_API_URL || DEFAULT_API_URL;
  return `${new URL(url).origin}/*`;
}

export default defineConfig({
  manifestVersion: 3,
  modules: ["@wxt-dev/module-react"],
  manifest: ({ mode, browser }) => ({
    icons: {
      "16": "/icon/16.png",
      "32": "/icon/32.png",
      "48": "/icon/48.png",
      "128": "/icon/128.png",
    },
    name: "Wisdom",
    description: "A calm focus extension with inspirational new tabs and distraction blocking.",
    version: packageJson.version,
    permissions: ["storage", "webNavigation"],
    host_permissions: [apiOrigin(mode)],
    chrome_url_overrides: {
      newtab: "newtab.html",
    },
    ...(browser === "firefox"
      ? {
          browser_specific_settings: {
            gecko: { data_collection_permissions: { required: ["none"] } },
          },
        }
      : { minimum_chrome_version: "117" }),
  }),
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
