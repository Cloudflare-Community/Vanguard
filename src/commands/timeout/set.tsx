import {
  CommandHandler,
  useDescription,
  useUser,
  useString,
  useInteger,
  createElement,
  Message,
  Embed,
  Field
} from "slshx";
import type {Snowflake} from "discord-api-types";
import {sendDM,isModerator,getGuildUser,createLog} from "../../utils";

const choices = [{name: "One Minute", value: 60}, {name: "One Hour", value: 3600}, {name: "One Day", value: 86400}];

export default function set(): CommandHandler<Env> {
  useDescription("sets a timeout");
  const user = useUser("user", "user to timeout", { required: true });
  const reason = useString("reason", "reason for timeout", { required: true });
  const duration = useInteger("duration", "duration user will be timed out", { required: true, choices });
  return async (interaction, env) => {
    if(!interaction.guild_id) return <Message ephemeral>❌Error: Guild was not detected.❌</Message>;
    if(!interaction.member) return <Message ephemeral>❌Error: You must be a member of this guild to use this command.❌</Message>;
    if(!(await isModerator(interaction, env))) return <Message ephemeral>❌Error: You must be a moderator to use this command.❌</Message>;
    const guildUser = await getGuildUser(user ? user.id : interaction.member.user.id, interaction.guild_id, env);
    if(!guildUser) return <Message ephemeral>❌Error: GuildMember was not found.❌</Message>;
    if(!guildUser.user) return <Message ephemeral>❌Error: GuildMember did not have a valid user.❌</Message>;
    await timeOut(user.id, interaction.guild_id, reason, duration, env);
    await sendDM(user.id, `<@${user.id}>, you have been timed out for ${reason}.`, env);
    const msg = <Message ephemeral>
      <Embed
        title={`Timed out User`}
        timestamp={new Date()}
        color={16705372}
        thumbnail={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`}
        footer={{text:"Command Executed by Rhiannon", iconUrl:`https://cdn.discordapp.com/avatars/922374334159409173/00da613d16217aa6b2ff31e01ba25c1c.webp`}}
      >
        <Field name="Target:">{`<@${user.id}>`}</Field>
        <Field name="Duration">{choices.find(e => e.value === duration)}</Field>
        <Field name="Reason:">{reason}</Field>
        <Field name="Invoked By:">{`<@${interaction.member.user.id}>`}</Field>
      </Embed>
    </Message>;
    const res = await createLog(interaction.guild_id, msg, env);
    switch(res) {
      case "Missing Channel":
        msg.content = "⚠️Warning: This server does not currently have a moderation log channel. Any actions taken without one configured will not be logged.⚠️";
        return msg;
      case "Error while sending log":
        msg.content = "❌Error: An error occurred while attempting to send the log.❌";
      case "OK":
        return msg;
    }
  };
}

export async function timeOut(user: Snowflake, guild: Snowflake, reason: string, duration: number, env: Env) {
  const timeOutEnd = new Date();
  timeOutEnd.setSeconds(timeOutEnd.getSeconds() + duration);
  return await fetch(`https://discord.com/api/v9/guilds/${guild}/members/${user}`, {method:"PATCH",headers:{Authorization: env.TOKEN,"content-type":"application/json","X-Audit-Log-Reason":reason},body:JSON.stringify({"communication_disabled_until":timeOutEnd})});
}