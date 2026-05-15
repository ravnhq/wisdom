export interface Env {
  WISDOM_API_KEY: string;
  UNSPLASH_ACCESS_KEY: string;
  IMAGES_BUCKET: R2Bucket;
  RATE_LIMIT_KV: KVNamespace;
  R2_PUBLIC_URL: string;
}

export const ALLOWED_TOPICS = [
  "nature",
  "mountains",
  "ocean",
  "forest",
  "city",
  "abstract",
  "space",
  "architecture",
  "desert",
  "autumn",
] as const;

export type AllowedTopic = (typeof ALLOWED_TOPICS)[number];

export interface ImageMeta {
  photoId: string;
  url: string;
  alt: string;
  credit: string;
  photographer: string;
  photographerUrl: string;
  cachedAt: string;
}

export interface ImageResponse {
  url: string;
  alt: string;
  credit: string;
  photographer: string;
}
