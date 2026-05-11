# Tooling And CI Standards

## Package Management

- Use pnpm as the package manager.
- Commit the lockfile.
- Keep scripts consistent and easy to run locally before CI.

## Code Quality Tools

- Use TypeScript typecheck as a required quality gate.
- Use Biome for linting and formatting.
- Prefer one command for local verification that mirrors CI.

## Recommended Scripts

- `pnpm dev` for local WXT development.
- `pnpm build` for extension builds.
- `pnpm typecheck` for TypeScript validation.
- `pnpm check` for Biome linting and formatting checks.
- `pnpm test` for Vitest.
- `pnpm test:e2e` for Playwright extension flows.
- `pnpm verify` for the full local quality gate.

## GitHub Actions

- CI should run on pull requests and main branch pushes.
- Use pnpm caching to keep installs fast.
- Run install, typecheck, Biome checks, unit tests, Playwright tests, and WXT build.
- Upload build artifacts only when useful for release review.
- Keep workflow steps explicit so failures are easy to understand.

## Release Readiness

- Build Chrome/Chromium and Firefox packages through WXT.
- Verify store package requirements before publishing.
- Keep release notes focused on user-facing changes and permissions changes.
