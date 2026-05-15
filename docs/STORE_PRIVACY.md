# Store Privacy Answers

Use this document when completing Chrome Web Store and Firefox Add-ons review forms. Keep these answers aligned with `wxt.config.ts`, `entrypoints/background.ts`, and `PRIVACY.md`.

## Single Purpose

Wisdom replaces your new tab page with an inspirational view and blocks distracting websites when Focus Mode is enabled, helping you stay calm and productive.

## Chrome Web Store Permission Justifications

### `storage`

The storage permission saves user preferences locally on the device via `chrome.storage.local`. This includes the user's display name, Focus Mode state, blocked domain list, current wallpaper and quote selections, hidden quote IDs, and theme.

No data is sent to or stored on external servers.

### `tabs`

The tabs permission is used solely to redirect the active tab to the extension's built-in blocked page when a user navigates to a blocklisted site while Focus Mode is on.

No tab URLs, titles, or history are read or stored beyond what is needed for this redirect.

### `webNavigation`

The webNavigation permission listens to `onBeforeNavigate` events to intercept top-level navigations before they complete. When Focus Mode is enabled, each URL is checked locally against the user's blocklist. If matched, the tab is redirected to the extension's blocked page.

This is essential for the core distraction-blocking feature.

### Host Permissions

The extension monitors navigated URLs in real time to detect when a user visits a site on their personal blocklist during Focus Mode. This check is performed entirely on-device against the user's blocklist stored in `chrome.storage.local`.

No browsing data is collected, transmitted, or stored remotely.

## Remote Code

Select: **No, I am not using remote code.**

If a justification is requested:

Wisdom does not load or execute JavaScript or WebAssembly from remote servers. All extension code is bundled in the submitted package.

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
