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
import {timeOut} from "./set";
import {sendDM,validatePermissions,getGuildUser,createLog} from "../../utils";

export default function remove(): CommandHandler<Env> {
  useDescription("removes a timeout");
  const user = useUser("user", "user to remove timeout from", { required: true });
  const reason = useString("reason", "reason for timeout removal", { required: true });
  return async (interaction, env) => {
    const isInvalid = await validatePermissions(interaction, env);
    if(isInvalid) return isInvalid;
    const guildUser = await getGuildUser(user ? user.id : interaction.member.user.id, interaction.guild_id, env);
    if(!guildUser) return <Message ephemeral>❌Error: GuildMember was not found.❌</Message>;
    if(!guildUser.user) return <Message ephemeral>❌Error: GuildMember did not have a valid user.❌</Message>;
    await sendDM(user.id, `<@${user.id}>, you have been removed from time out for ${reason}.`, env);
    await timeOut(user.id, interaction.guild_id, reason, 0, env);
    const msg = <Message ephemeral>
      <Embed
        title={`Removed Timeout`}
        timestamp={new Date()}
        color={65280}
        thumbnail={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`}
        footer={{text:"Command Executed by Rhiannon", iconUrl:`https://cdn.discordapp.com/avatars/922374334159409173/00da613d16217aa6b2ff31e01ba25c1c.webp`}}
      >
        <Field name="Target:">{`<@${user.id}>`}</Field>
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