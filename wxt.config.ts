import { readFileSync } from "node:fs";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

const packageJson = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8"),
) as {
  version: string;
};

export default defineConfig({
  manifestVersion: 3,
  modules: ["@wxt-dev/module-react"],
  manifest: {
    icons: {
      "128": "/logo.png",
    },
    name: "Wisdom",
    description: "A calm focus extension with inspirational new tabs and distraction blocking.",
    version: packageJson.version,
    permissions: ["storage", "tabs", "webNavigation"],
    host_permissions: ["<all_urls>"],
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
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
