import {
  CommandHandler,
  useDescription,
  useUser,
  useString,
  useInteger,
  createElement,
  Message
} from "slshx";
import type {Snowflake} from "discord-api-types";
import {sendDM} from "../utils";

export default function ban(): CommandHandler<Env> {
  useDescription("bans a user");
  const user = useUser("user", "user to ban", { required: true });
  const reason = useString("reason", "reason for ban", { required: true });
  const days = useInteger("days", "number of days to delete messages");
  return async (interaction, env) => {
    if(days && (days < 0 || days > 7)) return <Message ephemeral>Error: Invalid days, must be between 0 and 7</Message>;
    await sendDM(user.id, `<@${user.id}>, you have been banned for ${reason}.`, env);
    if(!interaction.guild_id) return <Message ephemeral>⚠️Error: Guild was not detected.⚠️</Message>;
    await createBan(user.id, interaction.guild_id, reason, days, env);
    return <Message ephemeral>{`<@${user.id}>`} has been banned for {reason}</Message>;
  };
}

async function createBan(user: Snowflake, guild: Snowflake, reason: string, days: number | null, env: Env) {
  let body = "{}";
  if(days) body = JSON.stringify({"delete_message_days": days});
  return await fetch(`https://discord.com/api/v9/guilds/${guild}/bans/${user}`, {method:"PUT",headers:{Authorization: env.TOKEN,"content-type":"application/json","X-Audit-Log-Reason":reason},body});
}