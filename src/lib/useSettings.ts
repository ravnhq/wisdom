import { useCallback, useEffect, useState } from "react";
import { getSettings, saveSettings } from "./storage";
import type { LoadState, WisdomSettings } from "./types";

export function useSettings() {
  const [state, setState] = useState<LoadState<WisdomSettings>>({ status: "loading" });

  useEffect(() => {
    let mounted = true;

    getSettings()
      .then((settings) => {
        if (mounted) setState({ status: "ready", data: settings });
      })
      .catch(() => {
        if (mounted) setState({ status: "error", message: "Settings could not be loaded." });
      });

    return () => {
      mounted = false;
    };
  }, []);

  const setSettings = useCallback(async (settings: WisdomSettings) => {
    const saved = await saveSettings(settings);
    setState({ status: "ready", data: saved });
    return saved;
  }, []);

  return { state, setSettings };
}
