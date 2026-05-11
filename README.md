<p align="center">
  <img src="public/logo.png" alt="Wisdom logo" width="120" />
</p>

# Wisdom

A calm focus browser extension with an inspirational new tab page and distraction blocking.

## Run Locally

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
pnpm build:firefox
```

## Install In Browser

### Chrome, Edge, Brave, Arc

1. Run `pnpm build`.
2. Open `chrome://extensions`.
3. Turn on Developer Mode.
4. Click Load unpacked.
5. Select `.output/chrome-mv3`.

### Firefox

1. Run `pnpm build:firefox`.
2. Open `about:debugging#/runtime/this-firefox`.
3. Click Load Temporary Add-on.
4. Select `.output/firefox-mv3/manifest.json`.

## Use

Open a new tab, enter your name, and turn on Focus Mode. Edit blocked sites and quote preferences from the settings button.
