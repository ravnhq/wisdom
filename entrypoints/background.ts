import { isBlockedUrl } from "../src/lib/blocking";
import { browser } from "../src/lib/browser";
import { getSettings } from "../src/lib/storage";

const blockedPageUrl = (url: string) =>
  browser.runtime.getURL(`blocked.html?url=${encodeURIComponent(url)}`);

export default defineBackground(() => {
  browser.webNavigation.onBeforeNavigate.addListener(async (details) => {
    if (details.frameId !== 0 || details.url.startsWith(browser.runtime.getURL(""))) {
      return;
    }

    const settings = await getSettings();
    if (!settings.focusMode.enabled || !isBlockedUrl(details.url, settings.blockedDomains)) {
      return;
    }

    await browser.tabs.update(details.tabId, { url: blockedPageUrl(details.url) });
  });
});
