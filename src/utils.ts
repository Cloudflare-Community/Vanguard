import type {APIChannel, APIMessage, Snowflake} from "discord-api-types";
export async function sendDM(user: Snowflake, content: string, env: Env) {
  /* Create DM */
  const channel = await (await fetch("https://discord.com/api/v9/users/@me/channels", {method:"POST",headers:{Authorization: env.TOKEN,"content-type":"application/json"},body:JSON.stringify({"recipient_id":user})})).json() as APIChannel;
  console.log(channel);
  /* Send message */
  const message = (await (await fetch(`https://discord.com/api/v9/channels/${channel.id}/messages`, {method:"POST",headers:{Authorization: env.TOKEN,"content-type":"application/json"},body:JSON.stringify({content})})).json()) as APIMessage;
  return message;
}