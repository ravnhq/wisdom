# Extension Architecture Standards

## Framework

- Use WXT as the extension framework for Chrome, Chromium-based browsers, and Firefox.
- Target Manifest V3 unless a browser-specific limitation requires a documented exception.
- Use React for extension UI surfaces: new tab page, blocked-site page, options page, and any popup UI.
- Use webextension-polyfill for consistent Promise-based browser APIs across supported browsers.

## Entry Points

- Keep each WXT entrypoint focused on one responsibility.
- The new-tab entrypoint owns the focused dashboard experience.
- The blocked-page entrypoint owns the calm redirect experience for blocked sites.
- The options entrypoint owns settings such as user name, blocked sites, quote preferences, and future configuration.
- Background logic should orchestrate extension behavior, not contain UI-specific code.

## Blocking Model

- Block sites only while focus mode is active.
- Normalize URLs before matching: protocol, hostname, subdomains, trailing slashes, and common `www` variants must be handled predictably.
- Keep matching logic in a pure utility with unit tests.
- Prefer explicit domain matching over broad string matching to avoid accidental overblocking.
- Document the default blocked domains and keep them easy to change.

## Storage

- Create a typed storage layer for all extension storage access.
- Store focus mode, user name, blocked sites, quote preferences, and hidden quote IDs through that layer.
- Provide safe defaults for missing settings.
- Avoid duplicating persisted state across multiple keys unless there is a clear migration reason.

## Data Flow

- Validate bundled phrase and wallpaper data before use.
- Keep quote selection deterministic enough to test, but varied enough for a good user experience.
- Do not let UI components directly parse raw JSON records.
- Keep extension permissions and background behavior aligned with the privacy standard.
