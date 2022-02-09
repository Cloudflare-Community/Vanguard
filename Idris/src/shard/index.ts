import {createWebsocket, sendIdent} from "./ws";
export default class Shard implements DurableObject {
  state: DurableObjectState;
  env: Environment;
  heartbeat_interval = 0;
  heartbeat_loop: number;
  ws: WebSocket | undefined;
  s: number | null = null;
  shardArr: number[] | undefined;
  constructor(state: DurableObjectState, env: Environment, ctx: ExecutionContext) {
    this.state = state;
    this.env = env;
  };
  async fetch(req: Request) : Promise<Response> {
    const url = new URL(req.url);
    if(url.pathname === "/delete") {
      this.ws.close();
      return new Response("WebSocket Terminated.");
    }
    if(!this.shardArr) this.shardArr = [parseInt(url.searchParams.get("id")), parseInt(url.searchParams.get("total"))];
    if(!this.ws) this.ws = await createWebsocket("https://gateway.discord.gg/?v=9&encoding=json");
    this.ws.addEventListener("message", msg => this.handleMessage(msg));
    return new Response("pong");
  };
  async handleMessage(msg: any) {
    let data = JSON.parse(msg.data as string);
    this.s = data.s;
    switch (data.op) {
      case 0:
        await this.handleEvent(data);
        break;
      case 10:
        this.heartbeat_interval = data.d.heartbeat_interval;
        this.heartbeat_loop = setInterval(this.heartbeat);
        this.ws?.send(sendIdent(this.shardArr, this.env));
        break;
    }
  };
  heartbeat() {
    this.ws?.send(JSON.stringify({ op: 1, d: this.s }));
  }
  async handleEvent(data: any) {
    await this.env.EVENT.fetch(JSON.stringify(data));
  }
}
