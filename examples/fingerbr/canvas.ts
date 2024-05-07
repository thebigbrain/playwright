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
    const b64toUint8Arrays = (b64Data: string, sliceSize = 512) => {
      if (!b64Data) return;
      try {
        const byteCharacters = atob(b64Data);
        const byteArrays: Uint8Array[] = [];

        for (
          let offset = 0;
          offset < byteCharacters.length;
          offset += sliceSize
        ) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);

          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }

        return byteArrays;
      } catch (err) {
        console.log(err);
      }

      return [];
    };

    function addNoice(u?: Uint8Array) {
      if (!u) return;

      const i = u.length / 2;
      u[i] = 0xf0 & u[i];
    }

    const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function (type, quality) {
      const r = origToDataURL.call(this, type, quality);
      const b64head = r.split(",")[0];
      const u8arrays = b64toUint8Arrays(r.split(",")[1]);

      function uint8ArrayToString(u8Arr: Uint8Array) {
        // 将Uint8Array转换为二进制字符串
        const binaryStr = u8Arr.reduce(
          (acc: string, byte: number) => acc + String.fromCharCode(byte),
          ""
        );

        return binaryStr;
      }

      addNoice(u8arrays?.[0]);

      const result =
        b64head +
        "," +
        btoa(
          u8arrays?.reduce(
            (prev, cur) => prev + uint8ArrayToString(cur),
            ""
          ) as string
        );

      console.log(r);
      console.log(result);

      return result;
    };
  });

  await page.goto("https://browserleaks.com/canvas");
  // 接下来的操作...

  // await browser.close();
})();
