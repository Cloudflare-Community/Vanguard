import {
  CommandHandler,
  useDescription,
  useString,
  createElement,
  Message,
} from "slshx";
import type {Snowflake} from "discord-api-types";

export default function unban(): CommandHandler<Env> {
  useDescription("unbans a user");
  const user = useString("user", "user to unban", { required: true }) as Snowflake;
  const reason = useString("reason", "reason for unban", { required: true });
  return async (interaction, env) => {
    if(!interaction.guild_id) return <Message ephemeral>⚠️Error: Guild was not detected.⚠️</Message>;
    await removeBan(user, interaction.guild_id, reason, env);
    return <Message ephemeral>{`<@${user}>`} has been unbanned for {reason}</Message>;
  };
}

async function removeBan(user: Snowflake, guild: Snowflake, reason: string, env: Env) {
  return await fetch(`https://discord.com/api/v9/guilds/${guild}/bans/${user}`, {method:"DELETE",headers:{Authorization: env.TOKEN,"X-Audit-Log-Reason":reason}});
}