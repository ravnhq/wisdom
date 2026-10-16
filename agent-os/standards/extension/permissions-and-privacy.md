# Permissions And Privacy Standards

## Permission Discipline

- Request the minimum permissions needed for the MVP.
- The extension requests `storage`, `webNavigation`, and host access to the Wisdom API origin only.
- Blocking works without host permissions. `webNavigation` sees the URL and `tabs.update` redirects to an extension page.
- Never add `tabs` or `<all_urls>`. They trigger broad install warnings and in-depth store review.
- The API origin in the manifest comes from `WXT_WALLPAPER_API_URL`. Release builds must not have a local `.env`, so they only request the production origin.
- Document why each permission exists before shipping, in `PRIVACY.md` and the store listing.

## Privacy

- No account, analytics service, or remote tracking.
- The only backend is the Wisdom API. The extension sends it nothing but the theme color name (`?palette=`).
- The API must not log or store IP addresses. It uses them only for per-minute rate limiting.
- Do not collect browsing history beyond what is required locally to identify blocked-site navigation.
- Keep user settings local to browser extension storage unless sync becomes an explicit future feature.
- Do not send quote preferences, blocked sites, or user names to any external service.

## Assets

- Use bundled wallpapers or free-to-use images with clear licensing.
- Daily photos come from Pixabay through the Wisdom API, with author and Pixabay credit shown in the footer.
- When the API is unavailable, fall back to the bundled wallpaper.
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
