import messageCreate from "./handlers/MESSAGE_CREATE";
export default class EventHandler implements DurableObject {
  state: DurableObjectState;
  env: Environment;
  ctx: ExecutionContext;
  constructor(state: DurableObjectState, env: Environment, ctx: ExecutionContext) {
    this.env = env;
    this.ctx = ctx;
  }
  async fetch(req: Request) : Promise<Response> {
    this.ctx.waitUntil(this.handleEvent(req));
    return new Response("Message Received.");
  }
  async handleEvent(req: Request) : Promise<void> {
    const payload = await req.json() as any;
    switch(payload.t) {
      case "MESSAGE_CREATE":
        await messageCreate(payload.d, this.env);
    }
  }
}