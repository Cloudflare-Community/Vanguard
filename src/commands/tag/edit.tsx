import {
  CommandHandler,
  useDescription,
  useString,
  createElement,
  Message
} from "slshx";

export default function edit(): CommandHandler<Env> {
  useDescription("edits(overwrites) a tag");
  const name = useString("name", "name of tag", { required: true,
    async autocomplete(interaction, env: Env, ctx) {
      if(!interaction.guild_id) return [];
      const tags = await env.KV.list({ prefix: `Tags-${interaction.guild_id}-${name}` }) as KVNamespaceListResult<string>;
      return tags.keys.map((tag) => tag.name.replace(`Tags-${interaction.guild_id}-`, ""));
    } 
  });
  const content = useString("content", "contents of tag", { required: true });
  return async (interaction, env) => {
    if(!interaction.guild_id) return <Message ephemeral>⚠️Error: Guild was not detected.⚠️</Message>;
    await env.KV.put(`Tags-${interaction.guild_id}-${name}`, content);
    return <Message ephemeral>Tag `{name}`` has been assigned value ```
    {content}
    ```</Message>;
  };
}