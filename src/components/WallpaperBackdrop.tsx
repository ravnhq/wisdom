import { useState } from "react";

const SCRIM = "linear-gradient(120deg, rgba(9, 17, 28, 0.75), rgba(9, 17, 28, 0.25))";

export function WallpaperBackdrop({ url }: { url: string }) {
  const [layers, setLayers] = useState([url]);
  const current = layers[layers.length - 1];
  if (current !== url) setLayers([current, url]);

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 bg-slate-950" data-testid="wallpaper">
      {layers.map((layer, index) => (
        <div
          className={`absolute inset-0 bg-cover bg-center ${index > 0 ? "wallpaper-enter" : ""}`}
          data-wallpaper={layer}
          key={layer}
          onAnimationEnd={() => setLayers([layer])}
          style={{ backgroundImage: `url(${layer})` }}
        />
      ))}
      <div className="absolute inset-0" style={{ background: SCRIM }} />
    </div>
  );
}
