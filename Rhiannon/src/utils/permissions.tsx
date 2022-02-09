import {createElement, Message} from "slshx";
import type {APIChatInputApplicationCommandInteraction, APIInteractionResponseCallbackData, APIRole, Snowflake} from "discord-api-types";

const fields = ["CREATE_INSTANT_INVITE","KICK_MEMBERS","BAN_MEMBERS","ADMINISTRATOR","MANAGE_CHANNELS","MANAGE_GUILD","ADD_REACTIONS","VIEW_AUDIT_LOG","PRIORITY_SPEAKER","STREAM","VIEW_CHANNEL","SEND_MESSAGES","SEND_TTS_MESSAGES","MANAGE_MESSAGES","EMBED_LINKS","ATTACH_FILES","READ_MESSAGE_HISTORY","MENTION_EVERYONE","USE_EXTERNAL_EMOJIS","VIEW_GUILD_INSIGHTS","CONNECT","SPEAK","MUTE_MEMBERS","DEAFEN_MEMBERS","MOVE_MEMBERS","USE_VAD","CHANGE_NICKNAME","MANAGE_NICKNAMES","MANAGE_ROLES","MANAGE_WEBHOOKS","MANAGE_EMOJIS_AND_STICKERS","USE_APPLICATION_COMMANDS","REQUEST_TO_SPEAK","MANAGE_EVENTS","MANAGE_THREADS","CREATE_PUBLIC_THREADS","CREATE_PRIVATE_THREADS","USE_EXTERNAL_STICKERS","SEND_MESSAGES_IN_THREADS","START_EMBEDDED_ACTIVITIES","MODERATE_MEMBERS"];

async function isModerator(interaction: APIChatInputApplicationCommandInteraction, env: Env) : Promise<boolean> {
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

function getPerms(permissions: string) : string[] {
  const perms = BigInt(parseInt(permissions)),
    resolvedPerms : string[] = [];
  for (let [idx, perm] of fields.entries()) if ((perms & 1n<<BigInt(idx)) === 1n<<BigInt(idx)) resolvedPerms.push(perm);
  return resolvedPerms;
}

async function getPermsFromRoles(roles: Snowflake[], guild_id: Snowflake, env: Env) : Promise<string[]> {
  if(!roles || !guild_id) return [];
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

export async function validatePermissions(interaction: APIChatInputApplicationCommandInteraction, env: Env) : Promise<APIInteractionResponseCallbackData | undefined> {
  if(!(await isModerator(interaction, env))) return <Message ephemeral>❌Error: You must be a moderator to use this command.❌</Message>;
  return;
}