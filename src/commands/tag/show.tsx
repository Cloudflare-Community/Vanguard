import {
  CommandHandler,
  useDescription,
  useString,
  createElement,
  Message
} from "slshx";

export default function show(): CommandHandler<Env> {
  useDescription("displays a tag");
  const name = useString("name", "name of tag", { required: true,
    async autocomplete(interaction, env: Env, ctx) {
      if(!interaction.guild_id) return [];
      const tags = await env.KV.list({ prefix: `Tags-${interaction.guild_id}-${name}` }) as KVNamespaceListResult<string>;
      return tags.keys.map((tag) => tag.name.replace(`Tags-${interaction.guild_id}-`, ""));
    } 
  });
  return async (interaction, env) => {
    if(!interaction.guild_id) return <Message ephemeral>⚠️Error: Guild was not detected.⚠️</Message>;
    const content = await env.KV.get(`Tags-${interaction.guild_id}-${name}`);
    if(!content) return <Message ephemeral>⚠️Error: Tag `{name}` does not exist.⚠️</Message>;
    return <Message>{content}</Message>;
  };
}