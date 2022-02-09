import type { APIChatInputApplicationCommandInteraction, APIInteractionResponseCallbackData, Snowflake} from "discord-api-types";

export async function createLog(guild: Snowflake, intRes: APIInteractionResponseCallbackData, env: Env) : Promise<string> {
  const channel = await env.KV.get(`Config-${guild}-Logs`) as Snowflake;
  if(!channel) return "Missing Channel";
  const msgObj = {content:intRes.content,embeds:intRes.embeds,"allowed_mentions":{parse:{}},components:intRes.components};
  try {
    const res = await (await fetch(`https://discord.com/api/v9/channels/${channel}/messages`, {method:"POST",headers:{Authorization: env.TOKEN,"content-type":"application/json"},body:JSON.stringify(msgObj)})).json();
    console.log(res);
    return "OK";
  } catch(e) {
    return "Error while sending log";
  }
}