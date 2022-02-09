import {
  CommandHandler,
  useDescription,
  useUser,
  useString,
  createElement,
  Message,
  Embed,
  Field
} from "slshx";
import type {Snowflake} from "discord-api-types";
import {sendDM,validatePermissions,getGuildUser,createLog} from "../utils";

export default function kick(): CommandHandler<Env> {
  useDescription("kicks a user");
  const user = useUser("user", "user to ban", { required: true });
  const reason = useString("reason", "reason for ban", { required: true });
  return async (interaction, env) => {
    const isInvalid = await validatePermissions(interaction, env);
    if(isInvalid) return isInvalid;
    if(user.id === "922374334159409173") return <Message ephemeral>❌Error: You cannot kick Vanguard with this command.❌</Message>;
    const guildUser = await getGuildUser(user.id, interaction.guild_id!, env);
    if(!guildUser.user) return <Message ephemeral>❌Error: User was not found.❌</Message>;
    await sendDM(user.id, `<@${user.id}>, you have been kicked for ${reason}.`, env);
    await kickUser(user.id, interaction.guild_id!, reason, env);
    const msg = <Message ephemeral>
      <Embed
        title={"Kicked User"}
        timestamp={new Date()}
        color={15548997}
        thumbnail={`https://cdn.discordapp.com/avatars/${guildUser.user.id}/${guildUser.user.avatar}.webp`}
        footer={{text:"Command Executed by Vanguard", iconUrl:`https://cdn.discordapp.com/avatars/922374334159409173/00da613d16217aa6b2ff31e01ba25c1c.webp`}}
      >
        <Field name="Target:">{`<@${user.id}>`}</Field>
        <Field name="Reason:">{reason}</Field>
        <Field name="Invoked By:">{`<@${interaction.member!.user.id}>`}</Field>
      </Embed>
    </Message>;
    await createLog(interaction.guild_id!, msg, env);
    return msg;
  };
}

async function kickUser(user: Snowflake, guild: Snowflake, reason: string, env: Env) : Promise<Response> {
  return await fetch(`https://discord.com/api/v9/guilds/${guild}/members/${user}`, {method:"DELETE",headers:{Authorization: env.TOKEN,"X-Audit-Log-Reason":reason}});
}