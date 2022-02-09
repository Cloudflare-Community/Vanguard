import type {APIChannel, APIChatInputApplicationCommandInteraction, APIGuildMember, APIMessage, InteractionType, Snowflake} from "discord-api-types";
import { createElement, Message } from "slshx";

const BASE_URL = "https://discord.com/api/v9";

export async function addRole(user: Snowflake, guild: Snowflake, role: Snowflake, reason: string, env: Env) : Promise<Response> {
  return await fetch(`${BASE_URL}/guilds/${guild}/members/${user}/roles/${role}`, {
    method: "PUT",
    headers: {
      Authorization: `Bot ${env.TOKEN}`,
      "X-Audit-Log-Reason": reason,
    }
  });
}

export async function removeRole(user: Snowflake, guild: Snowflake, role: Snowflake, reason: string, env: Env) : Promise<Response> {
  return await fetch(`${BASE_URL}/guilds/${guild}/members/${user}/roles/${role}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bot ${env.TOKEN}`,
      "X-Audit-Log-Reason": reason
    }
  });
}

export async function sendDM(user: Snowflake, content: string, env: Env) : Promise<APIMessage> {
  const channel = await (
    await fetch("https://discord.com/api/v9/users/@me/channels", {
      method:"POST",
      headers: {
        Authorization: env.TOKEN,
        "content-type":"application/json"
      },
      body: JSON.stringify({
        "recipient_id":user
    })})
  ).json() as APIChannel;
  const message = (await
    (await fetch(`https://discord.com/api/v9/channels/${channel.id}/messages`, {
      method: "POST",
      headers: {Authorization: env.TOKEN, "content-type": "application/json"
    },
    body: JSON.stringify({content})
  })).json()) as APIMessage;
  return message;
}

export async function getGuildUser(user: Snowflake, guild: Snowflake, env: Env) : Promise<APIGuildMember> {
  return await (await fetch(`https://discord.com/api/v9/guilds/${guild}/members/${user}`, {method:"GET",headers:{Authorization: env.TOKEN}})).json() as APIGuildMember;
}