import { chromium, firefox, webkit } from "playwright";

const userAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

(async () => {
  const browser = await chromium.launch({
    slowMo: 500,
    headless: false,
  }); // Or 'firefox' or 'webkit'.
  const page = await browser.newPage({
    userAgent,
    screen: {
      width: 1920,
      height: 1200,
    },
  });

  page.setDefaultTimeout(180_000);
  page.setDefaultNavigationTimeout(180_000);

  page.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined });
  });

  await page.goto("https://artio.faucet.berachain.com/");

  // other actions...
  // await browser.close();
})();
