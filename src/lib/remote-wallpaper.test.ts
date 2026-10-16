import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cacheWallpaper,
  fetchDailyWallpaper,
  readCachedWallpaper,
  remoteImageUrl,
} from "./remote-wallpaper";

const API = "http://api.test";
const DAY = "2026-10-16";

function stubImageLoad(outcome: "load" | "error") {
  vi.stubGlobal(
    "Image",
    class {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      set src(_: string) {
        queueMicrotask(() => (outcome === "load" ? this.onload?.() : this.onerror?.()));
      }
    },
  );
}

function stubFetch(response: Response | Error) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => {
      if (response instanceof Error) throw response;
      return response;
    }),
  );
}

const metadata = {
  ok: true,
  data: {
    day: DAY,
    title: "forest, mist",
    credit: "Photo by ana on Pixabay",
    author: "ana",
    authorUrl: "https://pixabay.com/users/ana-7/",
    pageUrl: "https://pixabay.com/photos/forest-42/",
  },
};

describe("fetchDailyWallpaper", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("returns the API image and credit when metadata and image load", async () => {
    stubFetch(Response.json(metadata));
    stubImageLoad("load");

    await expect(fetchDailyWallpaper("orange", DAY, API)).resolves.toEqual({
      day: DAY,
      imageUrl: `${API}/image?palette=orange&day=${DAY}`,
      credit: "Photo by ana on Pixabay",
      attribution: {
        author: "ana",
        authorUrl: "https://pixabay.com/users/ana-7/",
        pageUrl: "https://pixabay.com/photos/forest-42/",
      },
    });
  });

  it("asks the API for the photo that matches the palette", async () => {
    stubFetch(Response.json(metadata));
    stubImageLoad("load");

    await fetchDailyWallpaper("purple", DAY, API);
    expect(fetch).toHaveBeenCalledWith(
      `${API}/image/metadata?palette=purple&day=${DAY}`,
      expect.anything(),
    );
  });

  it("keeps the plain credit when older metadata has no links", async () => {
    stubFetch(Response.json({ ok: true, data: { day: DAY, credit: "Photo by ana on Pixabay" } }));
    stubImageLoad("load");

    const result = await fetchDailyWallpaper("teal", DAY, API);
    expect(result?.credit).toBe("Photo by ana on Pixabay");
    expect(result?.attribution).toBeNull();
  });

  it("rejects links that do not point to pixabay.com", async () => {
    stubFetch(
      Response.json({ ok: true, data: { ...metadata.data, pageUrl: "https://evil.example/x" } }),
    );
    stubImageLoad("load");

    await expect(fetchDailyWallpaper("teal", DAY, API)).resolves.toBeNull();
  });

  it("returns null when the API has no image yet", async () => {
    stubFetch(Response.json({ ok: false, error: { code: "NOT_READY" } }, { status: 503 }));
    stubImageLoad("load");

    await expect(fetchDailyWallpaper("teal", DAY, API)).resolves.toBeNull();
  });

  it("returns null when the network fails", async () => {
    stubFetch(new TypeError("offline"));
    stubImageLoad("load");

    await expect(fetchDailyWallpaper("teal", DAY, API)).resolves.toBeNull();
  });

  it("returns null when the metadata shape is wrong", async () => {
    stubFetch(Response.json({ ok: true, data: { title: "x" } }));
    stubImageLoad("load");

    await expect(fetchDailyWallpaper("teal", DAY, API)).resolves.toBeNull();
  });

  it("returns null when the image itself fails to load", async () => {
    stubFetch(Response.json(metadata));
    stubImageLoad("error");

    await expect(fetchDailyWallpaper("teal", DAY, API)).resolves.toBeNull();
  });

  it("uses the day the API actually served, so a fallback photo is not mislabeled", async () => {
    stubFetch(Response.json({ ...metadata, data: { ...metadata.data, day: "2026-10-15" } }));
    stubImageLoad("load");

    const result = await fetchDailyWallpaper("teal", DAY, API);
    expect(result?.day).toBe("2026-10-15");
    expect(result?.imageUrl).toBe(`${API}/image?palette=teal&day=2026-10-15`);
  });
});

describe("wallpaper cache", () => {
  afterEach(() => localStorage.clear());

  it("only returns today's photo for the palette", () => {
    const wallpaper = {
      day: DAY,
      imageUrl: remoteImageUrl("blue", DAY),
      credit: "Photo by ana on Pixabay",
      attribution: null,
    };
    cacheWallpaper("blue", wallpaper);

    expect(readCachedWallpaper("blue", DAY)).toEqual(wallpaper);
    expect(readCachedWallpaper("blue", "2026-10-17")).toBeNull();
    expect(readCachedWallpaper("red", DAY)).toBeNull();
  });

  it("ignores tampered cache entries", () => {
    localStorage.setItem(
      "wisdom.wallpaper.blue",
      JSON.stringify({
        day: DAY,
        imageUrl: "https://evil.example/x.jpg",
        credit: "x",
        attribution: null,
      }),
    );
    expect(readCachedWallpaper("blue", DAY)).toBeNull();
  });
});
