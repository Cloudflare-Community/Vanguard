import {
  CommandHandler,
  useDescription,
  useUser,
  useString,
  useInteger,
  createElement,
  Embed,
  Field,
  Message
} from "slshx";
import type {Snowflake} from "discord-api-types";
import {sendDM,validatePermissions,getGuildUser,createLog} from "../utils";

export default function ban(): CommandHandler<Env> {
  useDescription("bans a user");
  const user = useUser("user", "user to ban", { required: true });
  const reason = useString("reason", "reason for ban", { required: true });
  const days = useInteger("days", "number of days to delete messages");
  return async (interaction, env) => {
    const isInvalid = await validatePermissions(interaction, env);
    if(isInvalid) return isInvalid;
    if(user.id === "922374334159409173") return <Message ephemeral>❌Error: You cannot ban Vanguard with this command.❌</Message>;
    if(days && (days < 0 || days > 7)) return <Message ephemeral>Error: Invalid days, must be between 0 and 7</Message>;
    const guildUser = await getGuildUser(user.id, interaction.guild_id as Snowflake, env);
    if(!guildUser.user) return <Message ephemeral>❌Error: User was not found.❌</Message>;
    await sendDM(user.id, `<@${user.id}>, you have been banned for ${reason}.`, env);
    await createBan(user.id, interaction.guild_id as Snowflake, reason, days || 1, env);
    const msg = <Message ephemeral>
      <Embed
        title={"Banned User"}
        timestamp={new Date()}
        color={15548997}
        thumbnail={`https://cdn.discordapp.com/avatars/${guildUser.user.id}/${guildUser.user.avatar}.webp`}
        footer={{text:"Command Executed by Vanguard", iconUrl:`https://cdn.discordapp.com/avatars/922374334159409173/00da613d16217aa6b2ff31e01ba25c1c.webp`}}
      >
        <Field name="Target:">{`<@${user.id}>`}</Field>
        <Field name="Snowflake:">`{user.id}`</Field>
        <Field name="Reason:">{reason}</Field>
        <Field name="Invoked By:">{`<@${interaction.user!.id}>`}</Field>
      </Embed>
    </Message>;
    await createLog(interaction.guild_id!, msg, env);
    return msg;
  };
}

async function createBan(user: Snowflake, guild: Snowflake, reason: string, days: number, env: Env) : Promise<Response> {
  const body = JSON.stringify({"delete_message_days": days});
  return await fetch(`https://discord.com/api/v9/guilds/${guild}/bans/${user}`, {method:"PUT",headers:{Authorization: env.TOKEN,"content-type":"application/json","X-Audit-Log-Reason":reason},body});
}