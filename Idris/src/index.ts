import Shard from "./shard";
import Event from "./events";
export {Shard, Event};
import type {APIGatewayBotInfo} from "discord-api-types";
const sleep = m => new Promise(r => setTimeout(r, m, []));

export default {
  scheduled(event: ScheduledEvent, env: Environment, ctx: ExecutionContext) {
    ctx.waitUntil(spinUpGateways(env))
  }
}

async function spinUpGateways(env: Environment) : Promise<any> {
  const gatewayStat = await (await fetch("https://discord.com/api/v9/gateway/bot", {headers:{Authorization:this.env.TOKEN}})).json() as APIGatewayBotInfo;
  let shards = await env.KV.get("shards", {type:"json"}) as string[];
  if(shards.length !== gatewayStat.shards) {  
    await multiDel(shards, env);
    shards = generateMultShardIds(gatewayStat.shards, env);
  }
  return await multiPing(shards, env);
}

function generateMultShardIds(ammt: number, env: Environment) {
  const arr = [];
  for(let i = 0; i < ammt; i++) arr.push(env.SHARD.newUniqueId().toString());
  return arr;
}

async function multiPing(shards: string[], env: Environment) : Promise<void> {
  for(let i = 0; i < shards.length; i++) {
    await env.SHARD.get(env.SHARD.idFromString(shards[i])).fetch(`https://discord.cloudflare.dev/ping?id=${i}&total=${shards.length}`);
    if(i < shards.length) await sleep(5000);
  };
  return;
}

async function multiDel(shards: string[], env: Environment) : Promise<any> {
  const arr = [];
  for(let i = 0; i < shards.length; i++) arr.push(env.SHARD.get(env.SHARD.idFromString(shards[i])).fetch(`https://discord.cloudflare.dev/delete`));
  return Promise.all(arr);
}
