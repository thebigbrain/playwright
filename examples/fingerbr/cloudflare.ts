import { chromium, firefox, webkit } from "playwright";

(async () => {
  const browser = await chromium.launch({
    slowMo: 500,
    headless: false,
    chromiumSandbox: true,
    ignoreDefaultArgs: true,
    args: ["--url", "https://artio.faucet.berachain.com/"],
  }); // Or 'firefox' or 'webkit'.
  const page = await browser.newPage();

  // other actions...
  // await browser.close();
})();
