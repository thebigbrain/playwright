import { chromium, firefox, webkit } from "playwright";

(async () => {
  const browser = await chromium.launch({
    slowMo: 500,
    headless: false,
    chromiumSandbox: true,
    ignoreDefaultArgs: true,
    args: ["--url", "https://artio.faucet.berachain.com/"],
  }); // Or 'firefox' or 'webkit'.

  console.log("browser launched");

  const page = await browser.newPage();
  page.on("console", (msg) => console.log(msg.text()));

  const client = await page.context().newCDPSession(page);
  await client.send("Animation.enable");
  client.on("Animation.animationCreated", () =>
    console.log("Animation created!")
  );
  const response = await client.send("Animation.getPlaybackRate");
  console.log("playback rate is " + response.playbackRate);
  await client.send("Animation.setPlaybackRate", {
    playbackRate: response.playbackRate / 2,
  });

  // other actions...
  // await browser.close();
})();
