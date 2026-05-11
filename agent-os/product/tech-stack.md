# Tech Stack

## Frontend

- WXT for the cross-browser web extension framework.
- React for extension UI surfaces, including the new tab page, blocked-site page, options page, and reusable components.
- TypeScript for application code and shared types.
- pnpm for package management and project scripts.

## Styling

- Tailwind CSS for the primary styling system.
- shadcn/ui for accessible, high-quality React component foundations that can be customized inside the project.
- Lucide React for icons, including the phrase explanation question-mark icon.
- Sass only where it adds value for reusable or complex styling that Tailwind does not express cleanly.

## Extension APIs

- WXT browser APIs and extension entrypoints for cross-browser development.
- webextension-polyfill for a stable Promise-based browser API wrapper across Chrome, Chromium-based browsers, and Firefox.
- Browser extension storage for focus mode state, user name, blocked sites, quote preferences, and lightweight user settings.

## Data

- Bundled JSON files for phrases, phrase explanations, quote metadata, and wallpaper metadata.
- Zod for validating JSON data shape so invalid phrase or wallpaper records fail early.
- date-fns for time and date formatting when native browser APIs are not enough.

## Backend

N/A for MVP.

## Database

N/A for MVP.

## Testing

- Vitest for pure logic, storage helpers, quote selection, JSON validation, and blocked-site matching utilities.
- React Testing Library for component behavior and UI states.
- Playwright for browser-level extension flows, including new tab rendering, focus mode, and blocked-site redirects.

## Quality And CI

- Biome for linting and formatting.
- GitHub Actions for CI workflows that run typecheck, Biome checks, unit tests, browser-level tests, and extension builds.
