export function normalizeDomain(value: string): string {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) {
    return "";
  }

  const withProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    return new URL(withProtocol).hostname.replace(/^www\./, "");
  } catch {
    return (
      trimmed
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .split("/")[0] ?? ""
    );
  }
}

export function normalizeBlockedDomains(domains: string[]): string[] {
  return Array.from(new Set(domains.map(normalizeDomain).filter(Boolean))).sort();
}

export function getHostnameFromUrl(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

export function isBlockedUrl(url: string, blockedDomains: string[]): boolean {
  const hostname = getHostnameFromUrl(url);
  if (!hostname) {
    return false;
  }

  return normalizeBlockedDomains(blockedDomains).some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
  );
}

export function getBlockedSiteVariant(
  url: string,
): "youtube" | "instagram" | "linkedin" | "generic" {
  const hostname = getHostnameFromUrl(url) ?? "";
  if (hostname.endsWith("youtube.com")) return "youtube";
  if (hostname.endsWith("instagram.com")) return "instagram";
  if (hostname.endsWith("linkedin.com")) return "linkedin";
  return "generic";
}
