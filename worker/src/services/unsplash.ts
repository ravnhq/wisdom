const UNSPLASH_API = "https://api.unsplash.com";

interface UnsplashPhoto {
  id: string;
  urls: { full: string; regular: string };
  alt_description: string | null;
  description: string | null;
  user: { name: string; links: { html: string } };
}

export interface FetchedPhoto {
  id: string;
  downloadUrl: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
}

export async function fetchRandomPhoto(topic: string, accessKey: string): Promise<FetchedPhoto> {
  const url = `${UNSPLASH_API}/photos/random?query=${encodeURIComponent(topic)}&orientation=landscape&content_filter=high`;
  const response = await fetch(url, {
    headers: { Authorization: `Client-ID ${accessKey}` },
  });

  if (!response.ok) {
    throw new Error(`Unsplash API returned ${response.status}`);
  }

  const photo = (await response.json()) as UnsplashPhoto;

  return {
    id: photo.id,
    downloadUrl: photo.urls.regular,
    alt: photo.alt_description ?? photo.description ?? `${topic} wallpaper`,
    photographer: photo.user.name,
    photographerUrl: photo.user.links.html,
  };
}
