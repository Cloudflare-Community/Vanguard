import {
  CommandHandler,
  useDescription,
  useString,
  useUser,
  createElement,
  Message
} from "slshx";

export default function del(): CommandHandler<Env> {
  useDescription("deletes a note");
  const user = useUser("user", "user to delete note from", { required: true });
  const name = useString("name", "name of note", { required: true,
    async autocomplete(interaction, env: Env, ctx) {
      console.log(interaction);
      return [];
      // if(!interaction.guild_id) return [];
      // const tags = await env.KV.list({ prefix: `Notes-${interaction.guild_id}-${user.id}-${name}` }) as KVNamespaceListResult<string>;
      // return tags.keys.map((tag) => tag.name.replace(`Notes-${interaction.guild_id}-${user.id}`, ""));
    } 
  });
  return async (interaction, env) => {
    if(!interaction.guild_id) return <Message ephemeral>⚠️Error: Guild was not detected.⚠️</Message>;
    await env.KV.delete(`Notes-${interaction.guild_id}-${user.id}-${name}`);
    return <Message ephemeral>Note `{name}` for {`<@${user.id}>`} has been deleted.</Message>;
  };
}