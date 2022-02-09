export async function createWebsocket(url: string) : Promise<WebSocket> {
  let resp = await fetch(url, {headers: {Upgrade: "websocket"}});
  let ws = resp.webSocket;
  if (!ws) throw new Error("server didn't accept WebSocket");
  ws.accept();
  return ws;
}

export function sendIdent(shard: number[], env: Environment) {
  return JSON.stringify({
    op: 2,
    d: {
      token: env.TOKEN,
      // Replace this with the intents you intend to capture.
      intents: 581,
      shard,
      properties: {
        $os: "FlareOS",
        $browser: "DurableObject",
        $device: "metalID",
      }
    }
  });
}
