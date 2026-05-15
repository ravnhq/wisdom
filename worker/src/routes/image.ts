import { getCachedMeta, storeImage } from "../services/r2.ts";
import { checkRateLimit } from "../services/rateLimit.ts";
import { fetchRandomPhoto } from "../services/unsplash.ts";
import { ALLOWED_TOPICS, type AllowedTopic, type Env, type ImageResponse } from "../types.ts";

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

function isAllowedTopic(value: string): value is AllowedTopic {
  return (ALLOWED_TOPICS as readonly string[]).includes(value);
}

export async function handleImage(request: Request, env: Env): Promise<Response> {
  // Auth
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || authHeader !== `Bearer ${env.WISDOM_API_KEY}`) {
    return json({ error: "Unauthorized" }, 401);
  }

  const url = new URL(request.url);
  const topic = url.searchParams.get("topic") ?? "nature";
  const installId = url.searchParams.get("installId") ?? "anonymous";
  const forceRefresh = url.searchParams.get("refresh") === "1";

  if (!isAllowedTopic(topic)) {
    return json({ error: `Invalid topic. Allowed: ${ALLOWED_TOPICS.join(", ")}` }, 400);
  }

  // Rate limit by installId (primary) and IP (fallback)
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const rateLimitKey = installId !== "anonymous" ? `install:${installId}` : `ip:${ip}`;
  const allowed = await checkRateLimit(env.RATE_LIMIT_KV, rateLimitKey);

  if (!allowed) {
    return json({ error: "Too many requests" }, 429);
  }

  // Return cached image if available and no force refresh requested
  if (!forceRefresh) {
    const cached = await getCachedMeta(env.IMAGES_BUCKET, topic);
    if (cached) {
      const response: ImageResponse = {
        url: cached.url,
        alt: cached.alt,
        credit: cached.photographer,
        photographer: cached.photographer,
      };
      return json(response);
    }
  }

  // Fetch a new photo from Unsplash
  const photo = await fetchRandomPhoto(topic, env.UNSPLASH_ACCESS_KEY);

  // Download the image
  const imageResponse = await fetch(photo.downloadUrl);
  if (!imageResponse.ok) {
    return json({ error: "Failed to download image from Unsplash" }, 502);
  }
  const imageData = await imageResponse.arrayBuffer();

  // Store in R2 and update meta
  const meta = await storeImage(
    env.IMAGES_BUCKET,
    topic,
    photo.id,
    imageData,
    {
      photoId: photo.id,
      alt: photo.alt,
      credit: photo.photographer,
      photographer: photo.photographer,
      photographerUrl: photo.photographerUrl,
    },
    env.R2_PUBLIC_URL,
  );

  const response: ImageResponse = {
    url: meta.url,
    alt: meta.alt,
    credit: meta.photographer,
    photographer: meta.photographer,
  };

  return json(response);
}
