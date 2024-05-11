import { Page, chromium, firefox, webkit } from "playwright";

const start = async () => {
  const browser = await chromium.launchPersistentContext("../../tmp", {
    slowMo: 500,
    headless: false,
  }); // Or 'firefox' or 'webkit'.

  const page = await browser.newPage();

  await setupWebSocketIntercept(page);

  await page.goto(
    "https://im.jinritemai.com/pc_seller_v2/main/workspace?selfId=7361247419222990373"
  );

  const element = await page.waitForSelector("textarea");
  console.log("会话已加载: " + (await element.getAttribute("placeholder")));

  async function send() {
    const t = page.locator("textarea").first();

    const s = page.locator("[data-qa-id=qa-send-message-button]").first();

    t.focus();
    t.fill(generatePoem());

    console.log(await t.inputValue());

    s.click();
  }

  page.on("request", (data) => {
    if (data.url().includes("/robot/assistant/answerRecommend")) {
      // console.log("request", data.url());
      const msg_body_list = data.postDataJSON().msg_body_list;
      const msg = msg_body_list?.[0];
      if (msg) {
        const ext = msg?.ext;
        if (msg?.sender_role == "1") {
          // console.log(msg);
          console.log(ext?.nickname, msg?.content, ext?.shop_id, msg?.sender);
          send();
        } else {
          console.log(
            ext?.nickname ?? "Me",
            msg?.content,
            ext?.shop_id,
            msg?.sender
          );
        }
      }
    }
  });

  // other actions...
  // await browser.close();
};

async function setupWebSocketIntercept(page: Page) {
  await page.evaluate(() => {
    const originalWebSocket = window.WebSocket;

    const loggedWebSocket = function (
      url: string | URL,
      protocols?: string | string[] | null
    ) {
      const socket = new originalWebSocket(url);
      socket.addEventListener("message", (event) => {
        console.log("GOT Websocket Message", event.data); // 实际的操作应该更复杂，可能包含一些自定义的逻辑
      });
      return socket;
    };

    loggedWebSocket.prototype = originalWebSocket.prototype;

    window.WebSocket = loggedWebSocket as any;
  });
}

function generatePoem() {
  //定义一些词库
  const adjectives = ["红", "轻", "忧", "静", "冷"];
  const nouns = ["花", "浪", "雨", "月", "风"];
  const verbs = ["落", "荡", "坠", "待", "止"];

  //随机生成诗句
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];

  const poem = `一叶${randomAdjective}${randomNoun}，孤舟${randomVerb}江边。`;

  return poem;
}

start();
