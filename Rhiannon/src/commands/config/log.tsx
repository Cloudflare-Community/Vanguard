import {
  CommandHandler,
  useDescription,
  useChannel,
  createElement,
  Message,
  Embed,
  Field
} from "slshx";
import {createLog} from "../../utils";

export default function log(): CommandHandler<Env> {
  useDescription("sets the log channel for the server");
  const channel = useChannel("channel", "channel to log to", { required: true });
  return async (interaction, env) => {
    if(!interaction.guild_id) return <Message ephemeral>❌Error: Guild was not detected.❌</Message>;
    if(!interaction.member) return <Message ephemeral>❌Error: Member was not detected.❌</Message>;
    await env.KV.put(`Config-${interaction.guild_id}-Logs`, channel.id);
    const msg = <Message ephemeral>
      <Embed
        title={"Edited Log Channel"}
        timestamp={new Date()}
        color={5793266}
        footer={{text:"Command Executed by Rhiannon", iconUrl:`https://cdn.discordapp.com/avatars/922374334159409173/00da613d16217aa6b2ff31e01ba25c1c.webp`}}
      >
        <Field name="Channel:">{`<#${channel.id}>`}</Field>
        <Field name="Invoked by:">{`<@${interaction.member.user.id}>`}</Field>
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