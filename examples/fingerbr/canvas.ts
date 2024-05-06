import { chromium, firefox, webkit } from "playwright";

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({
    screen: {
      width: 480,
      height: 320,
    },
  });

  // 在页面上下文中注入脚本来重写toDataURL方法
  await page.addInitScript(() => {
    const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function (type, quality) {
      const r = origToDataURL.call(this, type, (quality || 1) * 0.93);
      console.log(r);
      return r;
    };
  });

  await page.goto("https://browserleaks.com/canvas");
  // 接下来的操作...

  // await browser.close();
})();
