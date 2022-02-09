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
import {validatePermissions,getGuildUser,sendDM,createLog} from "utils";

export default function warn(): CommandHandler<Env> {
  useDescription("warns a user");
  const user = useUser("user", "user to warn", { required: true });
  const warning = useString("warning", "warning message", { required: true });
  return async (interaction, env) => {
    const valid = await validatePermissions(interaction, env);
    if(valid) return valid;
    const guildMember = await getGuildUser(user ? user.id : interaction.member.user.id, interaction.guild_id, env);
    if(!guildMember) return <Message ephemeral>❌Error: GuildMember was not found.❌</Message>;
    await sendDM(user.id, warning, env);
    const msg = <Message ephemeral>
      <Embed
        title={"Warned User"}
        timestamp={new Date()}
        color={16776960}
        thumbnail={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`}
        footer={{text:"Command Executed by Rhiannon", iconUrl:`https://cdn.discordapp.com/avatars/922374334159409173/00da613d16217aa6b2ff31e01ba25c1c.webp`}}
      >
        <Field name="Target:">{`<@${user.id}>`}</Field>
        <Field name="Warning:">{warning}</Field>
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