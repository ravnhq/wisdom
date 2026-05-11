# Testing Strategy Standards

## Test Pyramid

- Use Vitest for fast unit tests around pure logic and typed utilities.
- Use React Testing Library for component behavior and user-visible UI states.
- Use Playwright for browser-level extension flows that cannot be trusted through unit tests alone.
- Keep tests focused on behavior, not implementation details.

## Unit Tests

- Test blocked-site URL normalization and domain matching thoroughly.
- Test quote selection, hidden quote filtering, and "show this quote in the future" behavior.
- Test Zod validation for phrase and wallpaper JSON.
- Test storage defaults, serialization, and error handling.

## Component Tests

- Test focus-mode toggle behavior.
- Test quote rendering, next quote interactions, and explanation popovers.
- Test empty and error states for settings and data loading.
- Prefer accessible queries such as role, label, and visible text.

## Playwright Tests

- Cover new-tab rendering with time, user name, phrase, wallpaper, and focus button.
- Cover enabling focus mode and redirecting a blocked site to the blocked page.
- Cover allowing blocked sites when focus mode is disabled.
- Cover essential options-page settings for blocked sites and quote preferences.

## CI Expectations

- CI must run typecheck, Biome checks, unit tests, Playwright tests, and WXT builds.
- Keep Playwright tests small and stable; use them for critical extension flows only.
- Do not block MVP progress on exhaustive visual regression testing.
