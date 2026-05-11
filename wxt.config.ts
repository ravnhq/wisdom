import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

const distractionHosts = [
  "*://*.youtube.com/*",
  "*://*.instagram.com/*",
  "*://*.linkedin.com/*",
  "*://*.facebook.com/*",
  "*://*.x.com/*",
  "*://*.twitter.com/*",
  "*://*.tiktok.com/*",
  "*://*.reddit.com/*",
];

export default defineConfig({
  manifestVersion: 3,
  modules: ["@wxt-dev/module-react"],
  manifest: {
    icons: {
      "128": "/logo.png",
    },
    name: "Wisdom",
    description: "A calm focus extension with inspirational new tabs and distraction blocking.",
    version: "0.1.0",
    permissions: ["storage", "tabs", "webNavigation"],
    host_permissions: distractionHosts,
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
