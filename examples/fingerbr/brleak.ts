import { chromium, firefox, webkit } from "playwright";

(async () => {
  const browser = await chromium.launch({
    slowMo: 500,
    headless: false,
  }); // Or 'firefox' or 'webkit'.
  const page = await browser.newPage({
    screen: {
      width: 800,
      height: 600,
    },
  });
  await page.goto("https://browserleaks.com/");

  // other actions...
  // await browser.close();
})();
