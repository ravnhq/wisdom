<p align="center">
  <img src="public/logo.png" alt="Wisdom" width="96" />
</p>

<h1 align="center">Wisdom</h1>

<p align="center">
  A browser extension that replaces your new tab with something worth reading,<br />
  and quietly blocks the sites that pull you away from the work that matters.
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-00C9A7?style=flat-square" alt="MIT License" /></a>
  <img src="https://img.shields.io/badge/manifest-v3-0A3530?style=flat-square" alt="Manifest V3" />
  <img src="https://img.shields.io/badge/built%20with-WXT-0A3530?style=flat-square" alt="Built with WXT" />
</p>

---

Every time you open a new tab, Wisdom shows you an inspirational quote — written by real people, with a short explanation of why it matters. Turn on Focus Mode and it will silently redirect any site on your blocked list before the page even loads. Your name, theme, blocked sites, and quote preferences all stay in your browser. Nothing leaves your machine.

## Features

- **New tab quotes** — a rotating set of quotes, shown randomly, each with an explanation and author
- **Focus Mode** — toggle-based distraction blocking; redirects blocked sites to a calm interstitial
- **Blocked site list** — add any domain from the settings page; changes take effect immediately
- **Light and dark theme** — follows your preference, persisted across sessions
- **Quote preferences** — hide quotes you don't want to see again from the settings page

## Getting started

```bash
pnpm install
pnpm dev
```

Open a new tab. Enter your name. That's it.

To enable blocking, click the toggle in the bottom-left corner of the new tab page. To manage blocked sites or hide quotes, open Settings via the gear icon.

## Building

```bash
# Chrome, Edge, Brave, Arc
pnpm build

# Firefox
pnpm build:firefox
```

## Installing the unpacked extension

**Chrome / Edge / Brave / Arc**

1. Run `pnpm build`
2. Go to `chrome://extensions`
3. Enable Developer Mode
4. Click "Load unpacked" and select `.output/chrome-mv3`

**Firefox**

1. Run `pnpm build:firefox`
2. Go to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select `.output/firefox-mv3/manifest.json`

## Running tests

```bash
pnpm test
```

## Tech

- [WXT](https://wxt.dev) — browser extension framework
- [React](https://react.dev) — UI
- [Tailwind CSS v4](https://tailwindcss.com) — styling
- [Zod](https://zod.dev) — settings schema validation
- [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) — unit and component tests

## Contributing

Bug reports and pull requests are welcome. For significant changes, open an issue first to discuss what you'd like to change.

## License

MIT — Copyright © 2026 [RAVN](https://ravn.co)
