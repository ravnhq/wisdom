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
  manifest: ({ mode }) => ({
    icons: {
      "128": "/logo.png",
    },
    name: "Wisdom",
    description: "A calm focus extension with inspirational new tabs and distraction blocking.",
    version: packageJson.version,
    permissions: ["storage", "webNavigation"],
    host_permissions: [apiOrigin(mode)],
    chrome_url_overrides: {
      newtab: "newtab.html",
    },
    options_ui: {
      page: "options.html",
      open_in_tab: true,
    },
    browser_specific_settings: {
      gecko: {
        data_collection_permissions: {
          required: ["none"],
        },
      },
    },
  }),
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
