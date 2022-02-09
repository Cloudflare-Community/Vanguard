import type { APIInteractionResponseCallbackData, Snowflake} from "discord-api-types";

export async function createLog(guild: Snowflake, intRes: APIInteractionResponseCallbackData, env: Env) : Promise<undefined> {
  const channel = await env.KV.get(`Config-${guild}-Logs`) as Snowflake;
  if(!channel) {
    intRes.content = "⚠️Warning: This server does not currently have a moderation log channel. Any actions taken without one configured will not be logged.⚠️";
    return;
  }
  const msgObj = {content:intRes.content,embeds:intRes.embeds,"allowed_mentions":{parse:{}},components:intRes.components};
  try {
    const res = await (await fetch(`https://discord.com/api/v9/channels/${channel}/messages`, {method:"POST",headers:{Authorization: env.TOKEN,"content-type":"application/json"},body:JSON.stringify(msgObj)})).json();
    console.log(res);
    return;
  } catch(e) {
    intRes.content = "❌Error: An error occurred while attempting to send the log.❌";
    return;
  }
}