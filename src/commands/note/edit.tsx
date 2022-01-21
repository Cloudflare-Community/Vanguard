import {
  CommandHandler,
  useDescription,
  useString,
  createElement,
  Message,
  useUser
} from "slshx";

export default function edit(): CommandHandler<Env> {
  useDescription("edits(overwrites) a note");
  const user = useUser("user", "user to add note to", { required: true });
  const name = useString("name", "name of note", { required: true,
    async autocomplete(interaction, env: Env) {
      if(!interaction.guild_id) return [];
      const tags = await env.KV.list({ prefix: `Notes-${interaction.guild_id}-${user.id}-${name}` }) as KVNamespaceListResult<string>;
      return tags.keys.map((tag) => tag.name.replace(`Notes-${interaction.guild_id}-${user.id}`, ""));
    } 
  });
  const content = useString("content", "contents of note", { required: true });
  return async (interaction, env) => {
    if(!interaction.guild_id) return <Message ephemeral>❌Error: Guild was not detected.❌</Message>;
    await env.KV.put(`Notes-${interaction.guild_id}-${user.id}-${name}`, content);
    return <Message ephemeral>Note `{name}` for user {`<@${user.id}>`} has been assigned value ```
    {content}
    ```</Message>;
  };
}