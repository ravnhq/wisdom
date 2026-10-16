# Release Runbook

Wisdom releases are tag-driven. Pushing a version tag builds verified Chrome and Firefox packages, creates a GitHub Release, attaches upload-ready ZIP files, and submits the packages to Chrome Web Store and Firefox Add-ons.

## Versioning

Use SemVer in `package.json`.

```bash
pnpm version patch --no-git-tag-version
```

Use `minor` or `major` instead of `patch` when the release scope requires it. The WXT manifest version is derived from `package.json`, so do not hardcode the version in `wxt.config.ts`.

## Local Release Checks

Run the full quality gate before tagging:

```bash
pnpm verify
pnpm zip:all
```

`pnpm zip:all` creates and validates these files:

- `.output/wisdom-X.Y.Z-chrome.zip`
- `.output/wisdom-X.Y.Z-firefox.zip`
- `.output/wisdom-X.Y.Z-sources.zip`

The validator checks that the Chrome and Firefox extension ZIPs include `manifest.json` at the archive root and that the manifest version matches `package.json`.

## Required GitHub Secrets

Configure these repository secrets before enabling production submission:

- `CHROME_EXTENSION_ID`
- `CHROME_CLIENT_ID`
- `CHROME_CLIENT_SECRET`
- `CHROME_REFRESH_TOKEN`
- `FIREFOX_EXTENSION_ID`
- `FIREFOX_JWT_ISSUER`
- `FIREFOX_JWT_SECRET`

Generate or confirm the values through the Chrome Web Store Developer Dashboard and Firefox Add-ons developer tools. Do not commit `.env.submit` or store credentials in the repository.

## Dry-Run Store Submission

Before the first production release, run the `Release` workflow manually from GitHub Actions with `dry_run` enabled. This builds the same packages and runs:

```bash
pnpm wxt submit --dry-run
```

Use this to verify Chrome and Firefox credentials without uploading the extension for review.

## Publishing

After merging the version bump and release notes, create and push a matching version tag:

```bash
git tag vX.Y.Z
git push origin vX.Y.Z
```

The tag must match the version in `package.json`. For example, package version `0.1.0` must use tag `v0.1.0`.

The `Release` workflow will:

1. Install dependencies with pnpm.
2. Run typecheck, Biome, unit/component tests, and Playwright tests.
3. Create Chrome, Firefox, and Firefox source ZIPs with WXT.
4. Validate package names, manifest inclusion, and manifest version.
5. Create a GitHub Release with the ZIP files attached.
6. Submit to Chrome Web Store and Firefox Add-ons for review.

## Store Review Notes

- Chrome publish target is `default`.
- Firefox channel is `listed`.
- Firefox requires the source ZIP for review.
- Store privacy answers are documented in `docs/STORE_PRIVACY.md`.
- Public privacy policy is maintained in `PRIVACY.md`.
