# Permissions And Privacy Standards

## Permission Discipline

- Request the minimum permissions needed for the MVP.
- Prefer `storage` and targeted host permissions required for blocking behavior.
- Avoid broad permissions unless the feature cannot work without them.
- Document why each permission exists before shipping.

## Privacy

- The MVP should not require a backend, account, analytics service, or remote tracking.
- Do not collect browsing history beyond what is required locally to identify blocked-site navigation.
- Keep user settings local to browser extension storage unless sync becomes an explicit future feature.
- Do not send quote preferences, blocked sites, or user names to any external service.

## Assets

- Use bundled wallpapers or free-to-use images with clear licensing.
- Avoid remote image loading in the MVP unless privacy, reliability, and licensing are explicitly handled.
- Keep asset metadata local and auditable.

## User Trust

- Make focus mode state obvious.
- Make blocked-site behavior predictable and reversible.
- Provide clear settings for changing blocked sites and quote preferences.
- Avoid dark patterns; the extension should help users focus without trapping them.

## Browser Stores

- Keep store descriptions accurate about permissions and local-only behavior.
- Avoid claims that imply medical, productivity, or mental health guarantees.
- Verify Chrome Web Store and Firefox Add-ons requirements before release packaging.
