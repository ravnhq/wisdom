import type { AllowedTopic, ImageMeta } from "../types.ts";

const META_KEY_SUFFIX = "meta.json";

function metaKey(topic: AllowedTopic): string {
  return `images/${topic}/${META_KEY_SUFFIX}`;
}

function imageKey(topic: AllowedTopic, photoId: string): string {
  return `images/${topic}/${photoId}.jpg`;
}

export async function getCachedMeta(
  bucket: R2Bucket,
  topic: AllowedTopic,
): Promise<ImageMeta | null> {
  const object = await bucket.get(metaKey(topic));
  if (!object) return null;
  return object.json<ImageMeta>();
}

export async function storeImage(
  bucket: R2Bucket,
  topic: AllowedTopic,
  photoId: string,
  imageData: ArrayBuffer,
  meta: Omit<ImageMeta, "url" | "cachedAt">,
  publicBaseUrl: string,
): Promise<ImageMeta> {
  const key = imageKey(topic, photoId);

  await bucket.put(key, imageData, {
    httpMetadata: { contentType: "image/jpeg" },
  });

  const stored: ImageMeta = {
    ...meta,
    url: `${publicBaseUrl}/${key}`,
    cachedAt: new Date().toISOString(),
  };

  await bucket.put(metaKey(topic), JSON.stringify(stored), {
    httpMetadata: { contentType: "application/json" },
  });

  return stored;
}
