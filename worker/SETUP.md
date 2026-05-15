# Wisdom Images Worker — Setup Guide

## Prerequisites

- A Cloudflare account
- `wrangler` CLI authenticated: `wrangler login`

## First-time setup

### 1. Create the R2 bucket

```bash
wrangler r2 bucket create wisdom-images
```

Enable public access in the Cloudflare dashboard under **R2 > wisdom-images > Settings > Public Access**,
then copy the `pub-xxx.r2.dev` URL into `wrangler.toml` as `R2_PUBLIC_URL`.

### 2. Create the KV namespace

```bash
wrangler kv namespace create RATE_LIMIT_KV
```

Copy the `id` from the output and replace `REPLACE_WITH_REAL_KV_ID` in `wrangler.toml`.

### 3. Set secrets

These are never stored in source code or `wrangler.toml`. They live in Cloudflare's encrypted secret store.

```bash
# Unsplash API key (get one free at https://unsplash.com/developers)
wrangler secret put UNSPLASH_ACCESS_KEY

# Shared API key the extension uses to authenticate with this worker.
# Generate a strong random string, e.g.: openssl rand -hex 32
wrangler secret put WISDOM_API_KEY
```

The same `WISDOM_API_KEY` value must be added as a GitHub Actions secret named `WISDOM_API_KEY`
so it can be injected into the extension build (see `.github/workflows/worker-deploy.yml`).

### 4. Local development

```bash
cp .dev.vars.example .dev.vars
# Fill in .dev.vars with your actual keys
pnpm dev   # runs wrangler dev
```

### 5. Deploy

```bash
pnpm deploy   # runs wrangler deploy
```

Or push to `main` — the `worker-deploy.yml` GitHub Actions workflow deploys automatically.

## Rate limiting

The worker uses a KV-backed sliding-window rate limiter (5 requests/minute per install ID).
To change the limit, update `REQUESTS_PER_MINUTE` in `src/services/rateLimit.ts`.

## Secrets summary

| Secret | Where to set |
|---|---|
| `UNSPLASH_ACCESS_KEY` | `wrangler secret put` (production) / `.dev.vars` (local) |
| `WISDOM_API_KEY` | `wrangler secret put` (production) / `.dev.vars` (local) / GitHub Actions secret (CI build) |
| `CLOUDFLARE_API_TOKEN` | GitHub Actions secret only (for automated deploys) |
| `CLOUDFLARE_ACCOUNT_ID` | GitHub Actions secret only (for automated deploys) |
