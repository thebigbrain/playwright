const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const args = browser.process?.spawnargs;
  await browser.close();
})();
