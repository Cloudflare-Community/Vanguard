import {
  CommandHandler,
  useDescription,
  useUser,
  useString,
  useInteger,
  createElement,
  Message,
} from "slshx";
import type {Snowflake} from "discord-api-types";
import {sendDM} from "../../utils";

export default function ban(): CommandHandler<Env> {
  useDescription("sets a timeout");
  const user = useUser("user", "user to timeout", { required: true });
  const reason = useString("reason", "reason for timeout", { required: true });
  const duration = useInteger("duration", "duration user will be timed out", { required: true, choices: [{name: "one minute", value: 60}, {name: "one hour", value: 3600}, {name: "one day", value: 86400}] });
  return async (interaction, env) => {
    await sendDM(user.id, `<@${user.id}>, you have been timed out for ${reason}.`, env);
    if(!interaction.guild_id) return <Message ephemeral>⚠️Error: Guild was not detected.⚠️</Message>;
    await timeOut(user.id, interaction.guild_id, reason, duration, env);
    return <Message ephemeral>{`<@${user.id}>`} has been timed out for {reason}</Message>;
  };
}

export async function timeOut(user: Snowflake, guild: Snowflake, reason: string, duration: number, env: Env) {
  const timeOutEnd = new Date();
  timeOutEnd.setSeconds(timeOutEnd.getSeconds() + duration);
  return await fetch(`https://discord.com/api/v9/guilds/${guild}/members/${user}`, {method:"PATCH",headers:{Authorization: env.TOKEN,"content-type":"application/json","X-Audit-Log-Reason":reason},body:JSON.stringify({"communication_disabled_until":timeOutEnd})});
}