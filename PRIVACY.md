# Wisdom - Privacy Policy

_Last updated: October 16, 2026_

Wisdom is a browser extension for Chrome, Chromium-based browsers, and Firefox. It replaces your new tab page with an inspirational view and blocks distracting websites during Focus Mode.

## Data We Store

Wisdom stores the following data **locally on your device** using browser extension storage:

- Optional display name
- Focus Mode state
- List of blocked domains
- Wallpaper and quote preferences
- Hidden quote IDs
- Theme preference and theme color

To open new tabs without a flash of the wrong colors, Wisdom also keeps a copy of your theme colors and the latest photo credit in the extension's local storage on your device.

Your name, blocked domains, quote preferences, and browsing activity never leave your device.

## Navigation Checks

When Focus Mode is enabled, Wisdom checks top-level navigation URLs against your local blocked-domain list. If a URL matches, the active tab is redirected to Wisdom's built-in blocked page.

Wisdom does not store your browsing history, collect page content, or send navigated URLs to any server.

## Network Requests

To show the daily background photo, the new tab page requests a photo from the Wisdom API (`wisdom-api.raul-h-penate.workers.dev`). The only information in that request is the name of your theme color, such as `blue`, and today's date, so the API can return that day's matching photo. Each photo is downloaded at most once a day.

As with any web request, the API server sees your IP address. It uses the IP address only to limit how many requests one address can make per minute. It does not store or log IP addresses, and it does not set cookies or identify you.

When the API itself fails, it sends an error report to [Sentry](https://sentry.io) so we can fix it. These reports never include IP addresses, request headers, cookies, or anything about you.

The photos come from [Pixabay](https://pixabay.com) and are served by the Wisdom API. Your browser does not contact Pixabay directly.

## Data Sharing

We do not sell, share, or transfer any user data to third parties under any circumstances.

## Remote Code

This extension does not load or execute any remote code. All logic is bundled locally within the extension package. The Wisdom API returns only an image and its credit text.

## Permissions

- `storage` saves your settings on your device.
- `webNavigation` detects when a tab starts loading a site on your blocked list, so Focus Mode can show the focus page instead.
- Host access to `wisdom-api.raul-h-penate.workers.dev` loads the daily photo and its credit.

## Contact

For privacy-related questions, contact: dev.raulpenate@gmail.com
