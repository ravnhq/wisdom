export function getGreeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function formatTime(date = new Date()): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

const pad = (value: number) => String(value).padStart(2, "0");

export function localDay(date = new Date()): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function msUntilNextDay(date = new Date()): number {
  const midnight = new Date(date);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - date.getTime();
}
