import WebSocket from "ws";

const ws = new WebSocket("ws://localhost:9222/devtools/browser");

ws.on("open", () => {
  ws.send(
    JSON.stringify({
      id: 1,
      method: "Browser.getVersion",
    })
  );
});

ws.on("message", (message) => {
  console.log(`Received: ${message}`);
});
