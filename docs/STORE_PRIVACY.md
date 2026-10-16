# Store Privacy Answers

Use this document when completing Chrome Web Store and Firefox Add-ons review forms. Keep these answers aligned with `wxt.config.ts`, `entrypoints/background.ts`, and `PRIVACY.md`.

## Single Purpose

Wisdom replaces your new tab page with an inspirational view and blocks distracting websites when Focus Mode is enabled, helping you stay calm and productive.

## Chrome Web Store Permission Justifications

### `storage`

Saves the user's preferences on the device with `chrome.storage.local`. That covers display name, Focus Mode state, blocked domains, quote and wallpaper choices, hidden quote IDs, theme, and theme color. None of it is sent anywhere.

### `webNavigation`

Listens to `onBeforeNavigate` so that, while Focus Mode is on, a navigation to a site on the user's own blocklist is redirected to the extension's focus page. The URL is checked on device and is never stored or sent.

### Host permission: `https://wisdom-api.raul-h-penate.workers.dev/*`

Loads the daily background photo and its credit from the extension's own API. The request contains only the theme color name, such as `blue`, and the local date. It contains no user data. Without this permission, the new tab falls back to a bundled wallpaper.

## Remote Code

Select: **No, I am not using remote code.**

If a justification is requested:

Wisdom does not load or execute JavaScript or WebAssembly from remote servers. All extension code is bundled in the submitted package. The Wisdom API returns only a JPEG image and a JSON credit (author name and Pixabay links), which are validated and rendered as text and links.

## Data Usage Disclosures

Recommended conservative selections:

- **Personally identifiable information:** Select if Chrome treats the optional locally stored display name as PII. It is stored locally and never transmitted.
- **Web history:** Select if Chrome requires disclosure because navigated URLs are checked during Focus Mode. Wisdom checks URLs locally against the user's blocklist and does not store browsing history or send URLs anywhere.

Recommended non-selections:

- Health information
- Financial and payment information
- Authentication information
- Personal communications
- Location
- User activity
- Website content

## Required Certifications

Certify all three:

- I do not sell or transfer user data to third parties, outside of the approved use cases.
- I do not use or transfer user data for purposes that are unrelated to my item's single purpose.
- I do not use or transfer user data to determine creditworthiness or for lending purposes.

## Privacy Policy URL

Use:

`https://raw.githubusercontent.com/ravnhq/wisdom/refs/heads/main/PRIVACY.md`

Before submitting a release, verify the URL serves the latest released privacy policy.
