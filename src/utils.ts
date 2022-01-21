import type {APIChannel, APIChatInputApplicationCommandInteraction, APIGuildMember, APIInteractionResponseCallbackData, APIMessage, APIRole, Snowflake} from "discord-api-types";
const fields = ["CREATE_INSTANT_INVITE","KICK_MEMBERS","BAN_MEMBERS","ADMINISTRATOR","MANAGE_CHANNELS","MANAGE_GUILD","ADD_REACTIONS","VIEW_AUDIT_LOG","PRIORITY_SPEAKER","STREAM","VIEW_CHANNEL","SEND_MESSAGES","SEND_TTS_MESSAGES","MANAGE_MESSAGES","EMBED_LINKS","ATTACH_FILES","READ_MESSAGE_HISTORY","MENTION_EVERYONE","USE_EXTERNAL_EMOJIS","VIEW_GUILD_INSIGHTS","CONNECT","SPEAK","MUTE_MEMBERS","DEAFEN_MEMBERS","MOVE_MEMBERS","USE_VAD","CHANGE_NICKNAME","MANAGE_NICKNAMES","MANAGE_ROLES","MANAGE_WEBHOOKS","MANAGE_EMOJIS_AND_STICKERS","USE_APPLICATION_COMMANDS","REQUEST_TO_SPEAK","MANAGE_EVENTS","MANAGE_THREADS","CREATE_PUBLIC_THREADS","CREATE_PRIVATE_THREADS","USE_EXTERNAL_STICKERS","SEND_MESSAGES_IN_THREADS","START_EMBEDDED_ACTIVITIES","MODERATE_MEMBERS"];
export async function sendDM(user: Snowflake, content: string, env: Env) : Promise<APIMessage> {
  /* Create DM */
  const channel = await (await fetch("https://discord.com/api/v9/users/@me/channels", {method:"POST",headers:{Authorization: env.TOKEN,"content-type":"application/json"},body:JSON.stringify({"recipient_id":user})})).json() as APIChannel;
  /* Send message */
  const message = (await (await fetch(`https://discord.com/api/v9/channels/${channel.id}/messages`, {method:"POST",headers:{Authorization: env.TOKEN,"content-type":"application/json"},body:JSON.stringify({content})})).json()) as APIMessage;
  return message;
}

export async function isModerator(interaction: APIChatInputApplicationCommandInteraction, env: Env) : Promise<boolean> {
  if(!interaction || !interaction.guild_id || !interaction.member) {
    console.error("isModerator: interaction is missing guild_id or member");
    return false;
  }
  const modRolesKV : KVNamespaceListKey<string>[] = (await env.KV.list({prefix: `Config-${interaction.guild_id}-perms-`}) as KVNamespaceListResult<string>).keys;
  const modRoles : string[] = modRolesKV.map(kv => kv.name.replace(`Config-${interaction.guild_id}-perms-`, ""));
  for(const role of interaction.member.roles) if(modRoles.includes(role)) return true;
  return isAdmin(interaction.member.permissions);
}

export function isAdmin(permissions: string) : boolean {
  return getPerms(permissions).includes("ADMINISTRATOR");
}

export function getPerms(permissions: string) : string[] {
  const perms = BigInt(parseInt(permissions)),
    resolvedPerms : string[] = [];
  for (let [idx, perm] of fields.entries()) if ((perms & 1n<<BigInt(idx)) === 1n<<BigInt(idx)) resolvedPerms.push(perm);
  return resolvedPerms;
}

export async function getPermsFromRoles(roles: Snowflake[], guild_id: Snowflake, env: Env) : Promise<string[]> {
  const guildRoles = (await (await fetch(`https://discord.com/api/v9/guilds/${guild_id}/roles`, {method:"GET",headers:{Authorization: env.TOKEN}})).json()) as APIRole[];
  const permMap = new Map();
  for (let role of roles) {
    const roleObj = guildRoles.find(r => r.id === role);
    if(!roleObj) continue;
    const perms = getPerms(roleObj.permissions);
    for (let perm of perms) permMap.set(perm, true);
  }
  return Array.from(permMap.keys());
}


export async function getGuildUser(user: Snowflake, guild: Snowflake, env: Env) : Promise<APIGuildMember> {
  return await (await fetch(`https://discord.com/api/v9/guilds/${guild}/members/${user}`, {method:"GET",headers:{Authorization: env.TOKEN}})).json() as APIGuildMember;
}

export async function createLog(guild: Snowflake, intRes: APIInteractionResponseCallbackData, env: Env) : Promise<string> {
  const channel = await env.KV.get(`Config-${guild}-logs`) as Snowflake;
  if(!channel) return "Missing Channel";
  const msgObj = {content:intRes.content,embeds:intRes.embeds,"allowed_mentions":{parse:{}},components:intRes.components};
  console.log(JSON.stringify(msgObj));
  try {
    const res = await (await fetch(`https://discord.com/api/v9/channels/${channel}/messages`, {method:"POST",headers:{Authorization: env.TOKEN,"content-type":"application/json"},body:JSON.stringify(msgObj)})).json();
    console.log(res);
    return "OK";
  } catch(e) {
    return "Error while sending log";
  }
}