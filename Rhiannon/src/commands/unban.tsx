import {
  CommandHandler,
  useDescription,
  useString,
  createElement,
  Message,
  Embed,
  Field
} from "slshx";
import type {APIBan,Snowflake} from "discord-api-types";
import {validatePermissions, createLog} from "../utils";

export default function unban(): CommandHandler<Env> {
  useDescription("unbans a user");
  const user = useString("user", "user to unban", { required: true }) as Snowflake;
  const reason = useString("reason", "reason for unban", { required: true });
  return async (interaction, env) => {
    const isInvalid = await validatePermissions(interaction, env);
    if(isInvalid) return isInvalid;
    const ban = await getBan(user, interaction.guild_id!, env);
    if(!ban) return <Message ephemeral>❌Error: User is not banned.❌</Message>;
    await removeBan(user, interaction.guild_id!, reason, env);
    const msg = <Message ephemeral>
      <Embed
        title={"Unbanned User"}
        timestamp={new Date()}
        color={5763719}
        thumbnail={`https://cdn.discordapp.com/avatars/${ban.user.id}/${ban.user.avatar}.webp`}
        footer={{text:"Command Executed by Vanguard", iconUrl:`https://cdn.discordapp.com/avatars/922374334159409173/00da613d16217aa6b2ff31e01ba25c1c.webp`}}
      >
        <Field name="Target:">{`<@${ban.user.id}>`}</Field>
        <Field name="Reason:">{reason}</Field>
        <Field name="Invoked By:">{`<@${interaction.member!.user.id}>`}</Field>
      </Embed>
    </Message>;
    await createLog(interaction.guild_id!, msg, env);
    return msg;
  };
}

async function getBan(user: Snowflake, guild: Snowflake, env: Env) : Promise<APIBan | null> {
  const res : any = await (await fetch(`https://discord.com/api/v9/guilds/${guild}/bans/${user}`, {method:"GET",headers:{Authorization: env.TOKEN}})).json();
  if(res.code === 10026) return null;
  return res;
}

function removeBan(user: Snowflake, guild: Snowflake, reason: string, env: Env) : Promise<Response> {
  return fetch(`https://discord.com/api/v9/guilds/${guild}/bans/${user}`, {method:"DELETE",headers:{Authorization: env.TOKEN,"X-Audit-Log-Reason":reason}});
}