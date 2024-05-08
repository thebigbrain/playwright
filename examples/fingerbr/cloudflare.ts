import { chromium, firefox, webkit } from "playwright";

(async () => {
  const browser = await chromium.launch({
    slowMo: 500,
    headless: false,
    chromiumSandbox: true,
    ignoreDefaultArgs: true,
    args: [],
  }); // Or 'firefox' or 'webkit'.
  const page = await browser.newPage({
    screen: {
      width: 1920,
      height: 1200,
    },
    viewport: {
      width: 1920,
      height: 1200,
    },
    ignoreHTTPSErrors: true,
    bypassCSP: true,
    acceptDownloads: true,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
  });

  page.setDefaultTimeout(180_000);
  page.setDefaultNavigationTimeout(180_000);

  page.goto("https://artio.faucet.berachain.com/");

  // other actions...
  // await browser.close();
})();
