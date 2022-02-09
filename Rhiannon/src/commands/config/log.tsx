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
        footer={{text:"Command Executed by Vanguard", iconUrl:`https://cdn.discordapp.com/avatars/922374334159409173/00da613d16217aa6b2ff31e01ba25c1c.webp`}}
      >
        <Field name="Channel:">{`<#${channel.id}>`}</Field>
        <Field name="Invoked by:">{`<@${interaction.member.user.id}>`}</Field>
      </Embed>
    </Message>;
    await createLog(interaction.guild_id!, msg, env);
    return msg;
  };
}