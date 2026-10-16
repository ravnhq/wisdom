import { useEffect, useRef } from "react";
import { quotes } from "./data";
import { quoteForDay } from "./quotes";
import type { WisdomSettings } from "./types";

export function useDailyQuote(
  settings: WisdomSettings | null,
  setSettings: (settings: WisdomSettings) => Promise<WisdomSettings>,
  today: string,
) {
  const checkedOnOpen = useRef(false);

  useEffect(() => {
    if (!settings) return;
    const skipHidden = !checkedOnOpen.current;
    checkedOnOpen.current = true;
    const update = quoteForDay(settings, quotes, today, { skipHidden });
    if (update) void setSettings({ ...settings, ...update });
  }, [settings, setSettings, today]);
}
