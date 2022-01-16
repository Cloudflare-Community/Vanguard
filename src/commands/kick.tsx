import {
  CommandHandler,
  useDescription,
  useUser,
  useString,
  createElement,
  Message,
} from "slshx";
import type {Snowflake} from "discord-api-types";
import {sendDM} from "../utils";

export default function kick(): CommandHandler<Env> {
  useDescription("kicks a user");
  const user = useUser("user", "user to ban", { required: true });
  const reason = useString("reason", "reason for ban", { required: true });
  return async (interaction, env) => {
    await sendDM(user.id, `<@${user.id}>, you have been kicked for ${reason}.`, env);
    if(!interaction.guild_id) return <Message ephemeral>⚠️Error: Guild was not detected.⚠️</Message>;
    await kickUser(user.id, interaction.guild_id, reason, env);
    return <Message ephemeral>{`<@${user.id}>`} has been kicked for {reason}</Message>;
  };
}

async function kickUser(user: Snowflake, guild: Snowflake, reason: string, env: Env) {
  return await fetch(`https://discord.com/api/v9/guilds/${guild}/members/${user}`, {method:"DELETE",headers:{Authorization: env.TOKEN,"X-Audit-Log-Reason":reason}});
}