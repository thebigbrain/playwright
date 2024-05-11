import { Page, chromium, firefox, webkit } from "playwright";

const start = async () => {
  const browser = await chromium.launchPersistentContext("zhihu", {
    slowMo: 500,
    headless: false,
  }); // Or 'firefox' or 'webkit'.

  const page = await browser.newPage();

  await page.goto("https://www.zhihu.com");

  console.log("pages", browser.pages().length);

  // other actions...
  // await browser.close();
};

start();
