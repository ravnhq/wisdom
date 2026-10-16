import { useEffect, useState } from "react";
import { localDay, msUntilNextDay } from "./time";

export function useToday(): string {
  const [today, setToday] = useState(() => localDay());

  useEffect(() => {
    const sync = () => setToday(localDay());
    let timer = 0;
    const scheduleMidnight = () => {
      timer = window.setTimeout(() => {
        sync();
        scheduleMidnight();
      }, msUntilNextDay() + 1_000);
    };
    scheduleMidnight();
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return today;
}
