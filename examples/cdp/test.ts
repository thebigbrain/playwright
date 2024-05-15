import { chromium } from "playwright";

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

  const client = await page.context().newCDPSession(page);

  console.log(await client.send("Emulation.canEmulate"));

  console.log(await client.send("Memory.getDOMCounters"));

  // await page.goto("https://www.zhihu.com");
  await page.goto("https://artio.faucet.berachain.com/#dapps");
  await page.goto("https://blog.skk.moe/post/bypass-hcaptcha/");

  // other actions...
  // await browser.close();
})();
