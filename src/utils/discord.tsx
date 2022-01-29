import type { Snowflake } from "discord-api-types";

const BASE_URL = 'https://discord.com/api/v9'

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