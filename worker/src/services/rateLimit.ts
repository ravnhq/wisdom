const REQUESTS_PER_MINUTE = 5;

/**
 * KV-backed sliding-window rate limiter.
 * Returns true when the request is allowed, false when the limit is exceeded.
 * The KV key is `ratelimit:{key}:{minute}` and expires after 2 minutes.
 */
export async function checkRateLimit(kv: KVNamespace, key: string): Promise<boolean> {
  const minute = Math.floor(Date.now() / 60_000);
  const kvKey = `ratelimit:${key}:${minute}`;

  const current = await kv.get(kvKey);
  const count = current ? parseInt(current, 10) : 0;

  if (count >= REQUESTS_PER_MINUTE) {
    return false;
  }

  await kv.put(kvKey, String(count + 1), { expirationTtl: 120 });
  return true;
}
