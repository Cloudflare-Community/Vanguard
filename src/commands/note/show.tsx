import {
  CommandHandler,
  useDescription,
  useString,
  useUser,
  createElement,
  Message
} from "slshx";

export default function show(): CommandHandler<Env> {
  useDescription("displays a note");
  const user = useUser("user", "user to show note for", { required: true });
  const name = useString("name", "name of note", { required: true,
    async autocomplete(interaction, env: Env, ctx) {
      console.log(interaction);
      return [];
      // if(!interaction.guild_id) return [];
      // const notes = await env.KV.list({ prefix: `Notes-${interaction.guild_id}-${user.id}-${name}` }) as KVNamespaceListResult<string>;
      // console.log(`Tags for Notes-${interaction.guild_id}-${user.id}-${name}`, notes)
      // return notes.keys.map((note) => note.name.replace(`Notes-${interaction.guild_id}-${user}`, ""));
    }
  });
  return async (interaction, env) => {
    if(!interaction.guild_id) return <Message ephemeral>⚠️Error: Guild was not detected.⚠️</Message>;
    const content = await env.KV.get(`Notes-${interaction.guild_id}-${user}-${name}`);
    if(!content) return <Message ephemeral>⚠️Error: Note `{name}` for user {`<@${user.id}>`} does not exist.⚠️</Message>;
    return <Message>{content}</Message>;
  };
}